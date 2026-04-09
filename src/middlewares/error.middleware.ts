/**
 * Error handling middleware - Function-based approach
 */

import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createErrorResponse, CustomApiError } from '@/utils/apiError';

export interface IErrorHandler {
  (error: Error | unknown): NextResponse;
}

/**
 * Factory function to create error handler middleware
 * Handles and formats error responses
 */
export function createErrorMiddleware(): IErrorHandler {
  return (error: Error | unknown) => {
    logger.error('Error middleware caught exception', error);

    if (error instanceof CustomApiError) {
      return createErrorResponse(error);
    }

    if (error instanceof SyntaxError) {
      const syntaxError = new CustomApiError(400, 'Invalid request format');
      return createErrorResponse(syntaxError);
    }

    const internalError = new CustomApiError(500, 'Internal server error');
    return createErrorResponse(internalError);
  };
}

// Singleton instance
export const errorMiddleware = createErrorMiddleware();
