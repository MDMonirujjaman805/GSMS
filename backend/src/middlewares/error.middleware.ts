import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { ErrorCode } from '../errors/error-codes.enum';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      ...(err.details ? { errors: err.details } : {}),
    });
    return;
  }

  console.error('Unhandled Error:', err);

  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred',
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
  });
};
