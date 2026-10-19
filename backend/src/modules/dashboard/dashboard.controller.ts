import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';

const dashboardService = new DashboardService();

export const getDashboard = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await dashboardService.getDashboardData();
    res.json({ success: true, message: 'Dashboard data retrieved', data });
  } catch (error) {
    next(error);
  }
};
