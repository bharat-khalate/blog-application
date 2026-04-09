/**
 * Product validation
 */

import type { ICreateProductRequest, IUpdateProductRequest } from './product.types';

export const productValidators = {
    validateCreate: (data: ICreateProductRequest) => {
        const errors: Record<string, string> = {};

        if (!data.name || data.name.trim() === '') errors.name = 'Name is required';
        if (!data.description || data.description.trim() === '') errors.description = 'Description is required';
        if (data.price === undefined || data.price === null) {
            errors.price = 'Price is required';
        } else if (isNaN(data.price) || data.price < 0) {
            errors.price = 'Price must be a non-negative number';
        }
        if (data.stock !== undefined && (isNaN(data.stock) || data.stock < 0)) {
            errors.stock = 'Stock must be a non-negative number';
        }
        if (!data.category_id || data.category_id.trim() === '') {
            errors.category_id = 'Category is required';
        }

        return { valid: Object.keys(errors).length === 0, errors };
    },

    validateUpdate: (data: IUpdateProductRequest) => {
        const errors: Record<string, string> = {};

        if (data.name !== undefined && data.name.trim() === '') errors.name = 'Name cannot be empty';
        if (data.description !== undefined && data.description.trim() === '') errors.description = 'Description cannot be empty';
        if (data.price !== undefined && (isNaN(data.price) || data.price < 0)) {
            errors.price = 'Price must be a non-negative number';
        }
        if (data.stock !== undefined && (isNaN(data.stock) || data.stock < 0)) {
            errors.stock = 'Stock must be a non-negative number';
        }

        return { valid: Object.keys(errors).length === 0, errors };
    },
};
