import { NextResponse } from 'next/server';
import type { IApiResponse, IPaginatedResponse, IPaginationResponse } from '@/types/global.types';
import { HTTP_STATUS } from './constants';

/**
 * Function-based API Response Handler
 */

export function createSuccessResponse<T = any>(
  data: T,
  message: string = 'Success',
  statusCode: number = HTTP_STATUS.OK
): NextResponse<IApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      statusCode,
      message,
      data,
    },
    { status: statusCode }
  );
}

export function createCreatedResponse<T = any>(
  data: T,
  message: string = 'Created'
): NextResponse<IApiResponse<T>> {
  return createSuccessResponse(data, message, HTTP_STATUS.CREATED);
}

export function createPaginatedResponse<T = any>(
  data: T[],
  pagination: IPaginationResponse,
  message: string = 'Fetched',
  statusCode: number = HTTP_STATUS.OK
): NextResponse<IPaginatedResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      statusCode,
      message,
      data,
      pagination,
    },
    { status: statusCode }
  );
}

/**
 * Backwards compatibility aliases (use new names above)
 */
export const ApiResponse = {
  success: createSuccessResponse,
  created: createCreatedResponse,
  paginated: createPaginatedResponse,
};
