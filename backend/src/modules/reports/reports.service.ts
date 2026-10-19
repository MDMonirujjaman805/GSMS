import { prisma } from '../../lib/prisma.lib';
import { Prisma } from '@prisma/client';
import {
  PaginatedResult,
  SalesPeriodRow,
  SalesProductRow,
  SalesCustomerRow,
  SalesPaymentRow,
  PurchasePeriodRow,
  PurchaseSupplierRow,
  PurchaseProductRow,
  CurrentStockRow,
  StockMovementRow,
  StockValuationSummary,
  ExpiringProductRow,
  IncomeSummaryRow,
  ExpenseSummaryRow,
  ProfitLossSummary,
  CustomerDueRow,
  SupplierDueRow,
  CashFlowRow,
} from './reports.types';

function toNum(v: unknown): number {
  if (v == null) return 0;
  if (v instanceof Prisma.Decimal) return Number(v);
  if (typeof v === 'string') return parseFloat(v) || 0;
  return Number(v);
}

function parsePagination(page?: string, limit?: string): { skip: number; take: number; page: number; limit: number } {
  const p = Math.max(1, parseInt(page ?? '1', 10));
  const l = Math.min(200, Math.max(1, parseInt(limit ?? '20', 10)));
  return { skip: (p - 1) * l, take: l, page: p, limit: l };
}

function dateRange(start: string, end: string): { gte: Date; lte: Date } {
  return {
    gte: new Date(`${start}T00:00:00.000Z`),
    lte: new Date(`${end}T23:59:59.999Z`),
  };
}

// ─── Sales Reports ────────────────────────────────────────────────────────────

export class ReportsService {
  // Daily sales
  async salesDaily(startDate: string, endDate: string, page?: string, limit?: string): Promise<PaginatedResult<SalesPeriodRow>> {
    const { skip, take, page: p, limit: l } = parsePagination(page, limit);
    const rows = await prisma.$queryRaw<
      { period: string; total_sales: string; total_revenue: string; total_cost: string }[]
    >`
      SELECT
        TO_CHAR(s.sale_date AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS period,
        COUNT(DISTINCT s.id)::text AS total_sales,
        COALESCE(SUM(s.grand_total), 0)::text AS total_revenue,
        COALESCE(SUM(si_agg.cogs), 0)::text AS total_cost
      FROM sales s
      LEFT JOIN (
        SELECT sale_id, SUM(cost_price * quantity) AS cogs
        FROM sale_items GROUP BY sale_id
      ) si_agg ON si_agg.sale_id = s.id
      WHERE s.sale_date >= ${new Date(`${startDate}T00:00:00.000Z`)}
        AND s.sale_date <= ${new Date(`${endDate}T23:59:59.999Z`)}
        AND s.status NOT IN ('CANCELLED', 'DRAFT')
      GROUP BY TO_CHAR(s.sale_date AT TIME ZONE 'UTC', 'YYYY-MM-DD')
      ORDER BY period DESC
    `;

    const total = rows.length;
    const sliced = rows.slice(skip, skip + take);
    const data: SalesPeriodRow[] = sliced.map((r) => {
      const revenue = toNum(r.total_revenue);
      const cost = toNum(r.total_cost);
      return {
        period: r.period,
        totalSales: parseInt(r.total_sales),
        totalRevenue: revenue,
        totalCost: cost,
        grossProfit: revenue - cost,
      };
    });
    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  }

