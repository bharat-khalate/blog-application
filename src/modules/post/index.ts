import { createPostRepository } from "./post.repository";
import { createPostService } from "./post.service";
import { createPostController } from "./post.controller";

export const postRepository = createPostRepository();
export const postService = createPostService(postRepository);
export const postController = createPostController(postService);

export { createPostRepository, type IPostRepository } from "./post.repository";
export { createPostService, type IPostService } from "./post.service";
export { createPostController, type IPostController } from "./post.controller";

export { Post } from "./post.model";
export { postValidators } from "./post.validator";

export type { IPost, ICreatePostRequest, IPostResponse } from "./post.types";
