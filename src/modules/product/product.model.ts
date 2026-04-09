/**
 * Product data model/schema
 * NOTE: Does NOT import the Category model — category_id is just an ObjectId ref.
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import type { IProduct } from './product.types';

export interface IProductDocument extends Omit<IProduct, '_id'>, Document { }

const productSchema = new Schema<IProductDocument>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, default: 0, min: 0 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category_id: { type: (mongoose.Schema.Types as any).ObjectId, ref: 'Category', required: true },
    },
    {
        timestamps: true,
        collection: 'products',
    }
);

/**
 * Prevent model overwrite in Next.js hot reload
 */
export const Product: Model<IProductDocument> =
    mongoose.models.Product ||
    mongoose.model<IProductDocument>('Product', productSchema);