  // Weekly sales
  async salesWeekly(startDate: string, endDate: string, page?: string, limit?: string): Promise<PaginatedResult<SalesPeriodRow>> {
    const { skip, take, page: p, limit: l } = parsePagination(page, limit);
    const rows = await prisma.$queryRaw<
      { period: string; total_sales: string; total_revenue: string; total_cost: string }[]
    >`
      SELECT
        TO_CHAR(DATE_TRUNC('week', s.sale_date AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS period,
        COUNT(DISTINCT s.id)::text AS total_sales,
        COALESCE(SUM(s.grand_total), 0)::text AS total_revenue,
        COALESCE(SUM(si_agg.cogs), 0)::text AS total_cost
      FROM sales s
      LEFT JOIN (
        SELECT sale_id, SUM(cost_price * quantity) AS cogs
        FROM sale_items GROUP BY sale_id
      ) si_agg ON si_agg.sale_id = s.id
      WHERE s.sale_date >= ${new Date(`${startDate}T00:00:00.000Z`)}
        AND s.sale_date <= ${new Date(`${endDate}T23:59:59.999Z`)}
        AND s.status NOT IN ('CANCELLED', 'DRAFT')
      GROUP BY DATE_TRUNC('week', s.sale_date AT TIME ZONE 'UTC')
      ORDER BY period DESC
    `;

    const total = rows.length;
    const sliced = rows.slice(skip, skip + take);
    const data: SalesPeriodRow[] = sliced.map((r) => {
      const revenue = toNum(r.total_revenue);
      const cost = toNum(r.total_cost);
      return {
        period: r.period,
        totalSales: parseInt(r.total_sales),
        totalRevenue: revenue,
        totalCost: cost,
        grossProfit: revenue - cost,
      };
    });
    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  }

  // Monthly sales
  async salesMonthly(startDate: string, endDate: string, page?: string, limit?: string): Promise<PaginatedResult<SalesPeriodRow>> {
    const { skip, take, page: p, limit: l } = parsePagination(page, limit);
    const rows = await prisma.$queryRaw<
      { period: string; total_sales: string; total_revenue: string; total_cost: string }[]
    >`
      SELECT
        TO_CHAR(s.sale_date AT TIME ZONE 'UTC', 'YYYY-MM') AS period,
        COUNT(DISTINCT s.id)::text AS total_sales,
        COALESCE(SUM(s.grand_total), 0)::text AS total_revenue,
        COALESCE(SUM(si_agg.cogs), 0)::text AS total_cost
      FROM sales s
      LEFT JOIN (
        SELECT sale_id, SUM(cost_price * quantity) AS cogs
        FROM sale_items GROUP BY sale_id
      ) si_agg ON si_agg.sale_id = s.id
      WHERE s.sale_date >= ${new Date(`${startDate}T00:00:00.000Z`)}
        AND s.sale_date <= ${new Date(`${endDate}T23:59:59.999Z`)}
        AND s.status NOT IN ('CANCELLED', 'DRAFT')
      GROUP BY TO_CHAR(s.sale_date AT TIME ZONE 'UTC', 'YYYY-MM')
      ORDER BY period DESC
    `;

    const total = rows.length;
    const sliced = rows.slice(skip, skip + take);
    const data: SalesPeriodRow[] = sliced.map((r) => {
      const revenue = toNum(r.total_revenue);
      const cost = toNum(r.total_cost);
      return {
        period: r.period,
        totalSales: parseInt(r.total_sales),
        totalRevenue: revenue,
        totalCost: cost,
        grossProfit: revenue - cost,
      };
    });
    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  }

  // Product-wise sales
  async salesByProduct(startDate: string, endDate: string, page?: string, limit?: string): Promise<PaginatedResult<SalesProductRow>> {
    const { skip, take, page: p, limit: l } = parsePagination(page, limit);
    const rows = await prisma.$queryRaw<
      { product_id: string; name: string; sku: string; category: string; total_qty: string; total_revenue: string; total_cost: string }[]
    >`
      SELECT
        si.product_id,
        p.name,
        p.sku,
        c.name AS category,
        SUM(si.quantity)::text AS total_qty,
        SUM(si.total_price)::text AS total_revenue,
        SUM(si.cost_price * si.quantity)::text AS total_cost
      FROM sale_items si
      JOIN products p ON p.id = si.product_id
      JOIN categories c ON c.id = p.category_id
      JOIN sales s ON s.id = si.sale_id
      WHERE s.sale_date >= ${new Date(`${startDate}T00:00:00.000Z`)}
        AND s.sale_date <= ${new Date(`${endDate}T23:59:59.999Z`)}
        AND s.status NOT IN ('CANCELLED', 'DRAFT')
      GROUP BY si.product_id, p.name, p.sku, c.name
      ORDER BY SUM(si.total_price) DESC
    `;

    const total = rows.length;
    const sliced = rows.slice(skip, skip + take);
    const data: SalesProductRow[] = sliced.map((r) => {
      const revenue = toNum(r.total_revenue);
      const cost = toNum(r.total_cost);
      return {
        productId: r.product_id,
        name: r.name,
        sku: r.sku,
        category: r.category,
        totalQuantity: toNum(r.total_qty),
        totalRevenue: revenue,
        totalCost: cost,
        grossProfit: revenue - cost,
      };
    });
    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  }

