/**
 * Auth validation schemas
 */

import { validations } from '@/utils/validations';
import type { ILoginRequest, IRegisterRequest } from './auth.types';


interface IFileInput { file: File | undefined }

export const authValidators = {
  validateEmail: (email: string): { valid: boolean; error?: string } => {
    if (!email || email.trim() === '') {
      return { valid: false, error: 'Email is required' };
    }
    if (!validations.isValidEmail(email)) {
      return { valid: false, error: 'Invalid email format' };
    }
    return { valid: true };
  },

  validatePassword: (password: string): { valid: boolean; error?: string } => {
    if (!password || password.trim() === '') {
      return { valid: false, error: 'Password is required' };
    }
    if (password.length < 8) {
      return {
        valid: false,
        error: 'Password must be at least 8 characters',
      };
    }
    if (!validations.isValidPassword(password)) {
      return {
        valid: false,
        error:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      };
    }
    return { valid: true };
  },

  validateLoginRequest: (data: ILoginRequest) => {
    const errors: Record<string, string> = {};

    const emailValidation = authValidators.validateEmail(data.email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error!;
    }

    const passwordValidation = authValidators.validatePassword(data.password);
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.error!;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    };
  },

  validateRegisterRequest: (data: IRegisterRequest) => {
    const errors: Record<string, string> = {};

    const emailValidation = authValidators.validateEmail(data.email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error!;
    }

    const passwordValidation = authValidators.validatePassword(data.password);
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.error!;
    }

    if (!data.firstName || data.firstName.trim() === '') {
      errors.firstName = 'First name is required';
    }

    if (!data.lastName || data.lastName.trim() === '') {
      errors.lastName = 'Last name is required';
    }

    // if (!data.profilePicUrl || data.profilePicUrl.trim() === '') {
    //   errors.profilePicUrl = "Profile Picture URL can not be empty or null"
    // } else if (!(data.profilePicUrl.startsWith('http://') || data.profilePicUrl.startsWith('https://'))) {
    //   errors.profilePicUrl = "Invalid Profile Picyure Url";
    // }

    return {
      valid: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    };
  },


  validateRegisterRequestFe: (data: IRegisterRequest & IFileInput) => {
    const errors: Record<string, string> = {};

    const emailValidation = authValidators.validateEmail(data.email);
    if (!emailValidation.valid) {
      errors.email = emailValidation.error!;
    }

    const passwordValidation = authValidators.validatePassword(data.password);
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.error!;
    }

    if (!data.firstName || data.firstName.trim() === '') {
      errors.firstName = 'First name is required';
    }

    if (!data.lastName || data.lastName.trim() === '') {
      errors.lastName = 'Last name is required';
    }


    if (!data.file || data.file === undefined) {
      errors.file = 'Please upload profile picture'
    }

    // if (!data.profilePicUrl || data.profilePicUrl.trim() === '') {
    //   errors.profilePicUrl = "Profile Picture URL can not be empty or null"
    // } else if (!(data.profilePicUrl.startsWith('http://') || data.profilePicUrl.startsWith('https://'))) {
    //   errors.profilePicUrl = "Invalid Profile Picyure Url";
    // }

    return {
      valid: Object.keys(errors).length === 0,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
    };
  },


};
