import { Router } from 'express';
import healthRouter from './health.route';
import authRouter from '../modules/auth/auth.route';
import testRbacRouter from './test-rbac.route';
import dashboardRouter from '../modules/dashboard/dashboard.route';
import reportsRouter from '../modules/reports/reports.route';

const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use(testRbacRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/reports', reportsRouter);

export default apiRouter;
