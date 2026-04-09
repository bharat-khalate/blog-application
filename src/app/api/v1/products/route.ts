/**
 * GET /api/v1/products — List all products
 * POST /api/v1/products — Create product
 */

import { NextRequest } from 'next/server';
import { productController } from '@/modules/product';
import { withDb } from '@/utils/withDb';

export const GET = withDb(async (request: NextRequest) => {
    return productController.getAll(request);
});

export const POST = withDb(async (request: NextRequest) => {
    return productController.create(request);
});
