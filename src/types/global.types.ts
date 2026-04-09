// Global types and interfaces

export interface IUser {
  _id: string;
  email: string;
  // password may not be present when returning user data (e.g. for profiles)
  password?: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  profilePicUrl: string;
  role: "USER" | "ADMIN"
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthPayload {
  userId: string;
  email: string;
  role: string;
}

export interface IApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export interface IApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: Record<string, string | string[]>;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

export interface PaginatedData<T> {
  data: T | T[];
  pagination: IPaginationResponse
}


export interface IPaginationResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasMore: boolean;
}

export interface IPaginatedResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  pagination: IPaginationResponse;
}
