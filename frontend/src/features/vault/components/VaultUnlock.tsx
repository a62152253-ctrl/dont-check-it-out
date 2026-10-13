import React, { useState } from "react";
import { translations } from "../../../lib/translations";
import { VaultUnlockHeader } from "./VaultUnlockComponents/VaultUnlockHeader";
import { VaultUnlockInput } from "./VaultUnlockComponents/VaultUnlockInput";
import { VaultUnlockError } from "./VaultUnlockComponents/VaultUnlockError";
import { VaultUnlockButton } from "./VaultUnlockComponents/VaultUnlockButton";
import { VaultUnlockFooter } from "./VaultUnlockComponents/VaultUnlockFooter";

interface VaultUnlockProps {
  onUnlock: (password: string) => Promise<void>;
  onReset: () => Promise<void>;
  error: string | null;
  loading: boolean;
  language: "PL" | "EN";
}

export function VaultUnlock({ onUnlock, onReset, error, loading, language }: VaultUnlockProps) {
  const t = translations[language];
  const [unlockPassword, setUnlockPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUnlock(unlockPassword);
    setUnlockPassword("");
  };

  return (
    <div className="max-w-md mx-auto bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl relative my-16 overflow-hidden cyber-scanner">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <VaultUnlockHeader title={t.unlockVaultTitle} desc={t.unlockVaultDesc} />

      <form onSubmit={handleSubmit} className="space-y-5">
        <VaultUnlockInput value={unlockPassword} onChange={setUnlockPassword} label={t.masterPassLabel} placeholder={t.unlockPassPlaceholder} />
        {error && <VaultUnlockError error={error} />}
        <VaultUnlockButton loading={loading} unlockText={t.unlockVaultBtn} unlockingText={t.unlockingVault} />
      </form>

      <VaultUnlockFooter language={language} onReset={onReset} resetText={t.resetLostVault} />
    </div>
  );
}
export default VaultUnlock;