  // Customer-wise sales
  async salesByCustomer(startDate: string, endDate: string, page?: string, limit?: string): Promise<PaginatedResult<SalesCustomerRow>> {
    const { skip, take, page: p, limit: l } = parsePagination(page, limit);
    const rows = await prisma.$queryRaw<
      { customer_id: string | null; customer_name: string; total_sales: string; total_revenue: string; total_due: string }[]
    >`
      SELECT
        s.customer_id,
        COALESCE(cu.name, 'Walk-in Customer') AS customer_name,
        COUNT(s.id)::text AS total_sales,
        SUM(s.grand_total)::text AS total_revenue,
        SUM(s.due_amount)::text AS total_due
      FROM sales s
      LEFT JOIN customers cu ON cu.id = s.customer_id
      WHERE s.sale_date >= ${new Date(`${startDate}T00:00:00.000Z`)}
        AND s.sale_date <= ${new Date(`${endDate}T23:59:59.999Z`)}
        AND s.status NOT IN ('CANCELLED', 'DRAFT')
      GROUP BY s.customer_id, cu.name
      ORDER BY SUM(s.grand_total) DESC
    `;

    const total = rows.length;
    const sliced = rows.slice(skip, skip + take);
    const data: SalesCustomerRow[] = sliced.map((r) => ({
      customerId: r.customer_id,
      customerName: r.customer_name,
      totalSales: parseInt(r.total_sales),
      totalRevenue: toNum(r.total_revenue),
      totalDue: toNum(r.total_due),
    }));
    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  }

  // Payment method wise sales
  async salesByPayment(startDate: string, endDate: string): Promise<SalesPaymentRow[]> {
    const rows = await prisma.$queryRaw<
      { payment_method: string; total_transactions: string; total_amount: string }[]
    >`
      SELECT
        p.payment_method,
        COUNT(p.id)::text AS total_transactions,
        SUM(p.amount)::text AS total_amount
      FROM payments p
      JOIN sales s ON s.id = p.sale_id
      WHERE s.sale_date >= ${new Date(`${startDate}T00:00:00.000Z`)}
        AND s.sale_date <= ${new Date(`${endDate}T23:59:59.999Z`)}
        AND s.status NOT IN ('CANCELLED', 'DRAFT')
        AND p.payment_status NOT IN ('CANCELLED', 'REFUNDED')
      GROUP BY p.payment_method
      ORDER BY SUM(p.amount) DESC
    `;
    return rows.map((r) => ({
      paymentMethod: r.payment_method,
      totalTransactions: parseInt(r.total_transactions),
      totalAmount: toNum(r.total_amount),
    }));
  }

  // ─── Purchase Reports ─────────────────────────────────────────────────────

  async purchasesDaily(startDate: string, endDate: string, page?: string, limit?: string): Promise<PaginatedResult<PurchasePeriodRow>> {
    const { skip, take, page: p, limit: l } = parsePagination(page, limit);
    const rows = await prisma.$queryRaw<
      { period: string; total_purchases: string; total_amount: string }[]
    >`
      SELECT
        TO_CHAR(purchase_date AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS period,
        COUNT(id)::text AS total_purchases,
        COALESCE(SUM(grand_total), 0)::text AS total_amount
      FROM purchases
      WHERE purchase_date >= ${new Date(`${startDate}T00:00:00.000Z`)}
        AND purchase_date <= ${new Date(`${endDate}T23:59:59.999Z`)}
        AND status NOT IN ('CANCELLED', 'DRAFT')
      GROUP BY TO_CHAR(purchase_date AT TIME ZONE 'UTC', 'YYYY-MM-DD')
      ORDER BY period DESC
    `;
    const total = rows.length;
    const data = rows.slice(skip, skip + take).map((r) => ({
      period: r.period,
      totalPurchases: parseInt(r.total_purchases),
      totalAmount: toNum(r.total_amount),
    }));
    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  }

