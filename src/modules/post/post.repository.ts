import { logger } from "@/lib/logger";
import { IPostDocument, Post } from "./post.model";
import { ICreatePostRequest, IPost, IPostResponse } from "./post.types";
import { IPaginationQuery, IPaginationResponse, PaginatedData } from "@/types/global.types";


export interface IPostRepository {
  create(postData: ICreatePostRequest): Promise<IPostResponse>;
  findById(userId: string): Promise<IPostResponse | null>;
  findAll(paginationConfig: IPaginationQuery): Promise<PaginatedData<IPostResponse>>;
}

function mapToPostResponse(post: IPostDocument): IPostResponse {
  const obj = post.toObject ? post.toObject() : post;
  return {
    _id: obj._id,
    userId: obj.userId,
    title: obj.title,
    description: obj.description,
    createdAt: obj.createdAt,
    tags: obj.tags,
    ...(obj.imageUrl ? { imageUrl: obj.imageUrl } : {})
  };
}



export function createPostRepository(): IPostRepository {
  return {
    async create(postData: ICreatePostRequest): Promise<IPostResponse> {
      const post = new Post(postData);
      await post.save();
      logger.info(`Post created: ${post.title}`);
      return mapToPostResponse(post as IPostDocument);
    },
    async findById(userId: string): Promise<IPostResponse | null> {
      const posts = await Post.findById(userId).exec();
      return posts ? mapToPostResponse(posts as IPostDocument) : null;
    },
    async findAll(paginationConfig: IPaginationQuery): Promise<PaginatedData<IPostResponse>> {

      const posts = await Post.find()
        .skip(((paginationConfig.page || 1) - 1) * (paginationConfig.limit || 10))
        .limit(paginationConfig.limit || 10)
        .select("-description")
        .sort({ createdAt: -1 })
        .exec();
      const pagination: IPaginationResponse = {
        total: await Post.countDocuments().exec(),
        page: paginationConfig.page || 1,
        limit: paginationConfig.limit || 10,
        pages: Math.ceil((await Post.countDocuments().exec()) / (paginationConfig.limit || 10)),
        hasMore: ((paginationConfig.page || 1) * (paginationConfig.limit || 10)) < await Post.countDocuments().exec()
      }
      return { data: posts.map((p) => mapToPostResponse(p as IPostDocument)), pagination };
    },
  };
}
