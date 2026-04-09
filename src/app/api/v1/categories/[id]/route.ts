/**
 * GET /api/v1/categories/[id] — Get category by id
 * PUT /api/v1/categories/[id] — Update category
 * DELETE /api/v1/categories/[id] — Delete category
 */

import { NextRequest } from 'next/server';
import { categoryController } from '@/modules/category';
import { withDb } from '@/utils/withDb';

export const GET = withDb(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return categoryController.getById(request, id);
});

export const PUT = withDb(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return categoryController.update(request, id);
});

export const DELETE = withDb(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return categoryController.delete(request, id);
});
