import "express";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user: {
      isUserLogged: boolean;
      id: number; // Or string if your IDs are UUIDs
      fullName: string;
      email: string;
      iat: string;
    };
  }
}

export interface MyJwtPayload extends jwt.JwtPayload {
  id: number;
  email?: string;
}
