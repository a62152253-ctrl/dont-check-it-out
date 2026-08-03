import { useState } from "react";
import type {  DecryptedSecret, EncryptedSecretEntry, VaultConfig, ActivityLog  } from "../types";

export type ViewMode = "dashboard" | "all" | "favorites" | "trash" | "security" | "settings" | "activity" | "generator";

export function useVaultState() {
  // Vault configuration & cryptographic keys
  const [vaultConfig, setVaultConfig] = useState<VaultConfig | null>(null);
  const [sessionKey, setSessionKey] = useState<CryptoKey | null>(null);
  
  // Feedback states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Raw database records (encrypted formats) and decrypted in-memory copies
  const [entries, setEntries] = useState<EncryptedSecretEntry[]>([]);
  const [decryptedEntries, setDecryptedEntries] = useState<DecryptedSecret[]>([]);
  const [isDecryptingEntries, setIsDecryptingEntries] = useState<boolean>(false);

  // Interface view & filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [recentlyOpenedIds, setRecentlyOpenedIds] = useState<string[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [autoLockMinutes, setAutoLockMinutes] = useState<number>(10);

  // Active details & inline edit selection states
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [isInlineEditing, setIsInlineEditing] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Copy status feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Visibility map
  // Visibility map
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  
  // Command palette state
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);

  return {
    showCommandPalette,
    setShowCommandPalette,
    vaultConfig,
    setVaultConfig,
    sessionKey,
    setSessionKey,
    loading,
    setLoading,
    error,
    setError,
    successMsg,
    setSuccessMsg,
    entries,
    setEntries,
    decryptedEntries,
    setDecryptedEntries,
    isDecryptingEntries,
    setIsDecryptingEntries,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode,
    recentlyOpenedIds,
    setRecentlyOpenedIds,
    activityLogs,
    setActivityLogs,
    autoLockMinutes,
    setAutoLockMinutes,
    selectedEntryId,
    setSelectedEntryId,
    isInlineEditing,
    setIsInlineEditing,
    isFormOpen,
    setIsFormOpen,
    editingId,
    setEditingId,
    copiedId,
    setCopiedId,
    copiedField,
    setCopiedField,
    visiblePasswords,
    setVisiblePasswords
  };
}
export type UseVaultStateReturn = ReturnType<typeof useVaultState>;
