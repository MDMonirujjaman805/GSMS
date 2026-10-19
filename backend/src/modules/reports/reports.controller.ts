import { Request, Response, NextFunction } from 'express';
import { ReportsService } from './reports.service';

const svc = new ReportsService();

function ok(res: Response, data: unknown, message = 'Report generated') {
  res.json({ success: true, message, data });
}

// ─── Sales ────────────────────────────────────────────────────────────────────

export const salesDaily = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, page, limit } = req.query as Record<string, string>;
    ok(res, await svc.salesDaily(startDate, endDate, page, limit));
  } catch (e) { next(e); }
};

export const salesWeekly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, page, limit } = req.query as Record<string, string>;
    ok(res, await svc.salesWeekly(startDate, endDate, page, limit));
  } catch (e) { next(e); }
};

export const salesMonthly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, page, limit } = req.query as Record<string, string>;
    ok(res, await svc.salesMonthly(startDate, endDate, page, limit));
  } catch (e) { next(e); }
};

export const salesByProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, page, limit } = req.query as Record<string, string>;
    ok(res, await svc.salesByProduct(startDate, endDate, page, limit));
  } catch (e) { next(e); }
};

export const salesByCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, page, limit } = req.query as Record<string, string>;
    ok(res, await svc.salesByCustomer(startDate, endDate, page, limit));
  } catch (e) { next(e); }
};

export const salesByPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as Record<string, string>;
    ok(res, await svc.salesByPayment(startDate, endDate));
  } catch (e) { next(e); }
};

// ─── Purchases ────────────────────────────────────────────────────────────────

export const purchasesDaily = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, page, limit } = req.query as Record<string, string>;
    ok(res, await svc.purchasesDaily(startDate, endDate, page, limit));
  } catch (e) { next(e); }
};

export const purchasesMonthly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, page, limit } = req.query as Record<string, string>;
    ok(res, await svc.purchasesMonthly(startDate, endDate, page, limit));
  } catch (e) { next(e); }
};

export const purchasesBySupplier = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, page, limit } = req.query as Record<string, string>;
    ok(res, await svc.purchasesBySupplier(startDate, endDate, page, limit));
  } catch (e) { next(e); }
};

export const purchasesByProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, page, limit } = req.query as Record<string, string>;
    ok(res, await svc.purchasesByProduct(startDate, endDate, page, limit));
  } catch (e) { next(e); }
};

// ─── Inventory ────────────────────────────────────────────────────────────────

export const currentStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query as Record<string, string>;
    ok(res, await svc.currentStock(page, limit));
  } catch (e) { next(e); }
};

export const stockMovement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, productId, type, page, limit } = req.query as Record<string, string>;
    ok(res, await svc.stockMovement({ startDate, endDate, productId, type, page, limit }));
  } catch (e) { next(e); }
};

export const lowStock = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await svc.lowStock());
  } catch (e) { next(e); }
};

export const outOfStock = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await svc.outOfStock());
  } catch (e) { next(e); }
};

export const stockValuation = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await svc.stockValuation());
  } catch (e) { next(e); }
};

export const expiringProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { days } = req.query as Record<string, string>;
    ok(res, await svc.expiringProducts(days ? parseInt(days) : 30));
  } catch (e) { next(e); }
};

// ─── Financial ────────────────────────────────────────────────────────────────

export const incomeReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as Record<string, string>;
    ok(res, await svc.incomeByCategory(startDate, endDate));
  } catch (e) { next(e); }
};

export const expenseReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as Record<string, string>;
    ok(res, await svc.expenseByCategory(startDate, endDate));
  } catch (e) { next(e); }
};

export const profitLoss = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as Record<string, string>;
    ok(res, await svc.profitAndLoss(startDate, endDate));
  } catch (e) { next(e); }
};

export const customerDueReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query as Record<string, string>;
    ok(res, await svc.customerDue(page, limit));
  } catch (e) { next(e); }
};

export const supplierDueReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query as Record<string, string>;
    ok(res, await svc.supplierDue(page, limit));
  } catch (e) { next(e); }
};

export const cashFlowReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as Record<string, string>;
    ok(res, await svc.cashFlow(startDate, endDate));
  } catch (e) { next(e); }
};
