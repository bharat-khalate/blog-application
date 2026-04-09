/**
 * Email integration - Function-based approach
 */

import { logger } from '@/lib/logger';
import { env } from '@/configs/env';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface IEmailService {
  initialize(): Promise<void>;
  send(options: EmailOptions): Promise<boolean>;
  sendVerificationEmail(email: string, token: string): Promise<boolean>;
  sendPasswordReset(email: string, token: string): Promise<boolean>;
}

/**
 * Factory function to create email service
 */
export function createEmailService(): IEmailService {
  let isConfigured = false;

  return {
    async initialize(): Promise<void> {
      try {
        // Email service initialization placeholder
        isConfigured = true;
        logger.info('Email service initialized');
      } catch (error) {
        logger.error('Email service initialization failed', error);
      }
    },

    async send(options: EmailOptions): Promise<boolean> {
      if (!isConfigured) {
        logger.warn('Email service is not configured');
        return false;
      }

      try {
        // Email sending logic would go here
        logger.info(`Email sent to ${options.to}`, {
          subject: options.subject,
        });
        return true;
      } catch (error) {
        logger.error('Failed to send email', error);
        return false;
      }
    },

    async sendVerificationEmail(email: string, token: string): Promise<boolean> {
      const verificationUrl = `${env.APP_URL}/verify?token=${token}`;
      return this.send({
        to: email,
        subject: 'Verify your email',
        html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email</p>`,
      });
    },

    async sendPasswordReset(email: string, token: string): Promise<boolean> {
      const resetUrl = `${env.APP_URL}/reset-password?token=${token}`;
      return this.send({
        to: email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`,
      });
    },
  };
}

// Singleton instance
export const emailService = createEmailService();
