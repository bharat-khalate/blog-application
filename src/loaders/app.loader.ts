/**
 * Application loader - Initialize all services
 */

import { loadDatabase } from './db.loader';
import { logger } from '@/lib/logger';

export async function loadApp() {
  try {
    logger.info('Starting application initialization...');

    // Load database
    await loadDatabase();

    logger.info('Application initialized successfully');
  } catch (error) {
    logger.error('Application initialization failed', error);
    throw error;
  }
}
