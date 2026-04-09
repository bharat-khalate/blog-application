/**
 * Database configuration
 */

import { env } from './env';

export const dbConfig = {
  // MongoDB connection options
  mongodb: {
    uri: env.DATABASE_URL,
    options: {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      connectTimeoutMS: 10000,
    },
  },

  // Connection pool
  pool: {
    min: 2,
    max: 10,
  },

  // Query options
  query: {
    timeout: 30000, // 30 seconds
    lean: false,
  },

  // Logging
  logging: env.isDevelopment(),
};
