import { useEffect, useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useVaultState, ViewMode } from "./useVaultState";
import { useVaultTheme, AccentThemeName } from "./useVaultTheme";
import { useAutoLock } from "./useAutoLock";
import { LocalVaultRepository } from "../repositories/LocalVaultRepository";
import { FirebaseVaultRepository } from "../repositories/FirebaseVaultRepository";
import { VaultRepository } from "../repositories/VaultRepository";
import { DecryptedSecret, EncryptedSecretEntry, VaultConfig, ActivityLog } from "../types";
import * as cryptoService from "../services/crypto.service";
import * as cryptoRandom from "../services/cryptoRandom.service";
import * as vaultStorage from "../services/vaultStorage.service";
import * as migrationService from "../services/migration.service";
import * as backupService from "../services/backup.service";

export function mapLegacyCategory(cat: string | undefined | null): string {
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

export function useVault() {
  const { user, language, setLanguage, isSandbox } = useAuth();
  const state = useVaultState();
  const themeHook = useVaultTheme();

  const repository = useMemo<VaultRepository>(() => {
    return isSandbox ? new LocalVaultRepository() : new FirebaseVaultRepository();
  }, [isSandbox]);

  // Extract variables from state to make hooks/effects usage readable
  const {
    showCommandPalette, setShowCommandPalette,
    vaultConfig, setVaultConfig,
    sessionKey, setSessionKey,
    loading, setLoading,
    error, setError,
    successMsg, setSuccessMsg,
    entries, setEntries,
    decryptedEntries, setDecryptedEntries,
    isDecryptingEntries, setIsDecryptingEntries,
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    viewMode, setViewMode,
    recentlyOpenedIds, setRecentlyOpenedIds,
    activityLogs, setActivityLogs,
    autoLockMinutes, setAutoLockMinutes,
    selectedEntryId, setSelectedEntryId,
    isInlineEditing, setIsInlineEditing,
    isFormOpen, setIsFormOpen,
    editingId, setEditingId,
    copiedId, setCopiedId,
    copiedField, setCopiedField,
    visiblePasswords, setVisiblePasswords
  } = state;

  // Auto-lock integration
  const handleLockVault = () => {
    addActivityLog("Locked Vault", "Wyczyszczono klucz sesyjny z pamięci RAM");
    setSessionKey(null);
    setDecryptedEntries([]);
    setSelectedEntryId(null);
    setIsInlineEditing(false);
    setViewMode("dashboard");
    setSuccessMsg("Sejf zablokowany. Usunięto klucze z pamięci RAM.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  useAutoLock({
    autoLockMinutes,
    unlocked: sessionKey !== null,
    onLock: handleLockVault
  });

  // Local state loader: recent items & activity logs & autolock
  useEffect(() => {
    if (user) {
      setRecentlyOpenedIds(vaultStorage.getRecentlyOpened(user.uid));
      setActivityLogs(vaultStorage.getActivityLogs(user.uid));
      setAutoLockMinutes(vaultStorage.getAutoLockMinutes(user.uid));
    }
  }, [user]);

  // Load Vault Config
  useEffect(() => {
    const loadVaultConfig = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const config = await repository.getVaultConfig(user.uid);
        setVaultConfig(config);
      } catch (err) {
        console.error("Error reading vault config:", err);
        setError("Błąd połączenia z bazą danych konfiguracji.");
      } finally {
        setLoading(false);
      }
    };
    loadVaultConfig();
  }, [user, repository]);

  // Real-time subscription to encrypted entries
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsubscribe = repository.subscribeToEntries(
      user.uid,
      (records) => {
        setEntries(records);
        setLoading(false);
      },
      (err) => {
        console.error("Subscription error:", err);
        // Fallback to sandbox if subscription fails and sandbox local state exists
        if (isSandbox) {
          setEntries(vaultStorage.getSandboxEntries());
        }
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user, repository, isSandbox]);

  // Decrypt entries when raw entries or sessionKey change
  useEffect(() => {
    const decryptAllSecrets = async () => {
      if (!sessionKey) {
        setDecryptedEntries([]);
        return;
      }
      setIsDecryptingEntries(true);
      const decrypted: DecryptedSecret[] = [];
      
      for (const entry of entries) {
        if (entry.ciphertext && entry.iv) {
          try {
            const decryptedString = await cryptoService.decryptData(entry.ciphertext, entry.iv, sessionKey);
            const secretPayload = JSON.parse(decryptedString);
            decrypted.push({
              id: entry.id,
              ...secretPayload,
              category: mapLegacyCategory(entry.category),
              isFavorite: !!entry.isFavorite,
              isTrash: !!entry.isTrash,
              createdAt: entry.createdAt,
              updatedAt: entry.updatedAt
            });
          } catch (e) {
            console.error("Failed to decrypt entry ID:", entry.id, e);
            decrypted.push({
              id: entry.id,
              name: `[Zablokowany wpis] ${entry.name || "Kryptogram"}`,
              notes: "Błąd deszyfrowania. Prawdopodobnie niepoprawny klucz główny lub uszkodzone dane.",
              category: mapLegacyCategory(entry.category),
              isFavorite: !!entry.isFavorite,
              isTrash: !!entry.isTrash,
              createdAt: entry.createdAt,
              updatedAt: entry.updatedAt,
              isCorrupted: true
            } as any);
          }
        } else {
          // Legacy plain entry
          decrypted.push({
            id: entry.id,
            name: entry.name || "Legacy Plain Entry",
            username: (entry as any).username || "",
            password: (entry as any).password || "",
            url: (entry as any).url || "",
            notes: (entry as any).notes || "",
            category: mapLegacyCategory(entry.category || "Notes"),
            isFavorite: !!entry.isFavorite,
            isTrash: !!entry.isTrash,
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
            isLegacy: true
          } as any);
        }
      }
      setDecryptedEntries(decrypted);
      setIsDecryptingEntries(false);
    };

    decryptAllSecrets();
  }, [entries, sessionKey]);

  // Log activity helper
  const addActivityLog = (action: string, detail: string) => {
    if (!user) return;
    const newLog: ActivityLog = {
      action,
      detail,
      timestamp: new Date().toISOString()
    };
    
    setActivityLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 15);
      vaultStorage.saveActivityLogs(user.uid, updated);
      return updated;
    });
  };

  // Add secret to recently opened helper
  const addToRecentlyOpened = (id: string) => {
    if (!user) return;
    setRecentlyOpenedIds(prev => {
      const updated = [id, ...prev.filter(item => item !== id)].slice(0, 10);
      vaultStorage.saveRecentlyOpened(user.uid, updated);
      return updated;
    });
  };

  // Initialize secure cryptographic vault
  const handleInitializeVault = async (masterPasswordText: string) => {
    if (!user) return;
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      // 1. Generate salt
      const saltBytes = cryptoRandom.generateRandomBytes(16);
      const saltBase64 = window.btoa(String.fromCharCode(...saltBytes));

      // 2. Derive KEK
      const kek = await cryptoService.deriveKeyEncryptionKey(masterPasswordText, saltBytes);

      // 3. Generate secure random 256-bit Vault Key
      const vaultKeyBytesGenerated = cryptoRandom.generateRandomBytes(32);

      // 4. Encrypt Vault Key with derived KEK
      const encryptedKeyData = await cryptoService.encryptVaultKey(vaultKeyBytesGenerated, kek);

      const newVaultConfig: VaultConfig = {
        salt: saltBase64,
        encryptedVaultKey: encryptedKeyData.ciphertext,
        vaultKeyIv: encryptedKeyData.iv
      };

      // 5. Store inside user's database record
      await repository.saveVaultConfig(user.uid, newVaultConfig);

      // 6. Update states
      setVaultConfig(newVaultConfig);

      // Import Vault key bytes as CryptoKey
      const sessionCryptoKey = await cryptoService.importVaultKey(vaultKeyBytesGenerated);
      setSessionKey(sessionCryptoKey);
      
      setSuccessMsg("Kryptograficzny sejf został zainicjalizowany! Wygenerowano klucz 256-bit.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Vault initialization failed:", err);
      setError("Inicjalizacja nie powiodła się. Sprawdź konsolę pod kątem Web Crypto błędów.");
    } finally {
      setLoading(false);
    }
  };

  // Unlock the vault using the master password
  const handleUnlockVault = async (unlockPasswordText: string) => {
    if (!user || !vaultConfig) return;
    setError(null);
    setLoading(true);

    try {
      const saltBytes = new Uint8Array(
        window.atob(vaultConfig.salt).split("").map((c) => c.charCodeAt(0))
      );

      // Derive KEK
      const kek = await cryptoService.deriveKeyEncryptionKey(unlockPasswordText, saltBytes);

      // Decrypt Vault Key
      const decryptedBytes = await cryptoService.decryptVaultKey(
        vaultConfig.encryptedVaultKey,
        vaultConfig.vaultKeyIv,
        kek
      );

      // Decryption succeeded! Store session key CryptoKey
      const sessionCryptoKey = await cryptoService.importVaultKey(decryptedBytes);
      setSessionKey(sessionCryptoKey);
      
      setViewMode("dashboard");
      
      setTimeout(() => {
        addActivityLog("Unlocked Vault", "Poprawna autoryzacja kluczem głównym KEK");
      }, 100);

      setSuccessMsg("Klucz deszyfrujący poprawny! Sejf został odblokowany.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Decryption failed:", err);
      setError("Niepoprawne hasło główne. Deszyfrowanie odrzucone.");
    } finally {
      setLoading(false);
    }
  };

  // Reset entire database and config if master key is lost
  const handleResetVault = async () => {
    if (!user) return;
    const confirmReset = window.confirm(
      "UWAGA: Ta operacja BEZPOWROTNIE usunie wszystkie Twoje zaszyfrowane klucze deweloperskie i zresetuje konfigurację sejfu. Nie ma możliwości odzyskania danych bez hasła głównego. Czy na pewno chcesz zresetować sejf?"
    );
    if (!confirmReset) return;
    
    const doubleConfirm = window.prompt(
      "Aby potwierdzić usunięcie, wpisz słowo 'RESET' w poniższym polu:"
    );
    if (doubleConfirm !== "RESET") {
      alert("Anulowano. Błędne słowo potwierdzające.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await repository.resetVault(user.uid, entries);

      setVaultConfig(null);
      setSessionKey(null);
      setDecryptedEntries([]);
      setSelectedEntryId(null);
      setIsInlineEditing(false);
      setViewMode("dashboard");
      
      addActivityLog("Reset Vault", "Skasowano dane i zresetowano sejf");
      setSuccessMsg("Twój sejf został pomyślnie zresetowany do stanu początkowego!");
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error("Failed to reset vault:", err);
      setError("Wystąpił błąd podczas resetowania sejfu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mass migrate all legacy plain-text entries to AES-256-GCM
  const handleMigrateAllLegacyEntries = async () => {
    const legacyEntries = decryptedEntries.filter(e => e.isLegacy);
    if (legacyEntries.length === 0) {
      alert("Brak wpisów typu legacy plain-text do zmigrowania.");
      return;
    }
    if (!sessionKey) {
      alert("Klucz sesji niedostępny.");
      return;
    }

    setLoading(true);
    setError(null);
    let successCount = 0;
    try {
      const updates = await migrationService.encryptMultipleLegacyEntries(legacyEntries, sessionKey);
      
      for (const update of updates) {
        const rawEntry = entries.find(e => e.id === update.id);
        if (!rawEntry) continue;
        
        await repository.saveEntry(user.uid, update.id, {
          category: rawEntry.category,
          name: rawEntry.name,
          ciphertext: update.ciphertext,
          iv: update.iv,
          isFavorite: !!rawEntry.isFavorite,
          isTrash: !!rawEntry.isTrash,
          createdAt: rawEntry.createdAt,
          updatedAt: new Date().toISOString()
        });
        successCount++;
      }

      addActivityLog("Mass Migrated Legacy", `Zaszyfrowano ${successCount} wpisów legacy`);
      setSuccessMsg(`Pomyślnie zaszyfrowano i zmigrowano ${successCount} wpisów legacy!`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error("Migration failed:", err);
      setError("Błąd migracji: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save new secret or edit existing
  const handleSaveSecret = async (
    id: string | null,
    name: string,
    category: string,
    unencryptedPayload: Omit<DecryptedSecret, "category">
  ) => {
    if (!user || !sessionKey) return;
    setError(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setError("Nazwa / Tytuł jest wymagany.");
      return;
    }

    try {
      const jsonStr = JSON.stringify({
        ...unencryptedPayload,
        category // Standard standardized category
      });
      const encrypted = await cryptoService.encryptData(jsonStr, sessionKey);

      const dbPayload = {
        category,
        name: name.trim(),
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        isFavorite: false,
        isTrash: false,
        updatedAt: new Date().toISOString()
      };

      const finalId = await repository.saveEntry(user.uid, id, id ? dbPayload : {
        ...dbPayload,
        createdAt: new Date().toISOString()
      });

      if (id) {
        addActivityLog("Updated secret", `${name.trim()} (${category})`);
        setSuccessMsg("Zaktualizowano wpis i zaszyfrowano kluczem 256-bit.");
      } else {
        addActivityLog("Added secret", `${name.trim()} (${category})`);
        setSuccessMsg("Dodano nowy wpis. Dane zostały zaszyfrowane w locie.");
      }

      setIsFormOpen(false);
      setEditingId(null);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Error saving secret:", err);
      setError("Operacja zapisu odrzucona. Spróbuj ponownie.");
    }
  };

  // Import JSON backup
  const handleImportVault = async (jsonData: any[]) => {
    if (!user || !sessionKey) return;
    setLoading(true);
    setError(null);
    try {
      const encryptedList = await backupService.prepareImportedJsonEntries(jsonData, sessionKey);
      let successCount = 0;

      for (const entry of encryptedList) {
        await repository.saveEntry(user.uid, null, entry);
        successCount++;
      }

      addActivityLog("Imported Vault", `Zaimportowano ${successCount} sekretów`);
      setSuccessMsg(`Pomyślnie zaimportowano ${successCount} rekordów!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error(err);
      setError("Nie udało się zaimportować pliku: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = async (id: string, currentVal: boolean) => {
    if (!user) return;
    setError(null);
    try {
      await repository.updateFavoriteStatus(id, !currentVal);
      setSuccessMsg(!currentVal ? "Dodano do ulubionych!" : "Usunięto z ulubionych.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.warn("Toggle favorite failed:", err);
    }
  };

  // Toggle trash status
  const handleMoveToTrash = async (id: string, currentVal: boolean) => {
    if (!user) return;
    setError(null);
    try {
      await repository.updateTrashStatus(id, currentVal);
      setSuccessMsg(currentVal ? "Wpis przeniesiony do kosza." : "Przywrócono wpis z kosza.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.warn("Toggle trash failed:", err);
    }
  };

  // Delete permanently
  const handleDeletePermanently = async (id: string) => {
    if (!window.confirm("Czy na pewno chcesz trwale usunąć ten sekret? Tej operacji nie można cofnąć.")) return;
    setError(null);
    try {
      await repository.deleteEntry(id);
      setSelectedEntryId(null);
      setSuccessMsg("Sekret został trwale usunięty z bazy.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.warn("Delete permanently failed:", err);
    }
  };

  // Single migration trigger
  const handleMigrateLegacyEntry = async (secret: DecryptedSecret) => {
    if (!user || !sessionKey || !secret.id) return;
    setError(null);
    try {
      const encrypted = await migrationService.encryptLegacyEntryPayload(secret, sessionKey);
      const rawEntry = entries.find(e => e.id === secret.id);
      if (!rawEntry) return;

      await repository.saveEntry(user.uid, secret.id, {
        category: rawEntry.category,
        name: rawEntry.name,
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        isFavorite: !!rawEntry.isFavorite,
        isTrash: !!rawEntry.isTrash,
        createdAt: rawEntry.createdAt,
        updatedAt: new Date().toISOString()
      });

      setSuccessMsg(`Zaszyfrowano legacy wpis: ${secret.name}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
      setError("Błąd migracji starego wpisu.");
    }
  };

  // Copy helper
  const handleCopy = (text: string, id: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopiedField(field);

    const secret = decryptedEntries.find(e => e.id === id);
    if (secret) {
      addActivityLog("Copied secret", `${secret.name} (${field})`);
      addToRecentlyOpened(id);
    }

    setTimeout(() => {
      setCopiedId(null);
      setCopiedField(null);
    }, 2000);
  };

  // Custom UI Theme changes proxy
  const handleThemeChange = (themeName: AccentThemeName) => {
    themeHook.changeAccentTheme(themeName, (name) => {
      addActivityLog("Changed Theme", `Przełączono motyw akcentu na ${name}`);
    });
  };

  const handleSetAutoLock = (minutes: number) => {
    if (!user) return;
    setAutoLockMinutes(minutes);
    vaultStorage.saveAutoLockMinutes(user.uid, minutes);
  };

  return {
    // Command palette
    showCommandPalette,
    setShowCommandPalette,

    // Cryptography status
    vaultConfig,
    sessionKey,
    unlocked: sessionKey !== null,
    initialized: vaultConfig !== null,
    isSandbox,
    language,
    setLanguage,

    // Feedback
    loading,
    error,
    setError,
    successMsg,
    setSuccessMsg,

    // Decrypted lists and settings
    decryptedEntries,
    isDecryptingEntries,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode,
    recentlyOpenedIds,
    activityLogs,
    autoLockMinutes,
    setAutoLockMinutes: handleSetAutoLock,
    visiblePasswords,
    setVisiblePasswords,

    // Active inspection selection
    selectedEntryId,
    setSelectedEntryId,
    isInlineEditing,
    setIsInlineEditing,
    isFormOpen,
    setIsFormOpen,
    editingId,
    setEditingId,

    // Copy states
    copiedId,
    copiedField,

    // Themes
    accentTheme: themeHook.accentTheme,
    changeAccentTheme: handleThemeChange,
    theme: themeHook.theme,

    // Actions
    initializeVault: handleInitializeVault,
    unlockVault: handleUnlockVault,
    lockVault: handleLockVault,
    resetVault: handleResetVault,
    saveSecret: handleSaveSecret,
    deleteSecretPermanently: handleDeletePermanently,
    toggleFavorite: handleToggleFavorite,
    moveToTrash: handleMoveToTrash,
    migrateLegacyEntry: handleMigrateLegacyEntry,
    migrateAllLegacyEntries: handleMigrateAllLegacyEntries,
    importVault: handleImportVault,
    copyText: handleCopy,
    addActivityLog
  };
}

export type UseVaultReturn = ReturnType<typeof useVault>;
