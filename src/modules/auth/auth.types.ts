/**
 * Auth module types
 */

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePicUrl?: string;
  file?: File
}

export interface IAuthResponse {
  accessToken: string;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    profilePicUrl: string
  };
}

export interface ITokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
