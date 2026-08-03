import { VaultRepository } from "./VaultRepository";
import type {  EncryptedSecretEntry, VaultConfig  } from "../types";
import * as vaultStorage from "../services/vaultStorage.service";

export class LocalVaultRepository implements VaultRepository {
  subscribeToEntries(
    uid: string,
    onUpdate: (entries: EncryptedSecretEntry[]) => void,
    onError: (err: Error) => void
  ): () => void {
    try {
      // Return sandbox entries immediately
      const entries = vaultStorage.getSandboxEntries();
      onUpdate(entries);
    } catch (e) {
      onError(e instanceof Error ? e : new Error(String(e)));
    }

    // Set up a simple storage listener to update state if another tab changes sandbox entries
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "vault_sandbox_entries") {
        try {
          const entries = vaultStorage.getSandboxEntries();
          onUpdate(entries);
        } catch (err) {
          onError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }

  async saveEntry(
    uid: string,
    id: string | null,
    entry: Omit<EncryptedSecretEntry, "id" | "uid">
  ): Promise<string> {
    const entries = vaultStorage.getSandboxEntries();
    const finalId = id || `entry_${Math.random().toString(36).substring(2, 11)}`;
    const newEntry: EncryptedSecretEntry = {
      id: finalId,
      uid,
      ...entry
    };

    if (id) {
      const idx = entries.findIndex(e => e.id === id);
      if (idx !== -1) {
        entries[idx] = newEntry;
      } else {
        entries.push(newEntry);
      }
    } else {
      entries.unshift(newEntry);
    }

    vaultStorage.saveSandboxEntries(entries);
    return finalId;
  }

  async deleteEntry(id: string): Promise<void> {
    const entries = vaultStorage.getSandboxEntries();
    const filtered = entries.filter(e => e.id !== id);
    vaultStorage.saveSandboxEntries(filtered);
  }

  async updateFavoriteStatus(id: string, isFavorite: boolean): Promise<void> {
    const entries = vaultStorage.getSandboxEntries();
    const idx = entries.findIndex(e => e.id === id);
    if (idx !== -1) {
      entries[idx].isFavorite = isFavorite;
      entries[idx].updatedAt = new Date().toISOString();
      vaultStorage.saveSandboxEntries(entries);
    }
  }

  async updateTrashStatus(id: string, isTrash: boolean): Promise<void> {
    const entries = vaultStorage.getSandboxEntries();
    const idx = entries.findIndex(e => e.id === id);
    if (idx !== -1) {
      entries[idx].isTrash = isTrash;
      entries[idx].updatedAt = new Date().toISOString();
      vaultStorage.saveSandboxEntries(entries);
    }
  }

  async getVaultConfig(uid: string): Promise<VaultConfig | null> {
    return vaultStorage.getVaultConfig(uid);
  }

  async saveVaultConfig(uid: string, config: VaultConfig | null): Promise<void> {
    if (config) {
      vaultStorage.saveVaultConfig(uid, config);
    } else {
      vaultStorage.clearVaultConfig(uid);
    }
  }

  async resetVault(uid: string, entries: EncryptedSecretEntry[]): Promise<void> {
    vaultStorage.clearSandboxEntries();
    vaultStorage.clearVaultConfig(uid);
  }
}
