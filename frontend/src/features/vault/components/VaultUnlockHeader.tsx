import React from "react";
import { Lock } from "lucide-react";
import { translations } from "../../../lib/translations";

interface VaultUnlockHeaderProps {
  language: "PL" | "EN";
}

export function VaultUnlockHeader({ language }: VaultUnlockHeaderProps) {
  const t = translations[language];
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner">
        <Lock className="w-6 h-6 animate-pulse" />
      </div>
      <h2 className="text-xl font-display font-semibold text-white tracking-tight">{t.unlockVaultTitle}</h2>
      <p className="text-xs text-slate-400 font-sans px-4">
        {t.unlockVaultDesc}
      </p>
    </div>
  );
}
export default VaultUnlockHeader;
