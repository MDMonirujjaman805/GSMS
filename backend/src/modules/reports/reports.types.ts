export interface DateRangeQuery {
  startDate: string;
  endDate: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

// ─── Sales Reports ────────────────────────────────────────────────────────────
export interface SalesPeriodRow {
  period: string;
  totalSales: number;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
}

export interface SalesProductRow {
  productId: string;
  name: string;
  sku: string;
  category: string;
  totalQuantity: number;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
}

export interface SalesCustomerRow {
  customerId: string | null;
  customerName: string;
  totalSales: number;
  totalRevenue: number;
  totalDue: number;
}

export interface SalesPaymentRow {
  paymentMethod: string;
  totalTransactions: number;
  totalAmount: number;
}

// ─── Purchase Reports ─────────────────────────────────────────────────────────
export interface PurchasePeriodRow {
  period: string;
  totalPurchases: number;
  totalAmount: number;
}

export interface PurchaseSupplierRow {
  supplierId: string;
  supplierName: string;
  totalPurchases: number;
  totalAmount: number;
  totalDue: number;
}

export interface PurchaseProductRow {
  productId: string;
  name: string;
  sku: string;
  totalQuantity: number;
  totalAmount: number;
}

// ─── Inventory Reports ────────────────────────────────────────────────────────
export interface CurrentStockRow {
  productId: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  purchasePrice: number;
  sellingPrice: number;
  stockValue: number;
}

export interface StockMovementRow {
  id: string;
  productName: string;
  sku: string;
  type: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceId: string | null;
  note: string | null;
  createdAt: string;
}

export interface StockValuationSummary {
  totalProducts: number;
  totalStockValue: number;
  totalSellingValue: number;
  potentialProfit: number;
}

export interface ExpiringProductRow {
  batchId: string;
  productId: string;
  productName: string;
  sku: string;
  batchNumber: string;
  expiryDate: string;
  remainingQty: number;
  daysUntilExpiry: number;
}

// ─── Financial Reports ────────────────────────────────────────────────────────
export interface IncomeSummaryRow {
  category: string;
  totalAmount: number;
  count: number;
}

export interface ExpenseSummaryRow {
  category: string;
  totalAmount: number;
  count: number;
}

export interface ProfitLossSummary {
  salesRevenue: number;
  salesReturns: number;
  netRevenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  grossMarginPct: number;
  totalExpenses: number;
  otherIncome: number;
  netProfit: number;
  netMarginPct: number;
}

export interface CustomerDueRow {
  customerId: string;
  customerName: string;
  phone: string;
  totalSales: number;
  totalPaid: number;
  currentBalance: number;
}

export interface SupplierDueRow {
  supplierId: string;
  supplierName: string;
  phone: string;
  totalPurchases: number;
  totalPaid: number;
  currentBalance: number;
}

export interface CashFlowRow {
  date: string;
  cashIn: number;
  cashOut: number;
  netFlow: number;
  runningBalance: number;
}

// Generic paginated response
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
