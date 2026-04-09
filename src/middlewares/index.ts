/**
 * Middleware barrel export - Function-based Dependency Injection
 */

// Factory functions
export { createAuthMiddleware, type IAuthMiddleware } from './auth.middleware';
export { createErrorMiddleware, type IErrorHandler } from './error.middleware';
export { createLoggerMiddleware, type ILoggerMiddleware } from './logger.middleware';

// Singleton instances
export { authMiddleware } from './auth.middleware';
export { errorMiddleware } from './error.middleware';
export { loggerMiddleware } from './logger.middleware';

// Utils
export { CustomApiError } from '@/utils/apiError';
