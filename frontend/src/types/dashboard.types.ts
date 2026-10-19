export interface TodayMetrics {
  totalSales: number;
  salesCount: number;
  totalPurchases: number;
  purchasesCount: number;
  totalExpenses: number;
  expensesCount: number;
  grossProfit: number;
  netProfit: number;
}

export interface BalanceMetrics {
  cashBalance: number;
  totalCustomerDue: number;
  totalSupplierDue: number;
  stockValue: number;
}

export interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  unit: string;
}

export interface OutOfStockItem {
  id: string;
  name: string;
  sku: string;
  unit: string;
}

export interface StockAlerts {
  lowStockCount: number;
  outOfStockCount: number;
  lowStockItems: LowStockItem[];
  outOfStockItems: OutOfStockItem[];
}

export interface RecentSale {
  id: string;
  invoiceNumber: string;
  customerName: string | null;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  saleDate: string;
}

export interface RecentPurchase {
  id: string;
  invoiceNumber: string;
  supplierName: string;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  purchaseDate: string;
}

export interface TopProduct {
  productId: string;
  name: string;
  sku: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface DashboardData {
  today: TodayMetrics;
  balances: BalanceMetrics;
  stockAlerts: StockAlerts;
  recentSales: RecentSale[];
  recentPurchases: RecentPurchase[];
  topProducts: TopProduct[];
}
