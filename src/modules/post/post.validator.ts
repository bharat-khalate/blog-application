import { ICreatePostRequest } from "./post.types";

export const postValidators = {
  validateCreate: (data: ICreatePostRequest) => {
    const errors: Record<string, string> = {};

    if (!data.userId || data.userId.trim() === "") {
      errors.userId = "User ID is required";
    }
    if (!data.title || data.title.trim() === "") {
      errors.title = "Title is required";
    } else if (data.title.trim().length < 5) {
      errors.title = "Title must be at least 5 characters long";
    } else if (!/^[a-zA-Z\s]+$/.test(data.title.trim())) {
      errors.title = "Title can only contain letters and spaces";
    }
    if (!data.description || data.description.trim() === "") {
      errors.description = "Description is required";
    } else if (data.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters long";
    } else if (data.description.trim().length > 15000) {
      errors.description = "Description cannot exceed 15000 characters";
    } else if (!/[a-zA-Z]/.test(data.description.trim())) {
      errors.description = "Description must contain at least one alphabet character";
    }

    return { valid: Object.keys(errors).length === 0, errors };
  },
};
