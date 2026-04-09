/**
 * Background worker/queue processor - Function-based approach
 */

import { logger } from '@/lib/logger';

export interface QueueJob {
  id: string;
  type: string;
  data: unknown;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retry: number;
}

export interface IQueueWorker {
  processQueue(): Promise<void>;
  addJob(type: string, data: unknown): QueueJob;
  stop(): void;
}

/**
 * Factory function to create queue worker
 */
export function createQueueWorker(): IQueueWorker {
  const jobs: Map<string, QueueJob> = new Map();
  let isRunning = false;

  /**
   * Handle email jobs
   */
  async function handleEmailJob(job: QueueJob): Promise<void> {
    // Email sending logic
    logger.info('Sending email from queue', job.data);
  }

  /**
   * Handle report generation jobs
   */
  async function handleReportJob(job: QueueJob): Promise<void> {
    // Report generation logic
    logger.info('Generating report from queue', job.data);
  }

  /**
   * Process individual job
   */
  async function processJob(job: QueueJob): Promise<void> {
    try {
      job.status = 'processing';
      logger.info(`Processing job ${job.id}`, { type: job.type });

      // Job processing logic based on type
      switch (job.type) {
        case 'send-email':
          await handleEmailJob(job);
          break;
        case 'generate-report':
          await handleReportJob(job);
          break;
        default:
          logger.warn(`Unknown job type: ${job.type}`);
      }

      job.status = 'completed';
      logger.info(`Job ${job.id} completed`);
    } catch (error) {
      job.retry++;
      if (job.retry > 3) {
        job.status = 'failed';
        logger.error(`Job ${job.id} failed after 3 retries`, error);
      } else {
        job.status = 'pending';
        logger.warn(`Job ${job.id} will be retried`, { retry: job.retry });
      }
    }
  }

  return {
    async processQueue(): Promise<void> {
      if (isRunning) {
        logger.warn('Queue worker is already running');
        return;
      }

      isRunning = true;

      while (isRunning) {
        const pendingJobs = Array.from(jobs.values()).filter(
          (job) => job.status === 'pending'
        );

        for (const job of pendingJobs) {
          await processJob(job);
        }

        // Wait before checking again
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    },

    addJob(type: string, data: unknown): QueueJob {
      const job: QueueJob = {
        id: `job-${Date.now()}-${Math.random()}`,
        type,
        data,
        status: 'pending',
        retry: 0,
      };

      jobs.set(job.id, job);
      logger.info(`Job added to queue: ${job.id}`, { type });
      return job;
    },

    stop(): void {
      isRunning = false;
      logger.info('Queue worker stopped');
    },
  };
}

// Singleton instance
export const queueWorker = createQueueWorker();
