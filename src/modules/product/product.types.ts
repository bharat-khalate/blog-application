/**
 * Product module types
 */

export interface IProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateProductRequest {
    name: string;
    description: string;
    price: number;
    stock?: number;
    category_id: string;
}

export interface IUpdateProductRequest {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category_id?: string;
}
