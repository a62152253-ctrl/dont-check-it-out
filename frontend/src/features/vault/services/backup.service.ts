import type {  EncryptedSecretEntry, DecryptedSecret  } from "../types";
import { encryptData } from "./crypto.service";

/**
 * Standardizes legacy categories from imported backup files
 */
function mapImportedCategory(cat: string | undefined | null): string {
  if (!cat) return "Notes";
  const c = cat.trim();
  if (c === "AWS Credentials" || c === "AWS") return "AWS";
  if (c === "Database Connection" || c === "Database") return "Database";
  if (c === "SSH Key" || c === "SSH Keys") return "SSH Keys";
  if (c === "Dotenv / Config" || c === "API Keys") return "API Keys";
  if (c === "Web Login" || c === "Websites") return "Websites";
  if (c === "Inne" || c === "Notes") return "Notes";
  return c;
}

/**
 * Parses and encrypts raw JSON backup data, returning list of entries ready for persistence
 */
export async function prepareImportedJsonEntries(
  data: any[],
  sessionKey: CryptoKey
): Promise<Omit<EncryptedSecretEntry, "uid">[]> {
  if (!Array.isArray(data)) {
    throw new Error("Dane importu muszą być tablicą JSON.");
  }

  const encryptedEntries: Omit<EncryptedSecretEntry, "uid">[] = [];

  for (const item of data) {
    if (!item.name) continue;

    const cat = mapImportedCategory(item.category);
    const developerFields: any = {};

    if (cat === "AWS") {
      developerFields.awsAccessKeyId = item.awsAccessKeyId || "";
      developerFields.awsSecretAccessKey = item.awsSecretAccessKey || item.password || "";
      developerFields.region = item.region || "us-east-1";
    } else if (cat === "Database") {
      developerFields.dbEngine = item.dbEngine || "PostgreSQL";
      developerFields.dbHost = item.dbHost || "localhost";
      developerFields.dbPort = item.dbPort || "5432";
      developerFields.dbUser = item.dbUser || "";
      developerFields.dbPassword = item.dbPassword || item.password || "";
      developerFields.dbName = item.dbName || "";
    } else if (cat === "SSH Keys") {
      developerFields.sshHost = item.sshHost || "";
      developerFields.sshPrivateKey = item.sshPrivateKey || "";
      developerFields.sshPassphrase = item.sshPassphrase || "";
    } else if (cat === "API Keys") {
      developerFields.dotenvContent = item.dotenvContent || item.password || "";
    }

    const unencryptedPayload: DecryptedSecret = {
      name: item.name.trim(),
      username: item.username?.trim() || undefined,
      password: item.password || undefined,
      url: item.url?.trim() || undefined,
      notes: item.notes?.trim() || undefined,
      project: item.project?.trim() || undefined,
      environment: item.environment || "development",
      category: cat,
      developerFields: Object.keys(developerFields).length > 0 ? developerFields : undefined
    };

    const jsonStr = JSON.stringify(unencryptedPayload);
    const encrypted = await encryptData(jsonStr, sessionKey);

    // Save as standard DB categories compatible with historical database
    let dbCategory = cat;
    if (cat === "AWS") dbCategory = "AWS Credentials";
    else if (cat === "Database") dbCategory = "Database Connection";
    else if (cat === "SSH Keys") dbCategory = "SSH Key";
    else if (cat === "API Keys") dbCategory = "Dotenv / Config";
    else if (cat === "Websites") dbCategory = "Web Login";

    encryptedEntries.push({
      category: dbCategory,
      name: item.name.trim(),
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      isFavorite: !!item.isFavorite,
      isTrash: false,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
  }

  return encryptedEntries;
}

/**
 * Downloads decrypted entries list as a formatted JSON file
 */
export function triggerBackupDownload(decryptedEntries: DecryptedSecret[]): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(decryptedEntries, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `developer-vault-backup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
