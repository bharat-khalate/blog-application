/**
 * GET /api/v1/health
 * 
 * Health check endpoint - no authentication required
 * 
 * Response:
 * {
 *   "success": true,
 *   "statusCode": 200,
 *   "message": "API is healthy",
 *   "data": {
 *     "timestamp": "2024-03-10T10:30:00Z",
 *     "uptime": 3600,
 *     "environment": "development",
 *     "version": "1.0.0"
 *   }
 * }
 */

import { NextResponse } from 'next/server';
import { env } from '@/configs/env';

export async function GET() {
  const startTime = Date.now();
  
  return NextResponse.json(
    {
      success: true,
      statusCode: 200,
      message: 'API is healthy',
      data: {
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
        version: 'v1',
        database: 'connected',
      },
    },
    { status: 200 }
  );
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