  async purchasesMonthly(startDate: string, endDate: string, page?: string, limit?: string): Promise<PaginatedResult<PurchasePeriodRow>> {
    const { skip, take, page: p, limit: l } = parsePagination(page, limit);
    const rows = await prisma.$queryRaw<
      { period: string; total_purchases: string; total_amount: string }[]
    >`
      SELECT
        TO_CHAR(purchase_date AT TIME ZONE 'UTC', 'YYYY-MM') AS period,
        COUNT(id)::text AS total_purchases,
        COALESCE(SUM(grand_total), 0)::text AS total_amount
      FROM purchases
      WHERE purchase_date >= ${new Date(`${startDate}T00:00:00.000Z`)}
        AND purchase_date <= ${new Date(`${endDate}T23:59:59.999Z`)}
        AND status NOT IN ('CANCELLED', 'DRAFT')
      GROUP BY TO_CHAR(purchase_date AT TIME ZONE 'UTC', 'YYYY-MM')
      ORDER BY period DESC
    `;
    const total = rows.length;
    const data = rows.slice(skip, skip + take).map((r) => ({
      period: r.period,
      totalPurchases: parseInt(r.total_purchases),
      totalAmount: toNum(r.total_amount),
    }));
    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  }

  async purchasesBySupplier(startDate: string, endDate: string, page?: string, limit?: string): Promise<PaginatedResult<PurchaseSupplierRow>> {
    const { skip, take, page: p, limit: l } = parsePagination(page, limit);
    const rows = await prisma.$queryRaw<
      { supplier_id: string; supplier_name: string; total_purchases: string; total_amount: string; total_due: string }[]
    >`
      SELECT
        pu.supplier_id,
        su.name AS supplier_name,
        COUNT(pu.id)::text AS total_purchases,
        SUM(pu.grand_total)::text AS total_amount,
        SUM(pu.due_amount)::text AS total_due
      FROM purchases pu
      JOIN suppliers su ON su.id = pu.supplier_id
      WHERE pu.purchase_date >= ${new Date(`${startDate}T00:00:00.000Z`)}
        AND pu.purchase_date <= ${new Date(`${endDate}T23:59:59.999Z`)}
        AND pu.status NOT IN ('CANCELLED', 'DRAFT')
      GROUP BY pu.supplier_id, su.name
      ORDER BY SUM(pu.grand_total) DESC
    `;
    const total = rows.length;
    const data = rows.slice(skip, skip + take).map((r) => ({
      supplierId: r.supplier_id,
      supplierName: r.supplier_name,
      totalPurchases: parseInt(r.total_purchases),
      totalAmount: toNum(r.total_amount),
      totalDue: toNum(r.total_due),
    }));
    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  }

  async purchasesByProduct(startDate: string, endDate: string, page?: string, limit?: string): Promise<PaginatedResult<PurchaseProductRow>> {
    const { skip, take, page: p, limit: l } = parsePagination(page, limit);
    const rows = await prisma.$queryRaw<
      { product_id: string; name: string; sku: string; total_qty: string; total_amount: string }[]
    >`
      SELECT
        pi.product_id,
        pr.name,
        pr.sku,
        SUM(pi.quantity)::text AS total_qty,
        SUM(pi.total_price)::text AS total_amount
      FROM purchase_items pi
      JOIN products pr ON pr.id = pi.product_id
      JOIN purchases pu ON pu.id = pi.purchase_id
      WHERE pu.purchase_date >= ${new Date(`${startDate}T00:00:00.000Z`)}
        AND pu.purchase_date <= ${new Date(`${endDate}T23:59:59.999Z`)}
        AND pu.status NOT IN ('CANCELLED', 'DRAFT')
      GROUP BY pi.product_id, pr.name, pr.sku
      ORDER BY SUM(pi.total_price) DESC
    `;
    const total = rows.length;
    const data = rows.slice(skip, skip + take).map((r) => ({
      productId: r.product_id,
      name: r.name,
      sku: r.sku,
      totalQuantity: toNum(r.total_qty),
      totalAmount: toNum(r.total_amount),
    }));
    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  }

  // ─── Inventory Reports ────────────────────────────────────────────────────

