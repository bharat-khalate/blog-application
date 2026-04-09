/**
 * GET /api/v1/products/[id] — Get product by id
 * PUT /api/v1/products/[id] — Update product
 * DELETE /api/v1/products/[id] — Delete product
 */

import { NextRequest } from 'next/server';
import { productController } from '@/modules/product';
import { withDb } from '@/utils/withDb';

export const GET = withDb(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return productController.getById(request, id);
});

export const PUT = withDb(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return productController.update(request, id);
});

export const DELETE = withDb(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return productController.delete(request, id);
});
