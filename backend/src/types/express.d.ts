import { Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
