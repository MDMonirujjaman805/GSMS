import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { envConfig } from '../config/env.config';
import { AppError } from '../errors/app-error';
import { prisma } from '../lib/prisma.lib';
import { AuthUser } from '../types/express';

interface JwtPayload {
  userId: string;
  username: string;
  role: Role;
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('Authentication token is missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw AppError.unauthorized('Authentication token is missing');
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, envConfig.jwtSecret) as JwtPayload;
    } catch {
      throw AppError.unauthorized('Invalid or expired authentication token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw AppError.unauthorized('User account does not exist or has been deactivated');
    }

    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    req.user = authUser;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(AppError.forbidden(`Access denied: role '${req.user.role}' is not authorized`));
    }

    next();
  };
};
