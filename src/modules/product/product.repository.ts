/**
 * Product repository - Database operations
 * Depends only on Product model and ICategoryRepository interface (via injection in service)
 */

import { Product, type IProductDocument } from './product.model';
import { logger } from '@/lib/logger';
import type { IProduct } from './product.types';

function mapToProduct(doc: IProductDocument): IProduct {
    const obj = doc.toObject ? doc.toObject() : doc;
    return {
        _id: obj._id.toString(),
        name: obj.name,
        description: obj.description,
        price: obj.price,
        stock: obj.stock,
        category_id: obj.category_id.toString(),
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
    };
}

export interface IProductRepository {
    findAll(): Promise<IProduct[]>;
    findById(id: string): Promise<IProduct | null>;
    create(data: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>): Promise<IProduct>;
    update(id: string, data: Partial<Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>>): Promise<IProduct | null>;
    delete(id: string): Promise<boolean>;
    nameExists(name: string, excludeId?: string): Promise<boolean>;
}

export function createProductRepository(): IProductRepository {
    return {
        async findAll(): Promise<IProduct[]> {
            try {
                const docs = await Product.find().sort({ createdAt: -1 }).exec();
                return docs.map((d) => mapToProduct(d as IProductDocument));
            } catch (error) {
                logger.error('Error fetching products', error);
                throw error;
            }
        },

        async findById(id: string): Promise<IProduct | null> {
            try {
                const doc = await Product.findById(id).exec();
                return doc ? mapToProduct(doc as IProductDocument) : null;
            } catch (error) {
                logger.error('Error finding product by id', error);
                throw error;
            }
        },

        async create(data: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>): Promise<IProduct> {
            try {
                const doc = new Product(data);
                await doc.save();
                logger.info(`Product created: ${doc.name}`);
                return mapToProduct(doc as IProductDocument);
            } catch (error) {
                logger.error('Error creating product', error);
                throw error;
            }
        },

        async update(id: string, data: Partial<Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>>): Promise<IProduct | null> {
            try {
                const doc = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
                if (doc) {
                    logger.info(`Product updated: ${id}`);
                    return mapToProduct(doc as IProductDocument);
                }
                return null;
            } catch (error) {
                logger.error('Error updating product', error);
                throw error;
            }
        },

        async delete(id: string): Promise<boolean> {
            try {
                const result = await Product.findByIdAndDelete(id).exec();
                logger.info(`Product deleted: ${id}`);
                return !!result;
            } catch (error) {
                logger.error('Error deleting product', error);
                throw error;
            }
        },

        async nameExists(name: string, excludeId?: string): Promise<boolean> {
            try {
                const query: Record<string, unknown> = { name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } };
                if (excludeId) query._id = { $ne: excludeId };
                const count = await Product.countDocuments(query);
                return count > 0;
            } catch (error) {
                logger.error('Error checking product name', error);
                throw error;
            }
        },
    };
}
