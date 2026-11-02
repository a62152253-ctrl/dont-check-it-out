import { DeveloperFields } from "shared";
export type { DeveloperFields };

export type SecretType = 
  | "AWS"
  | "Database"
  | "SSH Keys"
  | "API Keys"
  | "Websites"
  | "Emails"
  | "Notes"
  | "Servers";

export interface DecryptedSecret {
  id?: string;
  name: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  project?: string;
  environment?: string; // production, staging, development, local
  developerFields?: DeveloperFields;
  category: string; // The standard group name (e.g. "AWS", "Database", etc.)
  isFavorite?: boolean;
  isTrash?: boolean;
  isLegacy?: boolean;
  isCorrupted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EncryptedSecretEntry {
  id?: string;
  uid: string;
  category: string; // The database category (e.g. "AWS Credentials", "Database Connection", etc.)
  name: string;
  ciphertext: string;
  iv: string;
  isFavorite?: boolean;
  isTrash?: boolean;
  createdAt: string;
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
