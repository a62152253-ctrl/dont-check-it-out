import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../config/firebase.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role?: string;
  };
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: (decodedToken.role as string) || "user"
    };
    next();
  } catch (err: any) {
    console.warn("[Auth Middleware] Token verification failed:", err.message);
    res.status(403).json({ error: "Invalid or expired session token" });
  }
}
