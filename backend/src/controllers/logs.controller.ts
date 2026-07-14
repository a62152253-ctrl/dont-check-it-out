import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { adminDb } from "../config/firebase.js";

export async function getAuditLogs(req: AuthenticatedRequest, res: Response) {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(401).json({ error: "Unauthorized access" });
    return;
  }

  try {
    const logsSnap = await adminDb
      .collection("audit_logs")
      .where("uid", "==", uid)
      .orderBy("timestamp", "desc")
      .limit(50)
      .get();

    const logs: any[] = [];
    logsSnap.forEach(doc => {
      logs.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ success: true, logs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function postAuditLog(req: AuthenticatedRequest, res: Response) {
  const uid = req.user?.uid;
  const { action, detail } = req.body;

  if (!uid || !action || !detail) {
    res.status(400).json({ error: "Missing required parameter configuration properties" });
    return;
  }

  try {
    const auditRecord = {
      uid,
      action,
      detail,
      timestamp: new Date().toISOString()
    };

    const docRef = await adminDb.collection("audit_logs").add(auditRecord);
    res.status(201).json({ success: true, id: docRef.id, log: auditRecord });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
