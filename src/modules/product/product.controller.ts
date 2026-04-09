/**
 * Product controller - Request handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { logger } from '@/lib/logger';
import type { IProductService } from './product.service';
import type { ICreateProductRequest, IUpdateProductRequest } from './product.types';

export function createProductController(service: IProductService) {
    return {
        async getAll(_request: NextRequest): Promise<NextResponse> {
            try {
                const products = await service.getAll();
                return ApiResponse.success(products, 'Products fetched successfully');
            } catch (error) {
                logger.error('Get products controller error', error);
                return ApiError.response(error as Error);
            }
        },

        async getById(_request: NextRequest, id: string): Promise<NextResponse> {
            try {
                const product = await service.getById(id);
                return ApiResponse.success(product, 'Product fetched successfully');
            } catch (error) {
                logger.error('Get product controller error', error);
                return ApiError.response(error as Error);
            }
        },

        async create(request: NextRequest): Promise<NextResponse> {
            try {
                const body = await request.json();
                const data = body as ICreateProductRequest;
                const product = await service.create(data);
                return ApiResponse.created(product, 'Product created successfully');
            } catch (error) {
                logger.error('Create product controller error', error);
                return ApiError.response(error as Error);
            }
        },

        async update(request: NextRequest, id: string): Promise<NextResponse> {
            try {
                const body = await request.json();
                const data = body as IUpdateProductRequest;
                const product = await service.update(id, data);
                return ApiResponse.success(product, 'Product updated successfully');
            } catch (error) {
                logger.error('Update product controller error', error);
                return ApiError.response(error as Error);
            }
        },

        async delete(_request: NextRequest, id: string): Promise<NextResponse> {
            try {
                await service.delete(id);
                return ApiResponse.success(null, 'Product deleted successfully');
            } catch (error) {
                logger.error('Delete product controller error', error);
                return ApiError.response(error as Error);
            }
        },
    };
}

export type IProductController = ReturnType<typeof createProductController>;
