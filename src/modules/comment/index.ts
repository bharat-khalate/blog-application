import { createCommentController } from "./comment.controller";
import { createCommentRepository } from "./comment.repository";
import { createCommentService } from "./comment.service";

export const commentRepository = createCommentRepository();
export const commentService = createCommentService(commentRepository);
export const commentController = createCommentController(commentService);

export {
  createCommentRepository,
  type ICommentRepository,
} from "./comment.repository";
export { createCommentService, type ICommentService } from "./comment.service";
export {
  createCommentController,
  type ICommentController,
} from "./comment.controller";

export { Comment } from "./comment.model";
export { commentValidators } from "./comment.validators";
export type { IComment, ICreateCommentRequest } from "./comment.types";