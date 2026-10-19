import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const envConfig = {
  port: parseInt(process.env['PORT'] || '5000', 10),
  nodeEnv: process.env['NODE_ENV'] || 'development',
  jwtSecret: process.env['JWT_SECRET'] || 'default_jwt_secret',
  jwtExpiresIn: process.env['JWT_EXPIRES_IN'] || '7d',
  databaseUrl: process.env['DATABASE_URL'] || '',
  corsOrigin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
};
