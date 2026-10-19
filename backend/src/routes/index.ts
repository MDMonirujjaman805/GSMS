import { Router } from 'express';
import healthRouter from './health.route';
import authRouter from '../modules/auth/auth.route';
import testRbacRouter from './test-rbac.route';

const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use(testRbacRouter);

export default apiRouter;