  async currentStock(page?: string, limit?: string): Promise<PaginatedResult<CurrentStockRow>> {
    const { skip, take, page: p, limit: l } = parsePagination(page, limit);
    const [rows, countResult] = await Promise.all([
      prisma.$queryRaw<
        { product_id: string; name: string; sku: string; category: string; unit: string; current_stock: string; min_stock: string; purchase_price: string; selling_price: string }[]
      >`
        SELECT
          p.id AS product_id,
          p.name,
          p.sku,
          c.name AS category,
          p.unit,
          i.current_stock::text,
          p.min_stock::text,
          p.purchase_price::text,
          p.selling_price::text
        FROM inventories i
        JOIN products p ON p.id = i.product_id
        JOIN categories c ON c.id = p.category_id
        WHERE p.status = 'ACTIVE'
        ORDER BY p.name ASC
        LIMIT ${take} OFFSET ${skip}
      `,
      prisma.$queryRaw<{ total: string }[]>`
        SELECT COUNT(*)::text AS total FROM inventories i
        JOIN products p ON p.id = i.product_id WHERE p.status = 'ACTIVE'
      `,
    ]);
    const total = parseInt(countResult[0]?.total ?? '0');
    const data: CurrentStockRow[] = rows.map((r) => {
      const stock = toNum(r.current_stock);
      const price = toNum(r.purchase_price);
      return {
        productId: r.product_id,
        name: r.name,
        sku: r.sku,
        category: r.category,
        unit: r.unit,
        currentStock: stock,
        minStock: toNum(r.min_stock),
        purchasePrice: price,
        sellingPrice: toNum(r.selling_price),
        stockValue: stock * price,
      };
    });
    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  }

  async stockMovement(
    options: { startDate?: string; endDate?: string; productId?: string; type?: string; page?: string; limit?: string }
  ): Promise<PaginatedResult<StockMovementRow>> {
    const { skip, take, page: p, limit: l } = parsePagination(options.page, options.limit);

    const conditions: string[] = [];
    if (options.startDate) conditions.push(`st.created_at >= '${options.startDate}T00:00:00.000Z'::timestamptz`);
    if (options.endDate) conditions.push(`st.created_at <= '${options.endDate}T23:59:59.999Z'::timestamptz`);
    if (options.productId) conditions.push(`st.product_id = '${options.productId}'`);
    if (options.type) conditions.push(`st.type = '${options.type}'`);

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const rows = await prisma.$queryRawUnsafe<
      { id: string; product_name: string; sku: string; type: string; quantity: string; previous_stock: string; new_stock: string; reference_id: string | null; note: string | null; created_at: Date }[]
    >(`
      SELECT
        st.id,
        p.name AS product_name,
        p.sku,
        st.type,
        st.quantity::text,
        st.previous_stock::text,
        st.new_stock::text,
        st.reference_id,
        st.note,
        st.created_at
      FROM stock_transactions st
      JOIN products p ON p.id = st.product_id
      ${where}
      ORDER BY st.created_at DESC
      LIMIT ${take} OFFSET ${skip}
    `);

    const countRows = await prisma.$queryRawUnsafe<{ total: string }[]>(`
      SELECT COUNT(*)::text AS total FROM stock_transactions st
      JOIN products p ON p.id = st.product_id
      ${where}
    `);

    const total = parseInt(countRows[0]?.total ?? '0');
    const data: StockMovementRow[] = rows.map((r) => ({
      id: r.id,
      productName: r.product_name,
      sku: r.sku,
      type: r.type,
      quantity: toNum(r.quantity),
      previousStock: toNum(r.previous_stock),
      newStock: toNum(r.new_stock),
      referenceId: r.reference_id,
      note: r.note,
      createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    }));
    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  }

