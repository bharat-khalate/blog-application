import { ICreateCommentRequest } from "./comment.types";

export const commentValidators = {
  validateCreate(data: ICreateCommentRequest) {
    const errors: Record<string, string> = {};
    if (!data.userId || data.userId.trim() === "") {
        errors.userId="User ID is required";
    }
    if (!data.postId || data.postId.trim() === "") {
        errors.postId="Post ID is required";
    }
    if (!data.description || data.description.trim() === "") {
        errors.description="Comment can't be empty ";
    } else if (data.description.trim().length < 5) {
        errors.description="Comment must be at least 5 characters long";
    } else if (data.description.trim().length > 300) {
        errors.description="Comment cannot exceed 300 characters";
    }
    return { valid: Object.keys(errors).length === 0, errors };
  },
};
