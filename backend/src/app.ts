import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { envConfig } from './config/env.config';
import apiRouter from './routes/index';
import { errorHandler } from './middlewares/error.middleware';
import { AppError } from './errors/app-error';

const app: Express = express();

app.use(helmet());
app.use(
  cors({
    origin: envConfig.corsOrigin,
    credentials: true,
  })
);
app.use(morgan(envConfig.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', apiRouter);

app.use('*', (_req: Request, _res: Response, next: NextFunction) => {
  next(AppError.notFound('Requested API endpoint does not exist'));
});

app.use(errorHandler);

export default app;
