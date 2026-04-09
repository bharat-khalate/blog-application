/**
 * Category controller - Request handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { logger } from '@/lib/logger';
import type { ICategoryService } from './category.service';
import type { ICreateCategoryRequest, IUpdateCategoryRequest } from './category.types';

export function createCategoryController(service: ICategoryService) {
    return {
        async getAll(_request: NextRequest): Promise<NextResponse> {
            try {
                const categories = await service.getAll();
                return ApiResponse.success(categories, 'Categories fetched successfully');
            } catch (error) {
                logger.error('Get categories controller error', error);
                return ApiError.response(error as Error);
            }
        },

        async getById(_request: NextRequest, id: string): Promise<NextResponse> {
            try {
                const category = await service.getById(id);
                return ApiResponse.success(category, 'Category fetched successfully');
            } catch (error) {
                logger.error('Get category controller error', error);
                return ApiError.response(error as Error);
            }
        },

        async create(request: NextRequest): Promise<NextResponse> {
            try {
                const body = await request.json();
                const data = body as ICreateCategoryRequest;
                const category = await service.create(data);
                return ApiResponse.created(category, 'Category created successfully');
            } catch (error) {
                logger.error('Create category controller error', error);
                return ApiError.response(error as Error);
            }
        },

        async update(request: NextRequest, id: string): Promise<NextResponse> {
            try {
                const body = await request.json();
                const data = body as IUpdateCategoryRequest;
                const category = await service.update(id, data);
                return ApiResponse.success(category, 'Category updated successfully');
            } catch (error) {
                logger.error('Update category controller error', error);
                return ApiError.response(error as Error);
            }
        },

        async delete(_request: NextRequest, id: string): Promise<NextResponse> {
            try {
                await service.delete(id);
                return ApiResponse.success(null, 'Category deleted successfully');
            } catch (error) {
                logger.error('Delete category controller error', error);
                return ApiError.response(error as Error);
            }
        },
    };
}

export type ICategoryController = ReturnType<typeof createCategoryController>;
