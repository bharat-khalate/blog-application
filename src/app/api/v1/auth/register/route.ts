/**
 * POST /api/v1/auth/register
 * 
 * User registration endpoint
 * 
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "SecurePass123",
 *   "firstName": "John",
 *   "lastName": "Doe"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "statusCode": 201,
 *   "message": "User registered successfully",
 *   "data": { ... }
 * }
 */

import { NextRequest } from 'next/server';
import { authController } from '@/modules/auth';
import { loadDatabase } from '@/loaders';

export async function POST(request: NextRequest) {
  await loadDatabase();
  return authController.register(request);
}

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
