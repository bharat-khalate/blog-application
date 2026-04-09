/**
 * Product service - Business logic
 * Receives ICategoryRepository to validate category_id without importing the Category model.
 */

import { productValidators } from './product.validator';
import { ApiError } from '@/utils/apiError';
import { logger } from '@/lib/logger';
import type { IProductRepository } from './product.repository';
import type { ICategoryRepository } from '@/modules/category/category.repository';
import type { IProduct, ICreateProductRequest, IUpdateProductRequest } from './product.types';

export interface IProductService {
    getAll(): Promise<IProduct[]>;
    getById(id: string): Promise<IProduct | null>;
    create(data: ICreateProductRequest): Promise<IProduct>;
    update(id: string, data: IUpdateProductRequest): Promise<IProduct | null>;
    delete(id: string): Promise<boolean>;
}

export function createProductService(
    repository: IProductRepository,
    categoryRepository: ICategoryRepository
): IProductService {
    return {
        async getAll(): Promise<IProduct[]> {
            try {
                return await repository.findAll();
            } catch (error) {
                logger.error('Error fetching all products', error);
                throw error;
            }
        },

        async getById(id: string): Promise<IProduct | null> {
            try {
                const product = await repository.findById(id);
                if (!product) throw ApiError.notFound('Product not found');
                return product;
            } catch (error) {
                logger.error('Error fetching product by id', error);
                throw error;
            }
        },

        async create(data: ICreateProductRequest): Promise<IProduct> {
            try {
                const validation = productValidators.validateCreate(data);
                if (!validation.valid) throw ApiError.badRequest('Validation failed', validation.errors);

                // Verify category exists via CategoryRepository (no direct model import)
                const category = await categoryRepository.findById(data.category_id);
                if (!category) throw ApiError.badRequest('Category not found', { category_id: 'Invalid category' });

                // Unique name check
                const nameExists = await repository.nameExists(data.name);
                if (nameExists) throw ApiError.conflict('Product name already exists');

                return await repository.create({
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    stock: data.stock ?? 0,
                    category_id: data.category_id,
                });
            } catch (error) {
                logger.error('Error creating product', error);
                throw error;
            }
        },

        async update(id: string, data: IUpdateProductRequest): Promise<IProduct | null> {
            try {
                const validation = productValidators.validateUpdate(data);
                if (!validation.valid) throw ApiError.badRequest('Validation failed', validation.errors);

                if (data.category_id) {
                    const category = await categoryRepository.findById(data.category_id);
                    if (!category) throw ApiError.badRequest('Category not found', { category_id: 'Invalid category' });
                }

                // Unique name check (exclude current product)
                if (data.name) {
                    const nameExists = await repository.nameExists(data.name, id);
                    if (nameExists) throw ApiError.conflict('Product name already exists');
                }

                const updated = await repository.update(id, data);
                if (!updated) throw ApiError.notFound('Product not found');
                return updated;
            } catch (error) {
                logger.error('Error updating product', error);
                throw error;
            }
        },

        async delete(id: string): Promise<boolean> {
            try {
                const deleted = await repository.delete(id);
                if (!deleted) throw ApiError.notFound('Product not found');
                return true;
            } catch (error) {
                logger.error('Error deleting product', error);
                throw error;
            }
        },
    };
}
