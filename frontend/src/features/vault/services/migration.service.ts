import { DecryptedSecret, EncryptedSecretEntry } from "../types";
import { encryptData } from "./crypto.service";

/**
 * Encrypts legacy plain-text entry data and prepares it for repository updates.
 */
export async function encryptLegacyEntryPayload(
  secret: DecryptedSecret,
  sessionKey: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  // Construct a clean credentials payload similar to standard additions
  const cleanData = {
    name: secret.name,
    username: secret.username || undefined,
    password: secret.password || undefined,
    url: secret.url || undefined,
    notes: secret.notes || undefined,
    project: secret.project || undefined,
    environment: secret.environment || "development",
    developerFields: secret.developerFields || undefined
  };

  const jsonStr = JSON.stringify(cleanData);
  return encryptData(jsonStr, sessionKey);
}

/**
 * Symmetrically encrypts a list of legacy entries and returns update payloads.
 */
export async function encryptMultipleLegacyEntries(
  legacyEntries: DecryptedSecret[],
  sessionKey: CryptoKey
): Promise<{ id: string; ciphertext: string; iv: string }[]> {
  const updates: { id: string; ciphertext: string; iv: string }[] = [];
  
  for (const entry of legacyEntries) {
    if (!entry.id) continue;
    const encrypted = await encryptLegacyEntryPayload(entry, sessionKey);
    updates.push({
      id: entry.id,
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv
    });
  }

  return updates;
}
