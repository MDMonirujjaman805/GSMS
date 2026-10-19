import app from './app';
import { envConfig } from './config/env.config';

const server = app.listen(envConfig.port, () => {
  console.log(
    `[GSMS Backend] Server running in ${envConfig.nodeEnv} mode on port ${envConfig.port}`
  );
});

process.on('unhandledRejection', (reason: Error) => {
  console.error('[GSMS Backend] Unhandled Rejection:', reason);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (error: Error) => {
  console.error('[GSMS Backend] Uncaught Exception:', error);
  process.exit(1);
});
