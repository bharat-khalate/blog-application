/**
 * Authentication middleware - Function-based approach
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { verifyAccessToken } from '@/utils/jwt';


const PUBLIC_ROUTES = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/health',
];

const PUBLIC_PATHS = [
  '/',
  '/_next',
  '/public',
  '/favicon.ico',
  '/manifest.json',
  '/robots.txt',
];

export interface IAuthMiddleware {
  (request: NextRequest): Promise<NextResponse | null>;
}

/**
 * Factory function to create auth middleware
 */
export function createAuthMiddleware(): IAuthMiddleware {
  return async (request: NextRequest) => {
    const pathname = request.nextUrl.pathname;

    // Skip auth check for public paths (frontend routes and static assets)
    if (
      PUBLIC_PATHS.some((route) =>
        route === '/'
          ? pathname === '/'
          : pathname === route || pathname.startsWith(route)
      )
    ) {
      return null;
    }
    // Skip auth check for public API routes
    if (PUBLIC_ROUTES.some((route) => pathname.includes(route))) {
      return null; // Continue to next middleware
    }

    // Only enforce auth on protected API routes
    if (!pathname.startsWith('/api')) {
      return null; // Skip auth for non-API routes
    }

    try {
      const authHeader = request.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        logger.warn('Missing or invalid authorization header', { path: pathname });
        return new NextResponse(
          JSON.stringify({
            success: false,
            statusCode: 401,
            message: 'Missing or invalid authorization token',
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);

      if (!decoded) {
        logger.warn('Invalid token', { path: pathname });
        return new NextResponse(
          JSON.stringify({
            success: false,
            statusCode: 401,
            message: 'Invalid or expired token',
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Pass user ID to subsequent handlers via headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.userId);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      logger.error('Auth middleware error', error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          statusCode: 401,
          message: 'Authentication failed',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}


// Singleton instance
export const authMiddleware = createAuthMiddleware();
