import { prisma } from '../../lib/prisma.lib';
import { Prisma, SaleStatus } from '@prisma/client';
import {
  DashboardData,
  LowStockItem,
  OutOfStockItem,
  RecentPurchase,
  RecentSale,
  TopProduct,
} from './dashboard.types';

function toNum(val: Prisma.Decimal | null | undefined): number {
  if (val == null) return 0;
  return Number(val);
}

export class DashboardService {
  async getDashboardData(): Promise<DashboardData> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [
      todaySalesAgg,
      todayPurchasesAgg,
      todayExpensesAgg,
      todayCOGS,
      accountBalance,
      customerDue,
      supplierDue,
      stockValue,
      lowStockRaw,
      outOfStockRaw,
      recentSalesRaw,
      recentPurchasesRaw,
      topProductsRaw,
    ] = await Promise.all([
      // Today's sales (non-cancelled, non-draft)
      prisma.sale.aggregate({
        where: {
          saleDate: { gte: todayStart, lte: todayEnd },
          status: { notIn: [SaleStatus.CANCELLED, SaleStatus.DRAFT] },
        },
        _sum: { grandTotal: true },
        _count: { id: true },
      }),

      // Today's purchases
      prisma.purchase.aggregate({
        where: {
          purchaseDate: { gte: todayStart, lte: todayEnd },
          status: { notIn: ['CANCELLED', 'DRAFT'] },
        },
        _sum: { grandTotal: true },
        _count: { id: true },
      }),

      // Today's expenses
      prisma.expense.aggregate({
        where: { expenseDate: { gte: todayStart, lte: todayEnd } },
        _sum: { amount: true },
        _count: { id: true },
      }),

      // Today's COGS (sum of costPrice * quantity for today's sale items)
      prisma.saleItem.aggregate({
        where: {
          sale: {
            saleDate: { gte: todayStart, lte: todayEnd },
            status: { notIn: [SaleStatus.CANCELLED, SaleStatus.DRAFT] },
          },
        },
        _sum: { totalPrice: true },
      }),

      // Latest account balance (most recent transaction newBalance)
      prisma.accountTransaction.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { newBalance: true },
      }),

      // Total customer receivable
      prisma.customer.aggregate({
        where: { isActive: true },
        _sum: { currentBalance: true },
      }),

      // Total supplier payable
      prisma.supplier.aggregate({
        where: { isActive: true },
        _sum: { currentBalance: true },
      }),

      // Stock value: sum of (currentStock * purchasePrice) via raw query for performance
      prisma.$queryRaw<{ total: string }[]>`
        SELECT COALESCE(SUM(i.current_stock * p.purchase_price), 0)::text AS total
        FROM inventories i
        JOIN products p ON p.id = i.product_id
        WHERE p.status = 'ACTIVE'
      `,

      // Low stock items (currentStock > 0 AND currentStock <= minStock)
      prisma.$queryRaw<
        { id: string; name: string; sku: string; current_stock: string; min_stock: string; unit: string }[]
      >`
        SELECT p.id, p.name, p.sku, i.current_stock::text, p.min_stock::text, p.unit
        FROM inventories i
        JOIN products p ON p.id = i.product_id
        WHERE p.status = 'ACTIVE'
          AND i.current_stock > 0
          AND i.current_stock <= p.min_stock
        ORDER BY i.current_stock ASC
        LIMIT 10
      `,

      // Out of stock items
      prisma.$queryRaw<{ id: string; name: string; sku: string; unit: string }[]>`
        SELECT p.id, p.name, p.sku, p.unit
        FROM inventories i
        JOIN products p ON p.id = i.product_id
        WHERE p.status = 'ACTIVE'
          AND i.current_stock <= 0
        ORDER BY p.name ASC
        LIMIT 10
      `,

      // Recent 7 sales
      prisma.sale.findMany({
        where: { status: { not: SaleStatus.DRAFT } },
        orderBy: { saleDate: 'desc' },
        take: 7,
        select: {
          id: true,
          invoiceNumber: true,
          grandTotal: true,
          paidAmount: true,
          dueAmount: true,
          status: true,
          saleDate: true,
          customer: { select: { name: true } },
        },
      }),

      // Recent 7 purchases
      prisma.purchase.findMany({
        where: { status: { not: 'DRAFT' } },
        orderBy: { purchaseDate: 'desc' },
        take: 7,
        select: {
          id: true,
          invoiceNumber: true,
          grandTotal: true,
          paidAmount: true,
          dueAmount: true,
          status: true,
          purchaseDate: true,
          supplier: { select: { name: true } },
        },
      }),

