import { logger } from "@/lib/logger";
import { ICreatePostRequest, IPost, IPostResponse } from "./post.types";
import { ApiError } from "@/utils/apiError";
import { postValidators } from "./post.validator";
import { IPostRepository } from "./post.repository";
import { IMAGES } from "@/utils/constants";
import { env } from "@/configs/env";
import { IPaginationQuery, PaginatedData } from "@/types/global.types";

export interface IPostService {
  getAll(paginationConfig: IPaginationQuery):Promise<PaginatedData<IPostResponse>>;
  getById(id: string): Promise<IPostResponse>;
  create(data: ICreatePostRequest): Promise<IPostResponse>;
}

interface IPostWithImage extends IPost {
  imageUrl?: string;
}


const mapImages = (posts: IPostResponse[] | IPostResponse, threshold: number = 0.6): IPostResponse[] => {
  // 40% posts get image
  if (!(posts instanceof Array)) posts = [posts];
  return posts.map((post) => {
    const shouldAddImage = Math.random() < threshold;
    if (!shouldAddImage) return post;
    const randomImage = `${env.APP_URL}/${IMAGES[Math.floor(Math.random() * IMAGES.length)]}`;
    return {
      ...post,
      imageUrl: randomImage
    };
  });
}


export function createPostService(repository: IPostRepository): IPostService {
  return {
    async getAll(paginationConfig: IPaginationQuery): Promise<PaginatedData<IPostResponse>> {
      try {

        const posts = await repository.findAll(paginationConfig);
        return posts;
      } catch (error) {
        logger.error("Error fetching all posts", error);
        throw error;
      }
    },
    async getById(id: string): Promise<IPostResponse> {
      try {
        const post = await repository.findById(id);
        if (!post) throw ApiError.notFound("Post not found");
        return post;
        // return post;
      } catch (error) {
        logger.error("Error fetching post by ID", error);
        throw error;
      }
    },
    async create(data: ICreatePostRequest): Promise<IPostResponse> {
      try {
        const validation = postValidators.validateCreate(data);
        if (!validation.valid)
          throw ApiError.badRequest("Validation failed", validation.errors);
        return await repository.create(data);
      } catch (error) {
        logger.error("Error creating post", error);
        throw error;
      }
    },
  };
}
