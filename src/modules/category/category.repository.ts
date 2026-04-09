/**
 * Category repository - Database operations
 */

import { Category, type ICategoryDocument } from './category.model';
import { logger } from '@/lib/logger';
import type { ICategory } from './category.types';

/**
 * Maps a Mongoose document to a plain ICategory object
 */
function mapToCategory(doc: ICategoryDocument): ICategory {
    const obj = doc.toObject ? doc.toObject() : doc;
    return {
        _id: obj._id.toString(),
        name: obj.name,
        category_code: obj.category_code,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
    };
}

export interface ICategoryRepository {
    findAll(): Promise<ICategory[]>;
    findById(id: string): Promise<ICategory | null>;
    create(data: Pick<ICategory, 'name' | 'category_code'>): Promise<ICategory>;
    update(id: string, data: Partial<Pick<ICategory, 'name' | 'category_code'>>): Promise<ICategory | null>;
    delete(id: string): Promise<boolean>;
    codeExists(category_code: string, excludeId?: string): Promise<boolean>;
    nameExists(name: string, excludeId?: string): Promise<boolean>;
}

export function createCategoryRepository(): ICategoryRepository {
    return {
        async findAll(): Promise<ICategory[]> {
            try {
                const docs = await Category.find().sort({ createdAt: -1 }).exec();
                return docs.map((d) => mapToCategory(d as ICategoryDocument));
            } catch (error) {
                logger.error('Error fetching categories', error);
                throw error;
            }
        },

        async findById(id: string): Promise<ICategory | null> {
            try {
                const doc = await Category.findById(id).exec();
                return doc ? mapToCategory(doc as ICategoryDocument) : null;
            } catch (error) {
                logger.error('Error finding category by id', error);
                throw error;
            }
        },

        async create(data: Pick<ICategory, 'name' | 'category_code'>): Promise<ICategory> {
            try {
                const doc = new Category(data);
                await doc.save();
                logger.info(`Category created: ${doc.name}`);
                return mapToCategory(doc as ICategoryDocument);
            } catch (error) {
                logger.error('Error creating category', error);
                throw error;
            }
        },

        async update(id: string, data: Partial<Pick<ICategory, 'name' | 'category_code'>>): Promise<ICategory | null> {
            try {
                const doc = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
                if (doc) {
                    logger.info(`Category updated: ${id}`);
                    return mapToCategory(doc as ICategoryDocument);
                }
                return null;
            } catch (error) {
                logger.error('Error updating category', error);
                throw error;
            }
        },

        async delete(id: string): Promise<boolean> {
            try {
                const result = await Category.findByIdAndDelete(id).exec();
                logger.info(`Category deleted: ${id}`);
                return !!result;
            } catch (error) {
                logger.error('Error deleting category', error);
                throw error;
            }
        },

        async codeExists(category_code: string, excludeId?: string): Promise<boolean> {
            try {
                const query: Record<string, unknown> = { category_code: category_code.toUpperCase() };
                if (excludeId) query._id = { $ne: excludeId };
                const count = await Category.countDocuments(query);
                return count > 0;
            } catch (error) {
                logger.error('Error checking category code', error);
                throw error;
            }
        },

        async nameExists(name: string, excludeId?: string): Promise<boolean> {
            try {
                const query: Record<string, unknown> = { name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } };
                if (excludeId) query._id = { $ne: excludeId };
                const count = await Category.countDocuments(query);
                return count > 0;
            } catch (error) {
                logger.error('Error checking category name', error);
                throw error;
            }
        },
    };
}