      // Top 5 products by revenue (last 30 days)
      prisma.$queryRaw<
        { product_id: string; name: string; sku: string; total_qty: string; total_revenue: string }[]
      >`
        SELECT
          si.product_id,
          p.name,
          p.sku,
          SUM(si.quantity)::text AS total_qty,
          SUM(si.total_price)::text AS total_revenue
        FROM sale_items si
        JOIN products p ON p.id = si.product_id
        JOIN sales s ON s.id = si.sale_id
        WHERE s.sale_date >= NOW() - INTERVAL '30 days'
          AND s.status NOT IN ('CANCELLED', 'DRAFT')
        GROUP BY si.product_id, p.name, p.sku
        ORDER BY SUM(si.total_price) DESC
        LIMIT 5
      `,
    ]);

    const totalSales = toNum(todaySalesAgg._sum.grandTotal);
    const salesCount = todaySalesAgg._count.id;
    const totalPurchases = toNum(todayPurchasesAgg._sum.grandTotal);
    const purchasesCount = todayPurchasesAgg._count.id;
    const totalExpenses = toNum(todayExpensesAgg._sum.amount);
    const expensesCount = todayExpensesAgg._count.id;

    // For today's COGS we use sale items totalprice (which represents revenue, not cost)
    // Gross profit = sales revenue - actual COGS from saleItem.costPrice * qty
    const todaySalesCOGS = await prisma.$queryRaw<{ total_cogs: string }[]>`
      SELECT COALESCE(SUM(si.cost_price * si.quantity), 0)::text AS total_cogs
      FROM sale_items si
      JOIN sales s ON s.id = si.sale_id
      WHERE s.sale_date >= ${todayStart}
        AND s.sale_date <= ${todayEnd}
        AND s.status NOT IN ('CANCELLED', 'DRAFT')
    `;
    const cogs = Number(todaySalesCOGS[0]?.total_cogs ?? '0');
    const grossProfit = totalSales - cogs;
    const netProfit = grossProfit - totalExpenses;

    const cashBalance = toNum(accountBalance?.newBalance);
    const totalCustomerDue = toNum(customerDue._sum.currentBalance);
    const totalSupplierDue = toNum(supplierDue._sum.currentBalance);
    const stockValueNum = Number(stockValue[0]?.total ?? '0');

    // Suppress unused variable warning
    void todayCOGS;

    const lowStockItems: LowStockItem[] = lowStockRaw.map((r) => ({
      id: r.id,
      name: r.name,
      sku: r.sku,
      currentStock: Number(r.current_stock),
      minStock: Number(r.min_stock),
      unit: r.unit,
    }));

    const outOfStockItems: OutOfStockItem[] = outOfStockRaw.map((r) => ({
      id: r.id,
      name: r.name,
      sku: r.sku,
      unit: r.unit,
    }));

    const recentSales: RecentSale[] = recentSalesRaw.map((s) => ({
      id: s.id,
      invoiceNumber: s.invoiceNumber,
      customerName: s.customer?.name ?? null,
      grandTotal: toNum(s.grandTotal),
      paidAmount: toNum(s.paidAmount),
      dueAmount: toNum(s.dueAmount),
      status: s.status,
      saleDate: s.saleDate.toISOString(),
    }));

    const recentPurchases: RecentPurchase[] = recentPurchasesRaw.map((p) => ({
      id: p.id,
      invoiceNumber: p.invoiceNumber,
      supplierName: p.supplier.name,
      grandTotal: toNum(p.grandTotal),
      paidAmount: toNum(p.paidAmount),
      dueAmount: toNum(p.dueAmount),
      status: p.status,
      purchaseDate: p.purchaseDate.toISOString(),
    }));

    const topProducts: TopProduct[] = topProductsRaw.map((r) => ({
      productId: r.product_id,
      name: r.name,
      sku: r.sku,
      totalQuantity: Number(r.total_qty),
      totalRevenue: Number(r.total_revenue),
    }));

    return {
      today: {
        totalSales,
        salesCount,
        totalPurchases,
        purchasesCount,
        totalExpenses,
        expensesCount,
        grossProfit,
        netProfit,
      },
      balances: {
        cashBalance,
        totalCustomerDue,
        totalSupplierDue,
        stockValue: stockValueNum,
      },
      stockAlerts: {
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length,
        lowStockItems,
        outOfStockItems,
      },
      recentSales,
      recentPurchases,
      topProducts,
    };
  }
}
