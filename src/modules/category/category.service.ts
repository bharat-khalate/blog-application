/**
 * Category service - Business logic
 */

import { categoryValidators } from './category.validator';
import { ApiError } from '@/utils/apiError';
import { logger } from '@/lib/logger';
import type { ICategoryRepository } from './category.repository';
import type { ICategory, ICreateCategoryRequest, IUpdateCategoryRequest } from './category.types';

export interface ICategoryService {
    getAll(): Promise<ICategory[]>;
    getById(id: string): Promise<ICategory | null>;
    create(data: ICreateCategoryRequest): Promise<ICategory>;
    update(id: string, data: IUpdateCategoryRequest): Promise<ICategory | null>;
    delete(id: string): Promise<boolean>;
}

export function createCategoryService(repository: ICategoryRepository): ICategoryService {
    return {
        async getAll(): Promise<ICategory[]> {
            try {
                return await repository.findAll();
            } catch (error) {
                logger.error('Error fetching all categories', error);
                throw error;
            }
        },

        async getById(id: string): Promise<ICategory | null> {
            try {
                const category = await repository.findById(id);
                if (!category) throw ApiError.notFound('Category not found');
                return category;
            } catch (error) {
                logger.error('Error fetching category by id', error);
                throw error;
            }
        },

        async create(data: ICreateCategoryRequest): Promise<ICategory> {
            try {
                const validation = categoryValidators.validateCreate(data);
                if (!validation.valid) throw ApiError.badRequest('Validation failed', validation.errors);

                if (data.category_code) {
                    const codeExists = await repository.codeExists(data.category_code);
                    if (codeExists) throw ApiError.conflict('Category code already exists');
                }

                if (data.name) {
                    const nameExists = await repository.nameExists(data.name);
                    if (nameExists) throw ApiError.conflict('Category name already exists');
                }

                return await repository.create(data);
            } catch (error) {
                logger.error('Error creating category', error);
                throw error;
            }
        },

        async update(id: string, data: IUpdateCategoryRequest): Promise<ICategory | null> {
            try {
                const validation = categoryValidators.validateUpdate(data);
                if (!validation.valid) throw ApiError.badRequest('Validation failed', validation.errors);

                if (data.category_code) {
                    const codeExists = await repository.codeExists(data.category_code, id);
                    if (codeExists) throw ApiError.conflict('Category code already exists');
                }

                if (data.name) {
                    const nameExists = await repository.nameExists(data.name, id);
                    if (nameExists) throw ApiError.conflict('Category name already exists');
                }

                const updated = await repository.update(id, data);
                if (!updated) throw ApiError.notFound('Category not found');
                return updated;
            } catch (error) {
                logger.error('Error updating category', error);
                throw error;
            }
        },

        async delete(id: string): Promise<boolean> {
            try {
                const deleted = await repository.delete(id);
                if (!deleted) throw ApiError.notFound('Category not found');
                return true;
            } catch (error) {
                logger.error('Error deleting category', error);
                throw error;
            }
        },
    };
}
