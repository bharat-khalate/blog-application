import { logger } from "@/lib";
import { Comment } from "./comment.model";
import { IComment, ICreateCommentRequest } from "./comment.types";
import { IPaginationQuery, IPaginationResponse, PaginatedData } from "@/types/global.types";


export interface ICommentRepository {
  create(data: ICreateCommentRequest): Promise<IComment>;
  findAll(): Promise<IComment[]>;
  findById(id: string): Promise<IComment | null>;
  findAllByPostId(postId: string, paginationConfig: IPaginationQuery): Promise<PaginatedData<IComment[]>>;
  findCommentCountByPostId(postId: string): Promise<number>;
}

const mapToComment = (doc: IComment): IComment => {
  const obj = (doc as any).toObject ? (doc as any).toObject() : doc;
  return {
    _id: obj._id.toString(),
    description: obj.description,
    postId: obj.postId.toString(),
    userId: obj.userId.toString(),
    createdAt: obj.createdAt,
  };
};

export function createCommentRepository(): ICommentRepository {
  return {
    async create(data: ICreateCommentRequest): Promise<IComment> {
      try {
        const comment = new Comment(data as IComment);
        logger.info("Comment Saved", comment.id);
        const obj = await comment.save();
        return mapToComment(obj as IComment);
      } catch (err: any) {
        logger.error("Error creating comment", err);
        throw err;
      }
    },

    async findAll(): Promise<IComment[]> {
      try {
        const comments = await Comment.find().sort({ createdAt: -1 }).exec();
        return comments.map((c) => mapToComment(c as IComment));
      } catch (err: any) {
        logger.error("Error fetching comments", err);
        throw err;
      }
    },
    async findById(id: string): Promise<IComment | null> {
      try {
        const comment = await Comment.findById(id).exec();
        return comment ? mapToComment(comment as IComment) : null;
      } catch (err: any) {
        logger.error("Error fetching comment", err);
        throw err;
      }
    },
    async findAllByPostId(postId: string, paginationConfig: IPaginationQuery): Promise<PaginatedData<IComment[]>> {
      try {
        const page = paginationConfig.page || 1;
        const limit = paginationConfig.limit || 10;

        const comments = await Comment.find({ postId })
          .populate("userId") // only needed fields
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean()
          .exec();
        const pagination: IPaginationResponse = {
          total: await Comment.countDocuments({ postId }).exec(),
          page: paginationConfig.page || 1,
          limit: paginationConfig.limit || 10,
          pages: Math.ceil((await Comment.countDocuments({ postId }).exec()) / (paginationConfig.limit || 10)),
          hasMore: ((paginationConfig.page || 1) * (paginationConfig.limit || 10)) < await Comment.countDocuments({ postId }).exec()
        }
        return { data: comments, pagination };
      } catch (err: any) {
        logger.error("Failed to fetch comments by postId", err);
        throw err;
      }
    },
    async findCommentCountByPostId(postId: string): Promise<number> {
      try {
        return await Comment.countDocuments({ postId })
          .exec();
      } catch (err: any) {
        logger.error("Failed to fetch comments count by postId", err);
        throw err;
      }
    }
  };
}
