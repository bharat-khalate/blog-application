import { NextResponse } from 'next/server';
import type { IApiError } from '@/types/global.types';
import { HTTP_STATUS, ERROR_MESSAGES } from './constants';

/**
 * Custom Error class with API-specific properties
 * Used internally by factory functions
 */
class CustomApiError extends Error {
  statusCode: number;
  errors?: Record<string, string | string[]>;

  constructor(
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: string = ERROR_MESSAGES.INTERNAL_ERROR,
    errors?: Record<string, string | string[]>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Function-based API Error Factory Functions
 */

export function createApiError(
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  message: string = ERROR_MESSAGES.INTERNAL_ERROR,
  errors?: Record<string, string | string[]>
): CustomApiError {
  return new CustomApiError(statusCode, message, errors);
}

export function createBadRequestError(
  message: string = ERROR_MESSAGES.VALIDATION_ERROR,
  errors?: Record<string, string | string[]>
): CustomApiError {
  return new CustomApiError(HTTP_STATUS.BAD_REQUEST, message, errors);
}

export function createUnauthorizedError(
  message: string = ERROR_MESSAGES.UNAUTHORIZED
): CustomApiError {
  return new CustomApiError(HTTP_STATUS.UNAUTHORIZED, message);
}

export function createForbiddenError(
  message: string = ERROR_MESSAGES.FORBIDDEN
): CustomApiError {
  return new CustomApiError(HTTP_STATUS.FORBIDDEN, message);
}

export function createNotFoundError(
  message: string = ERROR_MESSAGES.RESOURCE_NOT_FOUND
): CustomApiError {
  return new CustomApiError(HTTP_STATUS.NOT_FOUND, message);
}

export function createConflictError(
  message: string = ERROR_MESSAGES.DUPLICATE_ENTRY
): CustomApiError {
  return new CustomApiError(HTTP_STATUS.CONFLICT, message);
}

export function createInternalError(
  message: string = ERROR_MESSAGES.INTERNAL_ERROR
): CustomApiError {
  return new CustomApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
}

export function createErrorResponse(
  error: CustomApiError | Error
): NextResponse<IApiError> {
  if (error instanceof CustomApiError) {
    const isInternal = error.statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR;
    return NextResponse.json(
      {
        success: false,
        statusCode: error.statusCode,
        message: isInternal ? ERROR_MESSAGES.INTERNAL_ERROR : error.message,
        errors: !isInternal ? error.errors : undefined,
      },
      { status: error.statusCode }
    );
  }

  // Always generic for unknown errors
  return NextResponse.json(
    {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
    },
    { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
  );
}

/**
 * Backwards compatibility: ApiError object with factory methods
 */
export const ApiError = {
  badRequest: createBadRequestError,
  unauthorized: createUnauthorizedError,
  forbidden: createForbiddenError,
  notFound: createNotFoundError,
  conflict: createConflictError,
  internal: createInternalError,
  response: createErrorResponse,
};

// Export the error class for type checking
export { CustomApiError };
