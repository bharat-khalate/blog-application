/**
 * Auth data model/schema
 */

import mongoose, { Schema, Document, Model } from "mongoose";
import type { IUser } from "@/types/global.types";

export interface IUserDocument extends Omit<IUser, "_id">, Document { }

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "USER",
      enum: ["ADMIN", "USER"],
    },
    profilePicUrl: {
      type: String,
      required: true,
      default: "abc",
      trim: true
    },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

/**
 * Prevent model overwrite in Next.js hot reload
 */
export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", userSchema);
