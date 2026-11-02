import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { adminDb } from "../config/firebase.js";
import { z } from "zod";

const secretPayloadSchema = z.object({
  name: z.string().min(1),
  ciphertext: z.string().min(1),
  iv: z.string().min(1),
  category: z.string().min(1),
  isFavorite: z.boolean().optional(),
  isTrash: z.boolean().optional()
});

export async function getSecrets(req: AuthenticatedRequest, res: Response) {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(401).json({ error: "Unauthorized access" });
    return;
  }

  try {
    const querySnapshot = await adminDb
      .collection("passwords")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const secrets: any[] = [];
    querySnapshot.forEach(doc => {
      secrets.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ success: true, data: secrets });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function createSecret(req: AuthenticatedRequest, res: Response) {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(401).json({ error: "Unauthorized access" });
    return;
  }

  const parsed = secretPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload schemas", details: parsed.error.issues });
    return;
  }

  try {
    const payload = {
      ...parsed.data,
      uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await adminDb.collection("passwords").add(payload);
    res.status(201).json({ success: true, id: docRef.id, data: payload });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateSecret(req: AuthenticatedRequest, res: Response) {
  const uid = req.user?.uid;
  const { id } = req.params;

  if (!uid || !id) {
    res.status(400).json({ error: "Missing identity or reference id" });
    return;
  }

  const docRef = adminDb.collection("passwords").doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists || docSnap.data()?.uid !== uid) {
    res.status(404).json({ error: "Secret entry not found or unauthorized" });
    return;
  }

  const parsed = secretPayloadSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload configuration fields" });
    return;
  }

  try {
    const updatePayload = {
      ...parsed.data,
      updatedAt: new Date().toISOString()
    };

    await docRef.update(updatePayload);
    res.status(200).json({ success: true, updated: updatePayload });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteSecret(req: AuthenticatedRequest, res: Response) {
  const uid = req.user?.uid;
  const { id } = req.params;

  if (!uid || !id) {
    res.status(400).json({ error: "Invalid parameter properties" });
    return;
  }

  const docRef = adminDb.collection("passwords").doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists || docSnap.data()?.uid !== uid) {
    res.status(404).json({ error: "Secret key entry not found" });
    return;
  }

  try {
    await docRef.delete();
    res.status(200).json({ success: true, deletedId: id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
