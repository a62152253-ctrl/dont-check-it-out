import { z } from "zod";

export const UserProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().min(1),
  photoURL: z.string().url().optional(),
  createdAt: z.string().datetime(),
  role: z.enum(["user", "admin", "moderator"]),
  plan: z.enum(["free", "pro", "enterprise"]),
  companyName: z.string().optional(),
  onboardingCompleted: z.boolean(),
  status: z.enum(["Active", "Suspended", "Pending"])
});

export const UserActivitySchema = z.object({
  uid: z.string(),
  action: z.string(),
  timestamp: z.string().datetime(),
  userAgent: z.string(),
  status: z.enum(["Success", "Failed"]),
  details: z.string().optional()
});
