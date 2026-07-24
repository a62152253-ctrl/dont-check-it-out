import admin from "firebase-admin";
import dotenv from "dotenv";
import type { Auth } from "firebase-admin/auth";

dotenv.config();

let app: admin.app.App;

if (admin.apps.length === 0) {
  // If GOOGLE_APPLICATION_CREDENTIALS is set in env, firebase automatically picks it up.
  // Otherwise, we fallback to default initialization (or mock credentials for local setup).
  app = admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || "authentication-portal"
  });
} else {
  app = admin.app();
}

export const adminAuth: Auth = admin.auth(app);
export const adminDb = admin.firestore(app);
export default app;
