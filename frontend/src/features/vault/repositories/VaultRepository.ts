import { EncryptedSecretEntry, VaultConfig } from "../types";

export interface VaultRepository {
  subscribeToEntries(
    uid: string,
    onUpdate: (entries: EncryptedSecretEntry[]) => void,
    onError: (err: Error) => void
  ): () => void;

  saveEntry(
    uid: string, 
    id: string | null, 
    entry: Omit<EncryptedSecretEntry, "id" | "uid">
  ): Promise<string>;
  
  deleteEntry(id: string): Promise<void>;
  
  updateFavoriteStatus(id: string, isFavorite: boolean): Promise<void>;
  
  updateTrashStatus(id: string, isTrash: boolean): Promise<void>;

  getVaultConfig(uid: string): Promise<VaultConfig | null>;

  saveVaultConfig(uid: string, config: VaultConfig | null): Promise<void>;

  resetVault(uid: string, entries: EncryptedSecretEntry[]): Promise<void>;
}