  async lowStock(): Promise<CurrentStockRow[]> {
    const rows = await prisma.$queryRaw<
      { product_id: string; name: string; sku: string; category: string; unit: string; current_stock: string; min_stock: string; purchase_price: string; selling_price: string }[]
    >`
      SELECT
        p.id AS product_id, p.name, p.sku, c.name AS category, p.unit,
        i.current_stock::text, p.min_stock::text,
        p.purchase_price::text, p.selling_price::text
      FROM inventories i
      JOIN products p ON p.id = i.product_id
      JOIN categories c ON c.id = p.category_id
      WHERE p.status = 'ACTIVE' AND i.current_stock > 0 AND i.current_stock <= p.min_stock
      ORDER BY (i.current_stock / p.min_stock) ASC
    `;
    return rows.map((r) => {
      const stock = toNum(r.current_stock);
      const price = toNum(r.purchase_price);
      return {
        productId: r.product_id, name: r.name, sku: r.sku,
        category: r.category, unit: r.unit,
        currentStock: stock, minStock: toNum(r.min_stock),
        purchasePrice: price, sellingPrice: toNum(r.selling_price),
        stockValue: stock * price,
      };
    });
  }

  async outOfStock(): Promise<CurrentStockRow[]> {
    const rows = await prisma.$queryRaw<
      { product_id: string; name: string; sku: string; category: string; unit: string; current_stock: string; min_stock: string; purchase_price: string; selling_price: string }[]
    >`
      SELECT
        p.id AS product_id, p.name, p.sku, c.name AS category, p.unit,
        i.current_stock::text, p.min_stock::text,
        p.purchase_price::text, p.selling_price::text
      FROM inventories i
      JOIN products p ON p.id = i.product_id
      JOIN categories c ON c.id = p.category_id
      WHERE p.status = 'ACTIVE' AND i.current_stock <= 0
      ORDER BY p.name ASC
    `;
    return rows.map((r) => ({
      productId: r.product_id, name: r.name, sku: r.sku,
      category: r.category, unit: r.unit,
      currentStock: 0, minStock: toNum(r.min_stock),
      purchasePrice: toNum(r.purchase_price), sellingPrice: toNum(r.selling_price),
      stockValue: 0,
    }));
  }

  async stockValuation(): Promise<StockValuationSummary> {
    const rows = await prisma.$queryRaw<
      { total_products: string; total_stock_value: string; total_selling_value: string }[]
    >`
      SELECT
        COUNT(p.id)::text AS total_products,
        COALESCE(SUM(i.current_stock * p.purchase_price), 0)::text AS total_stock_value,
        COALESCE(SUM(i.current_stock * p.selling_price), 0)::text AS total_selling_value
      FROM inventories i
      JOIN products p ON p.id = i.product_id
      WHERE p.status = 'ACTIVE' AND i.current_stock > 0
    `;
    const r = rows[0];
    const stockVal = toNum(r?.total_stock_value);
    const sellVal = toNum(r?.total_selling_value);
    return {
      totalProducts: parseInt(r?.total_products ?? '0'),
      totalStockValue: stockVal,
      totalSellingValue: sellVal,
      potentialProfit: sellVal - stockVal,
    };
  }

  async expiringProducts(days: number = 30): Promise<ExpiringProductRow[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    const rows = await prisma.$queryRaw<
      { batch_id: string; product_id: string; product_name: string; sku: string; batch_number: string; expiry_date: Date; remaining_qty: string; days_until_expiry: string }[]
    >`
      SELECT
        pb.id AS batch_id,
        pb.product_id,
        p.name AS product_name,
        p.sku,
        pb.batch_number,
        pb.expiry_date,
        pb.remaining_qty::text,
        EXTRACT(DAY FROM pb.expiry_date - NOW())::text AS days_until_expiry
      FROM product_batches pb
      JOIN products p ON p.id = pb.product_id
      WHERE pb.expiry_date IS NOT NULL
        AND pb.expiry_date <= ${cutoffDate}
        AND pb.remaining_qty > 0
        AND p.status = 'ACTIVE'
      ORDER BY pb.expiry_date ASC
    `;
    return rows.map((r) => ({
      batchId: r.batch_id,
      productId: r.product_id,
      productName: r.product_name,
      sku: r.sku,
      batchNumber: r.batch_number,
      expiryDate: r.expiry_date instanceof Date ? r.expiry_date.toISOString() : String(r.expiry_date),
      remainingQty: toNum(r.remaining_qty),
      daysUntilExpiry: Math.floor(toNum(r.days_until_expiry)),
    }));
  }

  // ─── Financial Reports ────────────────────────────────────────────────────

