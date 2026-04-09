/**
 * Category validation
 */

import type { ICreateCategoryRequest, IUpdateCategoryRequest } from './category.types';

export const categoryValidators = {
    validateCreate: (data: ICreateCategoryRequest) => {
        const errors: Record<string, string> = {};

        if (!data.name || data.name.trim() === '') {
            errors.name = 'Name is required';
        }
        if (!data.category_code || data.category_code.trim() === '') {
            errors.category_code = 'Category code is required';
        } else if (!/^[A-Z0-9_-]+$/i.test(data.category_code)) {
            errors.category_code = 'Category code must be alphanumeric (letters, numbers, _ or -)';
        }

        return { valid: Object.keys(errors).length === 0, errors };
    },

    validateUpdate: (data: IUpdateCategoryRequest) => {
        const errors: Record<string, string> = {};

        if (data.name !== undefined && data.name.trim() === '') {
            errors.name = 'Name cannot be empty';
        }
        if (data.category_code !== undefined) {
            if (data.category_code.trim() === '') {
                errors.category_code = 'Category code cannot be empty';
            } else if (!/^[A-Z0-9_-]+$/i.test(data.category_code)) {
                errors.category_code = 'Category code must be alphanumeric (letters, numbers, _ or -)';
            }
        }

        return { valid: Object.keys(errors).length === 0, errors };
    },
};
