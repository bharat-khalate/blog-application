import { NextRequest, NextResponse } from 'next/server';
import { loadDatabase } from '@/loaders';
import { disconnectDB } from '@/lib/db';
import { ApiError } from '@/utils/apiError';

/**
 * Higher-Order Function to handle database connection and disconnection for API routes.
 * It also provides a global try-catch block for consistent error responses.
 */
export function withDb(handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>) {
    return async (request: NextRequest, ...args: any[]) => {
        try {
            await loadDatabase();
            return await handler(request, ...args);
        } catch (error) {
            return ApiError.response(error as Error);
        }

        // finally {
        //     await disconnectDB();
        // }
    };
}
