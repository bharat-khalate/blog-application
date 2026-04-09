import mongoose, { model, Schema, Document } from "mongoose";
import { IComment } from "./comment.types";

export interface ICommentDocument extends Omit<IComment, "_id">, Document {}

const commentSchema = new Schema<ICommentDocument>(
  {
    description: { type: String, required: true, trim: true },
    postId: {
      type: (Schema.Types as any).ObjectId,
      ref: "Post",
    },
    userId: {
      type: (Schema.Types as any).ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "comments",
  },
);

export const Comment =
  mongoose.models.Comment || model<ICommentDocument>("Comment", commentSchema);
