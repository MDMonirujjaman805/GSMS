import { apiClient, ApiResponse } from '../../services/api.service';
import {
  PaginatedResult,
  SalesPeriodRow, SalesProductRow, SalesCustomerRow, SalesPaymentRow,
  PurchasePeriodRow, PurchaseSupplierRow, PurchaseProductRow,
  CurrentStockRow, StockMovementRow, StockValuationSummary, ExpiringProductRow,
  IncomeSummaryRow, ExpenseSummaryRow, ProfitLossSummary,
  CustomerDueRow, SupplierDueRow, CashFlowRow,
} from '../../types/reports.types';

async function get<T>(url: string, params: Record<string, string | undefined>): Promise<T> {
  const cleanParams: Record<string, string> = {};
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined) cleanParams[k] = v; });
  const res = await apiClient.get<ApiResponse<T>>(url, { params: cleanParams });
  if (!res.data.success || !res.data.data) throw new Error(res.data.message);
  return res.data.data;
}

// ─── Sales ───────────────────────────────────────────────────────────────────
export const getSalesDaily = (startDate: string, endDate: string, page?: string, limit?: string) =>
  get<PaginatedResult<SalesPeriodRow>>('/reports/sales/daily', { startDate, endDate, page, limit });

export const getSalesWeekly = (startDate: string, endDate: string, page?: string, limit?: string) =>
  get<PaginatedResult<SalesPeriodRow>>('/reports/sales/weekly', { startDate, endDate, page, limit });

export const getSalesMonthly = (startDate: string, endDate: string, page?: string, limit?: string) =>
  get<PaginatedResult<SalesPeriodRow>>('/reports/sales/monthly', { startDate, endDate, page, limit });

export const getSalesByProduct = (startDate: string, endDate: string, page?: string, limit?: string) =>
  get<PaginatedResult<SalesProductRow>>('/reports/sales/by-product', { startDate, endDate, page, limit });

export const getSalesByCustomer = (startDate: string, endDate: string, page?: string, limit?: string) =>
  get<PaginatedResult<SalesCustomerRow>>('/reports/sales/by-customer', { startDate, endDate, page, limit });

export const getSalesByPayment = (startDate: string, endDate: string) =>
  get<SalesPaymentRow[]>('/reports/sales/by-payment', { startDate, endDate });

// ─── Purchases ────────────────────────────────────────────────────────────────
export const getPurchasesDaily = (startDate: string, endDate: string, page?: string, limit?: string) =>
  get<PaginatedResult<PurchasePeriodRow>>('/reports/purchases/daily', { startDate, endDate, page, limit });

export const getPurchasesMonthly = (startDate: string, endDate: string, page?: string, limit?: string) =>
  get<PaginatedResult<PurchasePeriodRow>>('/reports/purchases/monthly', { startDate, endDate, page, limit });

export const getPurchasesBySupplier = (startDate: string, endDate: string, page?: string, limit?: string) =>
  get<PaginatedResult<PurchaseSupplierRow>>('/reports/purchases/by-supplier', { startDate, endDate, page, limit });

export const getPurchasesByProduct = (startDate: string, endDate: string, page?: string, limit?: string) =>
  get<PaginatedResult<PurchaseProductRow>>('/reports/purchases/by-product', { startDate, endDate, page, limit });

// ─── Inventory ────────────────────────────────────────────────────────────────
export const getCurrentStock = (page?: string, limit?: string) =>
  get<PaginatedResult<CurrentStockRow>>('/reports/inventory/current-stock', { page, limit });

export const getStockMovement = (opts: { startDate?: string; endDate?: string; productId?: string; type?: string; page?: string; limit?: string }) =>
  get<PaginatedResult<StockMovementRow>>('/reports/inventory/movement', opts);

export const getLowStock = () =>
  get<CurrentStockRow[]>('/reports/inventory/low-stock', {});

export const getOutOfStock = () =>
  get<CurrentStockRow[]>('/reports/inventory/out-of-stock', {});

export const getStockValuation = () =>
  get<StockValuationSummary>('/reports/inventory/valuation', {});

export const getExpiringProducts = (days?: string) =>
  get<ExpiringProductRow[]>('/reports/inventory/expiring', { days });

// ─── Financial ────────────────────────────────────────────────────────────────
export const getIncomeReport = (startDate: string, endDate: string) =>
  get<IncomeSummaryRow[]>('/reports/financial/income', { startDate, endDate });

export const getExpenseReport = (startDate: string, endDate: string) =>
  get<ExpenseSummaryRow[]>('/reports/financial/expenses', { startDate, endDate });

export const getProfitLoss = (startDate: string, endDate: string) =>
  get<ProfitLossSummary>('/reports/financial/profit-loss', { startDate, endDate });

export const getCustomerDue = (page?: string, limit?: string) =>
  get<PaginatedResult<CustomerDueRow>>('/reports/financial/customer-due', { page, limit });

export const getSupplierDue = (page?: string, limit?: string) =>
  get<PaginatedResult<SupplierDueRow>>('/reports/financial/supplier-due', { page, limit });

export const getCashFlow = (startDate: string, endDate: string) =>
  get<CashFlowRow[]>('/reports/financial/cash-flow', { startDate, endDate });
