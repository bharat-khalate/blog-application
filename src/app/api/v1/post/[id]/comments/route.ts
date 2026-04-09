import { commentController } from "@/modules/comment";
import { withDb } from "@/utils/withDb";
import { NextRequest } from "next/server";

const GET = withDb(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return commentController.getByPostId(request, id);
});


export { GET };