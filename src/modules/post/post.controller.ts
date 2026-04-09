import { NextRequest } from "next/server";
import { IPostService } from "./post.service";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { logger } from "@/lib/logger";
import { ICreatePostRequest } from "./post.types";
import formDataParser from "@/utils/formDataParser";
import { storage } from "@/integrations/storage";
import { POST_IMAGES_UPLOAD_DIRECTORY } from "@/utils/constants";
import { IPaginationQuery } from "@/types/global.types";
import { getPaginationValues } from "@/utils/getPaginationValues";

export function createPostController(service: IPostService) {
  return {
    async getAll(_request: NextRequest) {
      try {
        const paginationConfig: IPaginationQuery = getPaginationValues(Object.fromEntries(_request.nextUrl.searchParams.entries()));
        const { data, pagination } = await service.getAll(paginationConfig);
        return ApiResponse.paginated([...(data instanceof Array ? data : [data])], pagination, "Posts fetched successfully");
      } catch (error) {
        logger.error("Get posts controller error", error);
        return ApiError.response(error as Error);
      }
    },

    async getById(_request: NextRequest, id: string) {
      try {
        const post = await service.getById(id);
        return ApiResponse.success(post, "Post fetched successfully");
      } catch (error) {
        logger.error("Get post controller error", error);
        return ApiError.response(error as Error);
      }
    },

    async create(_request: NextRequest) {
      try {
        //fetching the formdata from request
        const formData = await _request.formData();
        //parsing the formdata in json
        const data: ICreatePostRequest = formDataParser(formData) as ICreatePostRequest;
        //saving the file and fetching the url
        const file: File = formData.get('file') as File

        //setting the profilePictureUser
        if (file)
          data.imageUrl = await storage.uploadFile(formData.get('file') as File, POST_IMAGES_UPLOAD_DIRECTORY);

        const post = await service.create(data as ICreatePostRequest);
        return ApiResponse.success(post, "Post created successfully");
      } catch (error) {
        logger.error("Create post controller error", error);
        return ApiError.response(error as Error);
      }
    },
  };
}

export type IPostController = ReturnType<typeof createPostController>;
