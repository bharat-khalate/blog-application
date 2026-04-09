/**
 * Database loader
 */

import { connectDB, isDBConnected } from '@/lib/db';
import { logger } from '@/lib/logger';

export async function loadDatabase() {
  if (isDBConnected()) {
    logger.info('Database already connected');
    return;
  }

  try {
    await connectDB();
    logger.info('Database loader initialized');
  } catch (error) {
    logger.error('Failed to load database', error);
    throw error;
  }
}

export { connectDB };
