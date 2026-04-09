/**
 * Catch-all route for /api/v1/auth
 * 
 * Individual endpoints:
 * - POST /api/v1/auth/login
 * - POST /api/v1/auth/register
 * - POST /api/v1/auth/refresh
 * - GET /api/v1/auth/me
 */






import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      statusCode: 404,
      message: 'Endpoint not found. Use specific endpoints: /login, /register, /refresh',
    },
    { status: 404 }
  );
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      statusCode: 404,
      message: 'Endpoint not found. Use /me to get current user',
    },
    { status: 404 }
  );
}

