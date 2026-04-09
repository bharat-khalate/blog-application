/**
 * GET /api/v1/auth/me
 * 
 * Get current user information (requires authentication)
 * 
 * Headers:
 * {
 *   "Authorization": "Bearer <accessToken>",
 *   "x-user-id": "<userId>"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "statusCode": 200,
 *   "message": "Fetched successfully",
 *   "data": {
 *     "_id": "userId",
 *     "email": "user@example.com",
 *     "firstName": "John",
 *     "lastName": "Doe",
 *     "createdAt": "timestamp",
 *     "updatedAt": "timestamp"
 *   }
 * }
 */

import { NextRequest } from 'next/server';
import { authController } from '@/modules/auth';
import { loadDatabase } from '@/loaders';

export async function GET(request: NextRequest) {
  await loadDatabase();
  return authController.getCurrentUser(request);
}

export async function POST() {
  return new Response(
    JSON.stringify({
      success: false,
      statusCode: 405,
      message: 'Method not allowed',
    }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
}
