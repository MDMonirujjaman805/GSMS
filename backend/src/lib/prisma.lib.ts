import { PrismaClient } from '@prisma/client';
import { envConfig } from '../config/env.config';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: envConfig.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (envConfig.nodeEnv !== 'production') {
  globalThis.prismaGlobal = prisma;
}
