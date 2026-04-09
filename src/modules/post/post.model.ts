import { title } from "process";
import { IPost } from "./post.types";
import { create } from "domain";
import mongoose, { Schema } from "mongoose";

export interface IPostDocument extends Omit<IPost, '_id'>, Document {
  toObject: any;
}
// export interface ICategoryDocument extends Omit<ICategory, '_id'>, Document { }

const postSchema = new Schema<IPostDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    tags: { type: [String], required: true },
    userId: {
      type: (mongoose.Schema.Types as any).ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: String
  },
  {
    timestamps: true,
    collection: "posts",
  },
);


/**
 * Prevent model overwrite in Next.js hot reload
 */

export const Post =
  mongoose.models.Post || mongoose.model<IPostDocument>("Post", postSchema);
