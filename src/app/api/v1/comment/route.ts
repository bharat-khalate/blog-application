import { NextRequest } from "next/server";
import { withDb } from "@/utils/withDb";
import { commentController } from "@/modules/comment";

const GET = withDb(async (request: NextRequest) => {
  return commentController.getAll(request);
});

const POST = withDb(async (request: NextRequest) => {
  return commentController.create(request);
});

export { GET, POST };
