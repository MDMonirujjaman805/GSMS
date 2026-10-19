import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { getDashboard } from './dashboard.controller';

const dashboardRouter = Router();

dashboardRouter.get(
  '/',
  authenticate,
  authorize('ADMIN', 'MANAGER', 'CASHIER'),
  getDashboard
);

export default dashboardRouter;
