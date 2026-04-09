/**
 * Category module barrel export — Composition Root
 */

import { createCategoryRepository } from './category.repository';
import { createCategoryService } from './category.service';
import { createCategoryController } from './category.controller';

// Wire dependencies
export const categoryRepository = createCategoryRepository();
export const categoryService = createCategoryService(categoryRepository);
export const categoryController = createCategoryController(categoryService);

// Factory functions & interfaces
export { createCategoryRepository, type ICategoryRepository } from './category.repository';
export { createCategoryService, type ICategoryService } from './category.service';
export { createCategoryController, type ICategoryController } from './category.controller';

// Model
export { Category } from './category.model';
export { categoryValidators } from './category.validator';

// Types
export type { ICategory, ICreateCategoryRequest, IUpdateCategoryRequest } from './category.types';