  async incomeByCategory(startDate: string, endDate: string): Promise<IncomeSummaryRow[]> {
    const rows = await prisma.$queryRaw<
      { category: string; total_amount: string; count: string }[]
    >`
      SELECT
        ic.name AS category,
        SUM(i.amount)::text AS total_amount,
        COUNT(i.id)::text AS count
      FROM incomes i
      JOIN income_categories ic ON ic.id = i.income_category_id
      WHERE i.income_date >= ${new Date(`${startDate}T00:00:00.000Z`)}
        AND i.income_date <= ${new Date(`${endDate}T23:59:59.999Z`)}
      GROUP BY ic.name
      ORDER BY SUM(i.amount) DESC
    `;
    return rows.map((r) => ({
      category: r.category,
      totalAmount: toNum(r.total_amount),
      count: parseInt(r.count),
    }));
  }

  async expenseByCategory(startDate: string, endDate: string): Promise<ExpenseSummaryRow[]> {
    const rows = await prisma.$queryRaw<
      { category: string; total_amount: string; count: string }[]
    >`
      SELECT
        ec.name AS category,
        SUM(e.amount)::text AS total_amount,
        COUNT(e.id)::text AS count
      FROM expenses e
      JOIN expense_categories ec ON ec.id = e.expense_category_id
      WHERE e.expense_date >= ${new Date(`${startDate}T00:00:00.000Z`)}
        AND e.expense_date <= ${new Date(`${endDate}T23:59:59.999Z`)}
      GROUP BY ec.name
      ORDER BY SUM(e.amount) DESC
    `;
    return rows.map((r) => ({
      category: r.category,
      totalAmount: toNum(r.total_amount),
      count: parseInt(r.count),
    }));
  }

  async profitAndLoss(startDate: string, endDate: string): Promise<ProfitLossSummary> {
    const dr = dateRange(startDate, endDate);

    const [salesAgg, cogsAgg, returnsAgg, expensesAgg, otherIncomeAgg] = await Promise.all([
      prisma.sale.aggregate({
        where: { saleDate: dr, status: { notIn: ['CANCELLED', 'DRAFT'] } },
        _sum: { grandTotal: true },
      }),
      prisma.$queryRaw<{ total_cogs: string }[]>`
        SELECT COALESCE(SUM(si.cost_price * si.quantity), 0)::text AS total_cogs
        FROM sale_items si
        JOIN sales s ON s.id = si.sale_id
        WHERE s.sale_date >= ${dr.gte} AND s.sale_date <= ${dr.lte}
          AND s.status NOT IN ('CANCELLED', 'DRAFT')
      `,
      prisma.saleReturn.aggregate({
        where: { createdAt: dr, status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true },
      }),
      prisma.expense.aggregate({
        where: { expenseDate: dr },
        _sum: { amount: true },
      }),
      prisma.income.aggregate({
        where: { incomeDate: dr },
        _sum: { amount: true },
      }),
    ]);

    const salesRevenue = toNum(salesAgg._sum.grandTotal);
    const salesReturns = toNum(returnsAgg._sum.totalAmount);
    const netRevenue = salesRevenue - salesReturns;
    const cogs = toNum(cogsAgg[0]?.total_cogs);
    const grossProfit = netRevenue - cogs;
    const grossMarginPct = netRevenue > 0 ? (grossProfit / netRevenue) * 100 : 0;
    const totalExpenses = toNum(expensesAgg._sum.amount);
    const otherIncome = toNum(otherIncomeAgg._sum.amount);
    const netProfit = grossProfit - totalExpenses + otherIncome;
    const netMarginPct = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;

    return {
      salesRevenue,
      salesReturns,
      netRevenue,
      costOfGoodsSold: cogs,
      grossProfit,
      grossMarginPct: Math.round(grossMarginPct * 100) / 100,
      totalExpenses,
      otherIncome,
      netProfit,
      netMarginPct: Math.round(netMarginPct * 100) / 100,
    };
  }

