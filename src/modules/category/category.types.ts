/**
 * Category module types
 */

export interface ICategory {
    _id: string;
    name: string;
    category_code: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateCategoryRequest {
    name: string;
    category_code: string;
}

export interface IUpdateCategoryRequest {
    name?: string;
    category_code?: string;
}
