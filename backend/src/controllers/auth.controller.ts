import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { adminAuth, adminDb } from "../config/firebase.js";

export async function registerUser(req: AuthenticatedRequest, res: Response) {
  const { email, password, displayName } = req.body;

  if (!email || !password || !displayName) {
    res.status(400).json({ error: "Missing required registration parameters" });
    return;
  }

  try {
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName
    });

    // Save profile metadata
    const userProfile = {
      uid: userRecord.uid,
      email: userRecord.email!,
      displayName: userRecord.displayName || "",
      role: "user",
      plan: "free",
      createdAt: new Date().toISOString(),
      onboardingCompleted: false,
      status: "Active"
    };

    await adminDb.collection("users").doc(userRecord.uid).set(userProfile);

    res.status(201).json({ success: true, profile: userProfile });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function loginUser(req: AuthenticatedRequest, res: Response) {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400).json({ error: "ID Token required for verification" });
    return;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      res.status(404).json({ error: "User profile record not found" });
      return;
    }

    res.status(200).json({ success: true, profile: userDoc.data() });
  } catch (err: any) {
    res.status(401).json({ error: "Invalid credentials token payload: " + err.message });
  }
}

export async function getUserProfile(req: AuthenticatedRequest, res: Response) {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(400).json({ error: "Invalid identity credentials" });
    return;
  }

  try {
    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    res.status(200).json({ success: true, profile: userDoc.data() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
