import type { DeveloperFields, DecryptedSecret } from "shared";

export type SecretType = 
  | "AWS"
  | "Database"
  | "SSH Keys"
  | "API Keys"
  | "Websites"
  | "Emails"
  | "Notes"
  | "Servers";

// DecryptedSecret is now imported from shared

export interface EncryptedSecretEntry {
  id?: string;
  uid: string;
  category: string; // The database category (e.g. "AWS Credentials", "Database Connection", etc.)
  name: string;
  ciphertext: string;
  iv: string;
  isFavorite?: boolean;
  isTrash?: boolean;
  createdAt?: string;
  updatedAt: string;
}

export interface VaultConfig {
  salt: string; // base64
  encryptedVaultKey: string; // base64
  vaultKeyIv: string; // base64;
}

export interface ActivityLog {
  action: string;
  detail: string;
  timestamp: string;
}
