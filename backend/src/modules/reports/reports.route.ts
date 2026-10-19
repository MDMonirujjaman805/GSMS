import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { dateRangeSchema, stockMovementSchema, expirySchema } from './reports.validation';
import {
  salesDaily, salesWeekly, salesMonthly, salesByProduct, salesByCustomer, salesByPayment,
  purchasesDaily, purchasesMonthly, purchasesBySupplier, purchasesByProduct,
  currentStock, stockMovement, lowStock, outOfStock, stockValuation, expiringProducts,
  incomeReport, expenseReport, profitLoss, customerDueReport, supplierDueReport, cashFlowReport,
} from './reports.controller';

const reportsRouter = Router();

// All reports require authentication; ADMIN and MANAGER only
reportsRouter.use(authenticate, authorize('ADMIN', 'MANAGER'));

// ─── Sales ────────────────────────────────────────────────────────────────────
reportsRouter.get('/sales/daily',       validateRequest(dateRangeSchema), salesDaily);
reportsRouter.get('/sales/weekly',      validateRequest(dateRangeSchema), salesWeekly);
reportsRouter.get('/sales/monthly',     validateRequest(dateRangeSchema), salesMonthly);
reportsRouter.get('/sales/by-product',  validateRequest(dateRangeSchema), salesByProduct);
reportsRouter.get('/sales/by-customer', validateRequest(dateRangeSchema), salesByCustomer);
reportsRouter.get('/sales/by-payment',  validateRequest(dateRangeSchema), salesByPayment);

// ─── Purchases ────────────────────────────────────────────────────────────────
reportsRouter.get('/purchases/daily',       validateRequest(dateRangeSchema), purchasesDaily);
reportsRouter.get('/purchases/monthly',     validateRequest(dateRangeSchema), purchasesMonthly);
reportsRouter.get('/purchases/by-supplier', validateRequest(dateRangeSchema), purchasesBySupplier);
reportsRouter.get('/purchases/by-product',  validateRequest(dateRangeSchema), purchasesByProduct);

// ─── Inventory ────────────────────────────────────────────────────────────────
reportsRouter.get('/inventory/current-stock', currentStock);
reportsRouter.get('/inventory/movement',      validateRequest(stockMovementSchema), stockMovement);
reportsRouter.get('/inventory/low-stock',     lowStock);
reportsRouter.get('/inventory/out-of-stock',  outOfStock);
reportsRouter.get('/inventory/valuation',     stockValuation);
reportsRouter.get('/inventory/expiring',      validateRequest(expirySchema), expiringProducts);

// ─── Financial ────────────────────────────────────────────────────────────────
reportsRouter.get('/financial/income',        validateRequest(dateRangeSchema), incomeReport);
reportsRouter.get('/financial/expenses',      validateRequest(dateRangeSchema), expenseReport);
reportsRouter.get('/financial/profit-loss',   validateRequest(dateRangeSchema), profitLoss);
reportsRouter.get('/financial/customer-due',  customerDueReport);
reportsRouter.get('/financial/supplier-due',  supplierDueReport);
reportsRouter.get('/financial/cash-flow',     validateRequest(dateRangeSchema), cashFlowReport);

export default reportsRouter;
