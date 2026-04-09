/**
 * GET /api/v1/categories — List all categories
 * POST /api/v1/categories — Create category
 */

import { NextRequest } from 'next/server';
import { categoryController } from '@/modules/category';
import { withDb } from '@/utils/withDb';

export const GET = withDb(async (request: NextRequest) => {
    return categoryController.getAll(request);
});

export const POST = withDb(async (request: NextRequest) => {
    return categoryController.create(request);
});
