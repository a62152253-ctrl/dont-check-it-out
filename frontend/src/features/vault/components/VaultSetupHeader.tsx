import React from "react";
import { Shield } from "lucide-react";
import { translations } from "../../../lib/translations";

interface VaultSetupHeaderProps {
  language: "PL" | "EN";
}

export function VaultSetupHeader({ language }: VaultSetupHeaderProps) {
  const t = translations[language];
  return (
    <div className="flex flex-col items-center text-center space-y-3">
      <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner">
        <Shield className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h2 className="text-xl font-display font-semibold text-white tracking-tight">{t.setupVaultTitle}</h2>
      <p className="text-xs text-slate-400 max-w-md font-sans">
        {t.setupVaultDesc}
      </p>
    </div>
  );
}
export default VaultSetupHeader;