  async customerDue(page?: string, limit?: string): Promise<PaginatedResult<CustomerDueRow>> {
    const { skip, take, page: p, limit: l } = parsePagination(page, limit);
    const [rows, countResult] = await Promise.all([
      prisma.$queryRaw<
        { customer_id: string; customer_name: string; phone: string; total_sales: string; total_paid: string; current_balance: string }[]
      >`
        SELECT
          cu.id AS customer_id,
          cu.name AS customer_name,
          cu.phone,
          COALESCE(SUM(s.grand_total), 0)::text AS total_sales,
          COALESCE(SUM(s.paid_amount), 0)::text AS total_paid,
          cu.current_balance::text
        FROM customers cu
        LEFT JOIN sales s ON s.customer_id = cu.id AND s.status NOT IN ('CANCELLED', 'DRAFT')
        WHERE cu.current_balance > 0 AND cu.is_active = true
        GROUP BY cu.id, cu.name, cu.phone, cu.current_balance
        ORDER BY cu.current_balance DESC
        LIMIT ${take} OFFSET ${skip}
      `,
      prisma.$queryRaw<{ total: string }[]>`
        SELECT COUNT(*)::text AS total FROM customers WHERE current_balance > 0 AND is_active = true
      `,
    ]);
    const total = parseInt(countResult[0]?.total ?? '0');
    const data = rows.map((r) => ({
      customerId: r.customer_id,
      customerName: r.customer_name,
      phone: r.phone,
      totalSales: toNum(r.total_sales),
      totalPaid: toNum(r.total_paid),
      currentBalance: toNum(r.current_balance),
    }));
    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  }

  async supplierDue(page?: string, limit?: string): Promise<PaginatedResult<SupplierDueRow>> {
    const { skip, take, page: p, limit: l } = parsePagination(page, limit);
    const [rows, countResult] = await Promise.all([
      prisma.$queryRaw<
        { supplier_id: string; supplier_name: string; phone: string; total_purchases: string; total_paid: string; current_balance: string }[]
      >`
        SELECT
          su.id AS supplier_id,
          su.name AS supplier_name,
          su.phone,
          COALESCE(SUM(pu.grand_total), 0)::text AS total_purchases,
          COALESCE(SUM(pu.paid_amount), 0)::text AS total_paid,
          su.current_balance::text
        FROM suppliers su
        LEFT JOIN purchases pu ON pu.supplier_id = su.id AND pu.status NOT IN ('CANCELLED', 'DRAFT')
        WHERE su.current_balance > 0 AND su.is_active = true
        GROUP BY su.id, su.name, su.phone, su.current_balance
        ORDER BY su.current_balance DESC
        LIMIT ${take} OFFSET ${skip}
      `,
      prisma.$queryRaw<{ total: string }[]>`
        SELECT COUNT(*)::text AS total FROM suppliers WHERE current_balance > 0 AND is_active = true
      `,
    ]);
    const total = parseInt(countResult[0]?.total ?? '0');
    const data = rows.map((r) => ({
      supplierId: r.supplier_id,
      supplierName: r.supplier_name,
      phone: r.phone,
      totalPurchases: toNum(r.total_purchases),
      totalPaid: toNum(r.total_paid),
      currentBalance: toNum(r.current_balance),
    }));
    return { data, total, page: p, limit: l, totalPages: Math.ceil(total / l) };
  }

  async cashFlow(startDate: string, endDate: string): Promise<CashFlowRow[]> {
    const rows = await prisma.$queryRaw<
      { date: string; cash_in: string; cash_out: string }[]
    >`
      SELECT
        TO_CHAR(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS date,
        COALESCE(SUM(CASE WHEN type = 'CASH_IN' THEN amount ELSE 0 END), 0)::text AS cash_in,
        COALESCE(SUM(CASE WHEN type = 'CASH_OUT' THEN amount ELSE 0 END), 0)::text AS cash_out
      FROM account_transactions
      WHERE created_at >= ${new Date(`${startDate}T00:00:00.000Z`)}
        AND created_at <= ${new Date(`${endDate}T23:59:59.999Z`)}
      GROUP BY TO_CHAR(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD')
      ORDER BY date ASC
    `;

    let runningBalance = 0;
    return rows.map((r) => {
      const cashIn = toNum(r.cash_in);
      const cashOut = toNum(r.cash_out);
      runningBalance += cashIn - cashOut;
      return {
        date: r.date,
        cashIn,
        cashOut,
        netFlow: cashIn - cashOut,
        runningBalance,
      };
    });
  }
}
