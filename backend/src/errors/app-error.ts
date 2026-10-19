import { ErrorCode } from './error-codes.enum';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, errorCode: ErrorCode, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public static badRequest(
    message: string,
    errorCode: ErrorCode = ErrorCode.VALIDATION_ERROR,
    details?: unknown
  ): AppError {
    return new AppError(message, 400, errorCode, details);
  }

  public static unauthorized(message: string = 'Authentication required'): AppError {
    return new AppError(message, 401, ErrorCode.AUTHENTICATION_ERROR);
  }

  public static forbidden(message: string = 'Access denied'): AppError {
    return new AppError(message, 403, ErrorCode.AUTHORIZATION_ERROR);
  }

  public static notFound(message: string = 'Resource not found'): AppError {
    return new AppError(message, 404, ErrorCode.NOT_FOUND);
  }

  public static conflict(message: string, details?: unknown): AppError {
    return new AppError(message, 409, ErrorCode.CONFLICT, details);
  }

  public static internal(message: string = 'Internal server error'): AppError {
    return new AppError(message, 500, ErrorCode.INTERNAL_SERVER_ERROR);
  }
}
