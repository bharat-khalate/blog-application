/**
 * Database connection handler
 */

import mongoose from 'mongoose';
import { dbConfig } from '@/configs/db';
import { logger } from './logger';

let isConnected: boolean = false;

export async function connectDB(): Promise<typeof mongoose> {
  if (isConnected) {
    logger.debug('Database is already connected');
    return mongoose;
  }

  try {
    logger.info('Connecting to database...');
    const connection = await mongoose.connect(
      dbConfig.mongodb.uri,
      dbConfig.mongodb.options
    );

    isConnected = true;
    logger.info('Database connected successfully');
    return connection;
  } catch (error) {
    logger.error('Database connection failed', error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) {
    logger.debug('Database is not connected');
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Database disconnection failed', error);
    throw error;
  }
}

export function isDBConnected(): boolean {
  return isConnected;
}

export default mongoose;
