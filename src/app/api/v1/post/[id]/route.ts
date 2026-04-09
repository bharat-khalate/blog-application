import { postController } from "@/modules/post";
import { withDb } from "@/utils/withDb";
import { NextRequest } from "next/server";



const GET= withDb(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return postController.getById(request, id);
});

export { GET };