import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../lib/env";

export interface AuthPayload {
  userId: string;
  role?: "ADMIN" | "USER";
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  console.log("=== AUTH MIDDLEWARE DEBUG ===");
  console.log("Cookies:", req.cookies);
  console.log("Token exists:", !!req.cookies?.token);
  console.log("Token length:", req.cookies?.token?.length);
  
  const token = req.cookies?.token;
  if (!token) {
    console.log("No token found in cookies");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    console.log("Verifying JWT token...");
    const jwtSecret = getJwtSecret();
    console.log("JWT Secret length:", jwtSecret.length);
    
    const payload = jwt.verify(token, jwtSecret) as AuthPayload;
    console.log("Token verified successfully:", { userId: payload.userId, role: payload.role });
    
    req.auth = payload;
    next();
  } catch (error) {
    console.log("Token verification failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) return res.status(401).json({ error: "Unauthorized" });
  if (req.auth.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });
  next();
}


