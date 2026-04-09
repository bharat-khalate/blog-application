/**
 * Auth repository - Database operations
 * Function-based dependency injection pattern
 */

import { User, type IUserDocument } from './auth.model';
import { logger } from '@/lib/logger';
import type { IUser } from '@/types/global.types';

/**
 * Maps a Mongoose document to a plain IUser object
 */
function mapToUser(doc: IUserDocument): IUser {
  const user = doc.toObject ? doc.toObject() : doc;

  return {
    _id: user._id.toString(),
    email: user.email,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role:user.role,
    profilePicUrl:user.profilePicUrl,
  };
}

/**
 * Auth Repository Interface
 */
export interface IAuthRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  create(userData: Partial<IUser>): Promise<IUser>;
  update(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
  emailExists(email: string): Promise<boolean>;
}

/**
 * Factory function to create auth repository
 * This uses function-based DI instead of classes
 */
export function createAuthRepository(): IAuthRepository {
  return {
    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<IUser | null> {
      try {
        const user = await User.findOne({ email: email.toLowerCase() })
          .select('+password')
          .exec();
        return user ? mapToUser(user as IUserDocument) : null;
      } catch (error) {
        logger.error('Error finding user by email', error);
        throw error;
      }
    },

    /**
     * Find user by ID
     */
    async findById(id: string): Promise<IUser | null> {
      try {
        const user = await User.findById(id).exec();
        return user ? mapToUser(user as IUserDocument) : null;
      } catch (error) {
        logger.error('Error finding user by ID', error);
        throw error;
      }
    },

    /**
     * Create new user
     */
    async create(userData: Partial<IUser>): Promise<IUser> {
      try {
        const user = new User(userData);
        await user.save();
        logger.info(`User created: ${user.email}`);
        return mapToUser(user as IUserDocument);
      } catch (error) {
        logger.error('Error creating user', error);
        throw error;
      }
    },

    /**
     * Update user
     */
    async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
      try {
        const user = await User.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        }).exec();

        if (user) {
          logger.info(`User updated: ${id}`);
          return mapToUser(user as IUserDocument);
        }
        return null;
      } catch (error) {
        logger.error('Error updating user', error);
        throw error;
      }
    },

    /**
     * Delete user
     */
    async delete(id: string): Promise<boolean> {
      try {
        const result = await User.findByIdAndDelete(id).exec();
        logger.info(`User deleted: ${id}`);
        return !!result;
      } catch (error) {
        logger.error('Error deleting user', error);
        throw error;
      }
    },

    /**
     * Check if email exists
     */
    async emailExists(email: string): Promise<boolean> {
      try {
        const count = await User.countDocuments({
          email: email.toLowerCase(),
        });
        return count > 0;
      } catch (error) {
        logger.error('Error checking email existence', error);
        throw error;
      }
    },
  };
}
