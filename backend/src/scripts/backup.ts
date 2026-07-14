import { adminDb } from "../config/firebase.js";
import * as fs from "fs";
import * as path from "path";

export async function backupDatabase(uid: string, targetPath: string) {
  console.log(`[Backup] Starting data vault download for user: ${uid}...`);

  const snapshot = await adminDb
    .collection("passwords")
    .where("uid", "==", uid)
    .get();

  const records: any[] = [];
  snapshot.forEach(doc => {
    records.push({ id: doc.id, ...doc.data() });
  });

  const output = {
    exportedAt: new Date().toISOString(),
    owner: uid,
    secretsCount: records.length,
    secrets: records
  };

  const fullPath = path.resolve(targetPath);
  fs.writeFileSync(fullPath, JSON.stringify(output, null, 2), "utf8");
  console.log(`[Backup] Backup completed successfully. Saved to: ${fullPath}`);
}

// Automatically invoke if run directly with args
if (process.argv[1]?.endsWith("backup.ts")) {
  const uidArg = process.argv[2] || "system_seeder_prod";
  const pathArg = process.argv[3] || "./ciphervault-db-backup.json";
  backupDatabase(uidArg, pathArg).catch(console.error);
}
