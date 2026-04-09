/**
 * Logger utility - Function-based approach
 */

import { env } from '@/configs/env';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface ILogger {
  debug(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, error?: Error | unknown): void;
}

/**
 * Format log message with timestamp and level
 */
function formatMessage(level: LogLevel, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString();
  const formattedData = data ? ` | ${JSON.stringify(data)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${formattedData}`;
}

/**
 * Factory function to create a logger instance
 */
export function createLogger(logLevel: LogLevel = LogLevel.INFO): ILogger {
  return {
    debug(message: string, data?: unknown): void {
      if (env.isDevelopment() || logLevel === LogLevel.DEBUG) {
        console.debug(formatMessage(LogLevel.DEBUG, message, data));
      }
    },

    info(message: string, data?: unknown): void {
      console.info(formatMessage(LogLevel.INFO, message, data));
    },

    warn(message: string, data?: unknown): void {
      console.warn(formatMessage(LogLevel.WARN, message, data));
    },

    error(message: string, error?: Error | unknown): void {
      const errorData = error instanceof Error ? error.message : error;
      console.error(formatMessage(LogLevel.ERROR, message, errorData));
      if (error instanceof Error) {
        console.error(error.stack);
      }
    },
  };
}

// Singleton instance
export const logger = createLogger(
  (env.LOG_LEVEL as LogLevel) || LogLevel.INFO
);
