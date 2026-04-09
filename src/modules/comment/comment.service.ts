import { IPaginationQuery, IPaginationResponse, PaginatedData } from "@/types/global.types";
import { ICommentRepository } from "./comment.repository";
import { IComment } from "./comment.types";
import { ICreateCommentRequest } from "./comment.types";
import { logger } from "@/lib/logger";

export interface ICommentService {
  getAll(): Promise<IComment[]>;
  create(data: ICreateCommentRequest): Promise<IComment>;
  getById(id: string): Promise<IComment>;
  getByPostId(postId: string, paginationConfig: IPaginationQuery): Promise<PaginatedData<IComment[]>>;
  getCommentCountByPostId(postId: string): Promise<number>;
}

export function createCommentService(repository: ICommentRepository): ICommentService {
  return {
    async getAll(): Promise<IComment[]> {
      try {
        return await repository.findAll();
      } catch (err: any) {
        logger.error("Error fetching comments", err);
        throw err;
      }
    },
    async create(data: ICreateCommentRequest): Promise<IComment> {
      try {
        return await repository.create(data);
      } catch (err: any) {
        logger.error("Error creating comment", err);
        throw err;
      }
    },
    async getById(id: string): Promise<IComment> {
      try {
        const comment = await repository.findById(id);
        if (!comment) {
          throw new Error("Comment not found");
        }
        return comment;
      } catch (err: any) {
        logger.error("Error fetching comment", err);
        throw err;
      }
    },
    async getByPostId(postId: string, paginationConfig: IPaginationQuery) {
      try {
        return await repository.findAllByPostId(postId, paginationConfig);
      } catch (err: any) {
        logger.error("Error fetching comments by post id", err);
        throw err;
      }
    },

    async getCommentCountByPostId(postId: string) {
      try {
        return await repository.findCommentCountByPostId(postId);
      } catch (err: any) {
        logger.error("Error fetching comments count by post id", err);
        throw err;
      }
    },
  };
}
