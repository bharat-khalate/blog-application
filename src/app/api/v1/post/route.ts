import { postController } from "@/modules/post";
import { withDb } from "@/utils/withDb";
import { NextRequest } from 'next/server';

export const GET = withDb(async (request: NextRequest) => {
  return postController.getAll(request);
});

export const POST = withDb(async (request: NextRequest) => {
  return postController.create(request);
});
