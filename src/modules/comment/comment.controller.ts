import { NextRequest, NextResponse } from "next/server";
import { ICommentService } from "./comment.service";
import { ApiError, ApiResponse } from "@/utils";
import { commentValidators } from "./comment.validators";
import { IPaginationQuery } from "@/types/global.types";
import { getPaginationValues } from "@/utils/getPaginationValues";
import { IComment } from "./comment.types";

export function createCommentController(service: ICommentService) {
  return {
    async getAll(_request: NextRequest): Promise<NextResponse> {
      try {
        const comments = await service.getAll();
        return ApiResponse.success(comments, "Comments fetched successfully");
      } catch (err: any) {
        console.error("Error fetching comments", err);
        return ApiError.response(err as Error);
      }
    },
    async create(_request: NextRequest): Promise<NextResponse> {
      try {
        const body = await _request.json();
        const validation = commentValidators.validateCreate(body);
        if (!validation.valid)
          throw ApiError.badRequest("Validation failed", validation.errors);
        const comment = await service.create(body);
        return ApiResponse.success(comment, "Comment created successfully");
      } catch (err: any) {
        console.error("Error creating comment", err);
        return ApiError.response(err as Error);
      }
    },
    async getById(_request: NextRequest, id: string): Promise<NextResponse> {
      try {
        const comment = await service.getById(id);
        return ApiResponse.success(comment, "Comment fetched successfully");
      } catch (err: any) {
        console.error("Error fetching comment", err);
        return ApiError.response(err as Error);
      }
    },
    async getByPostId(
      _request: NextRequest,
      postId: string,
    ): Promise<NextResponse> {
      try {
        const paginationConfig: IPaginationQuery = getPaginationValues(Object.fromEntries(_request.nextUrl.searchParams.entries()));
        const { data, pagination } = await service.getByPostId(postId, paginationConfig);
        return ApiResponse.paginated(data as IComment[], pagination, "Comments fetched successfully");
      } catch (err: any) {
        console.error("Error fetching comments by post id", err);
        return ApiError.response(err as Error);
      }
    },

    async getCommentCountByPostId(
      _request: NextRequest,
      postId: string,
    ): Promise<NextResponse> {
      try {
        const comments = await service.getCommentCountByPostId(postId);
        return ApiResponse.success(comments, "Comments count fetched successfully");
      } catch (err: any) {
        console.error("Error fetching comments count by post id", err);
        return ApiError.response(err as Error);
      }
    },
  };
}

export type ICommentController = ReturnType<typeof createCommentController>;
