/**
 * Category data model/schema
 */

import mongoose, { Schema, Document, Model } from 'mongoose';
import type { ICategory } from './category.types';

export interface ICategoryDocument extends Omit<ICategory, '_id'>, Document { }

const categorySchema = new Schema<ICategoryDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category_code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
    },
    {
        timestamps: true,
        collection: 'categories',
    }
);

/**
 * Prevent model overwrite in Next.js hot reload
 */
export const Category: Model<ICategoryDocument> =
    mongoose.models.Category ||
    mongoose.model<ICategoryDocument>('Category', categorySchema);
