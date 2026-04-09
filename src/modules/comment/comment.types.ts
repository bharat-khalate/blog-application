import { IUser } from "@/types/global.types";
import { IAuthResponse } from "../auth";


export interface IComment{
    _id: string;
    description: string;
    postId: string;
    userId: string;
    createdAt: Date;
}

export interface ICreateCommentRequest {
    description: string;
    postId: string;
    userId: string;
}

export interface ICommentResponse{
    _id:string;
    description:string,
    postId:string;
    user:IAuthResponse;
    createdAt:Date;
}

