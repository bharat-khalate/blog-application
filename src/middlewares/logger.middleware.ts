/**
 * Request logging middleware - Function-based approach
 */

import { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';

export interface ILoggerMiddleware {
  (request: NextRequest): Promise<void>;
}

/**
 * Factory function to create logger middleware
 * Logs all incoming requests
 */
export function createLoggerMiddleware(): ILoggerMiddleware {
  return async (request: NextRequest) => {
    const startTime = Date.now();
    const method = request.method;
    const path = request.nextUrl.pathname;
    const duration = Date.now() - startTime;

    logger.info(`[${method}] ${path}`, {
      duration: `${duration}ms`,
    });
  };
}

// Singleton instance
export const loggerMiddleware = createLoggerMiddleware();
