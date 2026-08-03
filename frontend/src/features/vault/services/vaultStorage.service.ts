import type {  VaultConfig, ActivityLog  } from "../types";

export function getVaultConfig(uid: string): VaultConfig | null {
  const localCfg = localStorage.getItem(`vault_config_${uid}`);
  if (!localCfg) return null;
  try {
    return JSON.parse(localCfg) as VaultConfig;
  } catch (e) {
    console.warn("Failed to parse local vault config:", e);
    return null;
  }
}

export function saveVaultConfig(uid: string, config: VaultConfig): void {
  localStorage.setItem(`vault_config_${uid}`, JSON.stringify(config));
}

export function clearVaultConfig(uid: string): void {
  localStorage.removeItem(`vault_config_${uid}`);
}

export function getAccentTheme(): string {
  return localStorage.getItem("vault_accent_theme") || "emerald";
}

export function saveAccentTheme(theme: string): void {
  localStorage.setItem("vault_accent_theme", theme);
}

export function getRecentlyOpened(uid: string): string[] {
  const value = localStorage.getItem(`recently_opened_${uid}`);
  if (!value) return [];
  try {
    return JSON.parse(value) as string[];
  } catch (e) {
    return [];
  }
}

export function saveRecentlyOpened(uid: string, ids: string[]): void {
  localStorage.setItem(`recently_opened_${uid}`, JSON.stringify(ids));
}

export function getActivityLogs(uid: string): ActivityLog[] {
  const value = localStorage.getItem(`vault_activity_${uid}`);
  if (!value) {
    return [
      { 
        action: "Created Vault", 
        detail: "Inicjalizacja sejfu PBKDF2-SHA256", 
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() 
      }
    ];
  }
  try {
    return JSON.parse(value) as ActivityLog[];
  } catch (e) {
    return [];
  }
}

export function saveActivityLogs(uid: string, logs: ActivityLog[]): void {
  localStorage.setItem(`vault_activity_${uid}`, JSON.stringify(logs));
}

export function getSandboxEntries(): any[] {
  const value = localStorage.getItem("vault_sandbox_entries");
  if (!value) return [];
  try {
    return JSON.parse(value) as any[];
  } catch (e) {
    return [];
  }
}

export function saveSandboxEntries(entries: any[]): void {
  localStorage.setItem("vault_sandbox_entries", JSON.stringify(entries));
}

export function clearSandboxEntries(): void {
  localStorage.removeItem("vault_sandbox_entries");
}

export function getAutoLockMinutes(uid: string): number {
  const value = localStorage.getItem(`vault_autolock_${uid}`);
  return value ? parseInt(value, 10) : 10;
}

export function saveAutoLockMinutes(uid: string, minutes: number): void {
  localStorage.setItem(`vault_autolock_${uid}`, String(minutes));
}
