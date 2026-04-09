/**
 * POST /api/v1/auth/login
 * 
 * User login endpoint
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "statusCode": 200,
 *   "message": "Login successful",
 *   "data": {
 *     "accessToken": "...",
 *     "refreshToken": "...",
 *     "user": { ... }
 *   }
 * }
 */

import { NextRequest } from 'next/server';
import { authController } from '@/modules/auth';
import { loadDatabase } from '@/loaders';


export async function POST(request: NextRequest) {
  await loadDatabase();
  return authController.login(request);
}

// Prevent GET requests
export async function GET() {
  return new Response(
    JSON.stringify({
      success: false,
      statusCode: 405,
      message: 'Method not allowed',
    }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
}





