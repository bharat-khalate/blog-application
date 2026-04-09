/**
 * Next.js Root Proxy
 * 
 * This special Next.js file runs for all requests before route handlers
 * It composes and uses proxy from src/proxies/
 */

import { NextRequest, NextResponse } from 'next/server';
import { loggerMiddleware, authMiddleware } from '@/middlewares';

/**
 * Global proxy composition
 * Executes middleware chain for all requests
 */
export default async function proxy(request: NextRequest) {

  // 1. Log all incoming requests
  await loggerMiddleware(request);

  // 2. Check authentication for protected routes
  const authResponse = await authMiddleware(request);

  // If auth middleware returns a response (error or modified request), return it
  if (authResponse instanceof NextResponse) {
    return authResponse;
  }

  // Continue with next middleware/handler
  return NextResponse.next();
}


/**
 * Middleware configuration - which routes should be processed
 */
export const config = {
  matcher: [
    // Match all routes except these
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt).*)',
  ],
};
