/**
 * Auth service - Business logic
 * Function-based dependency injection pattern
 */

import { authValidators } from './auth.validator';
import { ApiError } from '@/utils/apiError';
import { logger } from '@/lib/logger';
import { hashPassword, comparePassword } from '@/utils/password';
import type { IAuthRepository } from './auth.repository';

import type { ILoginRequest, IRegisterRequest, IAuthResponse } from './auth.types';
import type { IUser } from '@/types/global.types';
import { generateAccessToken } from '@/utils/jwt';


/**
 * Auth Service Interface
 */
export interface IAuthService {
  login(credentials: ILoginRequest): Promise<IAuthResponse>;
  register(data: IRegisterRequest): Promise<IAuthResponse>;
  getUserById(userId: string): Promise<IUser | null>;
}



/**
 * Factory function to create auth service
 * Accepts repository as dependency (function-based DI)
 */
export function createAuthService(repository: IAuthRepository): IAuthService {
  return {
    /**
     * Login user
     */
    async login(credentials: ILoginRequest): Promise<IAuthResponse> {
      try {
        // Validate request
        const validation = authValidators.validateLoginRequest(credentials);
        if (!validation.valid) {
          throw ApiError.badRequest('Validation failed', validation.errors);
        }

        // Find user by email
        const user = await repository.findByEmail(credentials.email);
        if (!user) {
          throw ApiError.unauthorized('Invalid credentials');
        }

        // Compare passwords
        if (!user.password) {
          throw ApiError.unauthorized('Invalid credentials');
        }
        const isPasswordValid = await comparePassword(credentials.password, user.password);
        if (!isPasswordValid) {
          throw ApiError.unauthorized('Invalid credentials');
        }

        // Generate JWT
        const accessToken = generateAccessToken(user._id, user.email, user.role);

        logger.info(`User logged in: ${user.email}`);

        return {
          accessToken,
          user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            profilePicUrl: user.profilePicUrl,
          },
        };
      } catch (error) {
        logger.error('Login failed', error);
        throw error;
      }
    },

    /**
     * Register new user
     */
    async register(data: IRegisterRequest): Promise<IAuthResponse> {
      try {
        // Validate request
        const validation = authValidators.validateRegisterRequest(data);
        if (!validation.valid) {
          throw ApiError.badRequest('Validation failed', validation.errors);
        }

        // Check if email already exists
        const emailExists = await repository.emailExists(data.email);
        if (emailExists) {
          throw ApiError.conflict('Email already registered');
        }

        // Hash password before saving
        const hashedPassword = await hashPassword(data.password);

        // Create user
        const user = await repository.create({
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: "USER",
          profilePicUrl: data.profilePicUrl
        });

        // Generate JWT
        const accessToken = generateAccessToken(user._id, user.email, user.role);

        logger.info(`New user registered: ${user.email}`);

        return {
          accessToken,
          user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            profilePicUrl: user.profilePicUrl,
          },
        };
      } catch (error) {
        logger.error('Registration failed', error);
        throw error;
      }
    },

    /**
     * Get user by ID
     */
    async getUserById(userId: string): Promise<IUser | null> {
      try {
        const user = await repository.findById(userId);
        if (!user) return null;

        // map document to IUser, ID is already string from repository
        return {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          role: user.role,
          profilePicUrl: user.profilePicUrl,
        };
      } catch (error) {
        logger.error('Error fetching user', error);
        throw error;
      }
    },
  };
}
