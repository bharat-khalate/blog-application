/**
 * Product module barrel export — Composition Root
 * ProductService depends on CategoryRepository (via interface), not Category model.
 */

import { createProductRepository } from './product.repository';
import { createProductService } from './product.service';
import { createProductController } from './product.controller';
import { categoryRepository } from '@/modules/category';

// Wire dependencies — inject categoryRepository so product service can validate categories
export const productRepository = createProductRepository();
export const productService = createProductService(productRepository, categoryRepository);
export const productController = createProductController(productService);

// Factory functions & interfaces
export { createProductRepository, type IProductRepository } from './product.repository';
export { createProductService, type IProductService } from './product.service';
export { createProductController, type IProductController } from './product.controller';

// Model
export { Product } from './product.model';
export { productValidators } from './product.validator';

// Types
export type { IProduct, ICreateProductRequest, IUpdateProductRequest } from './product.types';
