/**
 * Auth controller - Request handling
 * Function-based dependency injection pattern
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/utils/apiResponse';
import { ApiError } from '@/utils/apiError';
import { logger } from '@/lib/logger';
import { SUCCESS_MESSAGES, USER_PROFILE_PICTURE_UPLOAD_DIR } from '@/utils/constants';
import type { IAuthService } from './auth.service';
import type { ILoginRequest, IRegisterRequest } from './auth.types';
import formDataParser from '@/utils/formDataParser';
import { storage } from '@/integrations/storage';
import { cookies } from 'next/headers';



/**
 * Factory function to create auth controller
 * Accepts service as dependency (function-based DI)
 */
export type IAuthController = ReturnType<typeof createAuthController>;

export function createAuthController(service: IAuthService) {
  return {
    /**
     * Login endpoint
     */
    async login(request: NextRequest): Promise<NextResponse> {
      try {
        const cookieStore = await cookies();

        const body = await request.json();
        const credentials = body as ILoginRequest;
        const result = await service.login(credentials);
        cookieStore.set("token", result.accessToken, {
          httpOnly: true, // Prevents client-side JS from accessing the cookie (Secure!)
          secure: process.env.NODE_ENV === "production", // Only sends over HTTPS in production
          sameSite: "strict", // Prevents CSRF attacks
          path: "/", // Available across the entire site
          maxAge: 60 * 60 * 24 * 7, // 1 week in seconds
        });
        return ApiResponse.success(result, SUCCESS_MESSAGES.LOGIN_SUCCESS);
      } catch (error) {
        logger.error('Login controller error', error);
        return ApiError.response(error as Error);
      }
    },

    /**
     * Register endpoint
     */
    async register(request: NextRequest): Promise<NextResponse> {
      try {
        //fetching the formdata from request
        const formData = await request.formData();
        //saving the file and fetching the url
        const profilePicUrl = await storage.uploadFile(formData.get('file') as File, USER_PROFILE_PICTURE_UPLOAD_DIR);
        //parsing the formdata in json
        const data = formDataParser(formData) as IRegisterRequest;

        //setting the profilePictureUser
        data.profilePicUrl = profilePicUrl;

        //calling service to handle validation and data persistence
        const result = await service.register(data);
        return ApiResponse.created(result, 'User registered successfully');
      } catch (error) {
        logger.error('Register controller error', error);
        return ApiError.response(error as Error);
      }
    },

    /**
     * Get current user
     */
    async getCurrentUser(request: NextRequest): Promise<NextResponse> {
      try {
        const userId = request.headers.get('x-user-id');
        if (!userId) {
          throw ApiError.unauthorized('User not authenticated');
        }
        const user = await service.getUserById(userId);
        if (!user) {
          throw ApiError.notFound('User not found');
        }
        return ApiResponse.success(user, SUCCESS_MESSAGES.FETCHED);
      } catch (error) {
        logger.error('Get user controller error', error);
        return ApiError.response(error as Error);
      }
    },

    /**
     * Logout
     */
    async logout(_request: NextRequest): Promise<NextResponse> {

      try {
        // Logout logic (invalidate tokens, etc.)
        return ApiResponse.success(null, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
      } catch (error) {
        logger.error('Logout controller error', error);
        return ApiError.response(error as Error);
      }
    },
  };
}
