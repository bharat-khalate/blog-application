/**
 * JWT Utility - Token management
 */
import jwt from "jsonwebtoken";
import { env } from "@/configs/env";

export interface IDecodedToken {
  userId: string;
  email: string;
}

/**
 * Generate Access Token
 */
export function generateAccessToken(
  userId: string,
  email: string,
  role: string,
): string {
  
  return jwt.sign({ userId, email, role }, env.JWT_SECRET as string, {
    expiresIn: env.JWT_EXPIRY as any,
  });
}

/**
 * Verify Access Token
 */
export function verifyAccessToken(token: string): IDecodedToken | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as IDecodedToken;
  } catch {
    return null;
  }
}
