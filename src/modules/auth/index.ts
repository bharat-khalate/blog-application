/**
 * Auth module barrel export
 * Function-based Dependency Injection Pattern (Composition Root)
 */

import { createAuthRepository } from './auth.repository';
import { createAuthService } from './auth.service';
import { createAuthController } from './auth.controller';

// Initialize Singletons and wire dependencies
export const authRepository = createAuthRepository();
export const authService = createAuthService(authRepository);
export const authController = createAuthController(authService);

// Factory functions
export { createAuthRepository, type IAuthRepository } from './auth.repository';
export { createAuthService, type IAuthService } from './auth.service';
export { createAuthController, type IAuthController } from './auth.controller';

// Model and validators
export { User } from './auth.model';
export { authValidators } from './auth.validator';

// Types
export type {
  ILoginRequest,
  IRegisterRequest,
  IAuthResponse,
  ITokenPayload,
} from './auth.types';
