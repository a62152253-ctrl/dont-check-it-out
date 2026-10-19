import React, { useState } from "react";
import { Lock, Shield, AlertCircle } from "lucide-react";
import { translations } from "../../../lib/translations";

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

      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner">
          <Lock className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-xl font-display font-semibold text-white tracking-tight">{t.unlockVaultTitle}</h2>
        <p className="text-xs text-slate-400 font-sans px-4">
          {t.unlockVaultDesc}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <label className="text-[10px] font-mono uppercase text-emerald-500/80 tracking-wider font-bold">{t.masterPassLabel}</label>
            <span className="text-[9px] font-mono text-slate-600">AES-GCM-256</span>
          </div>
          <input
            type="password"
            value={unlockPassword}
            onChange={(e) => setUnlockPassword(e.target.value)}
            placeholder={t.unlockPassPlaceholder}
            required
            className="w-full bg-[#121212]/80 border border-white/5 hover:border-white/10 focus:border-emerald-500/40 rounded-xl p-3 text-xs text-white outline-none font-mono transition-all duration-200 focus:bg-[#121212] focus:ring-1 focus:ring-emerald-500/20"
          />
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/20 border border-rose-900/30 text-rose-300 rounded-xl text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-mono text-[10px] leading-relaxed">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/10  flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] duration-150"
        >
          {loading ? (
            <>
              <div className="animate-spin h-3.5 w-3.5 border-2 border-black border-t-transparent rounded-full" />
              <span>{t.unlockingVault}</span>
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 stroke-[2.5]" />
              <span>{t.unlockVaultBtn}</span>
            </>
          )}
        </button>
      </form>

      <div className="border-t border-white/5 pt-4 text-center space-y-3">
        <p className="text-[9px] font-mono text-slate-600 leading-normal px-2">
          {language === "PL" 
            ? "Wskazówka Demo: Jeśli to Twoje pierwsze uruchomienie, użyj hasła utworzonego w kroku inicjalizacji." 
            : "Demo Hint: If this is your first load, use the master password you created during initialization."}
        </p>
        <div className="pt-1">
          <button
            type="button"
            onClick={onReset}
            className="text-[10px] font-mono text-rose-400 hover:text-rose-300 underline  transition-colors"
          >
            {t.resetLostVault}
          </button>
        </div>
      </div>
    </div>
  );
}
export default VaultUnlock;
