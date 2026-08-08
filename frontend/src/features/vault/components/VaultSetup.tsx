import React, { useState, useMemo } from "react";
import { Shield, Key, AlertCircle, Info } from "lucide-react";
import { translations } from "../../../lib/translations";
import { getPasswordStrength } from "../utils/passwordStrength";

interface VaultSetupProps {
  onInitialize: (password: string) => Promise<void>;
  error: string | null;
  loading: boolean;
  language: "PL" | "EN";
}

export function VaultSetup({ onInitialize, error, loading, language }: VaultSetupProps) {
  const t = translations[language];

  const [masterPassword, setMasterPassword] = useState("");
  const [masterPasswordConfirm, setMasterPasswordConfirm] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [showConfigHint, setShowConfigHint] = useState(true);

  const masterPasswordStrength = useMemo(() => {
    return getPasswordStrength(masterPassword);
  }, [masterPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (masterPassword.length < 8) {
      setLocalError(language === "PL" ? "Hasło główne musi mieć co najmniej 8 znaków." : "Master password must be at least 8 characters.");
      return;
    }
    if (masterPassword !== masterPasswordConfirm) {
      setLocalError(language === "PL" ? "Hasła główne nie zgadzają się." : "Master passwords do not match.");
      return;
    }

    await onInitialize(masterPassword);
  };

  const activeError = localError || error;

  return (
    <div className="max-w-xl mx-auto bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden my-8 cyber-scanner">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner">
          <Shield className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-display font-semibold text-white tracking-tight">{t.setupVaultTitle}</h2>
        <p className="text-xs text-slate-400 max-w-md font-sans">
          {t.setupVaultDesc}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 px-0.5 tracking-wider font-semibold">{t.masterPassLabel}</label>
          <input
            type="password"
            value={masterPassword}
            onChange={(e) => setMasterPassword(e.target.value)}
            placeholder={t.masterPassPlaceholder}
            required
            className="w-full bg-[#121212]/80 border border-white/5 hover:border-white/10 focus:border-emerald-500/40 rounded-xl p-3 text-xs text-white outline-none font-mono transition-all duration-200 focus:bg-[#121212] focus:ring-1 focus:ring-emerald-500/20"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1.5 px-0.5 tracking-wider font-semibold">{t.masterPassConfirmLabel}</label>
          <input
            type="password"
            value={masterPasswordConfirm}
            onChange={(e) => setMasterPasswordConfirm(e.target.value)}
            placeholder={t.masterPassConfirmPlaceholder}
            required
            className="w-full bg-[#121212]/80 border border-white/5 hover:border-white/10 focus:border-emerald-500/40 rounded-xl p-3 text-xs text-white outline-none font-mono transition-all duration-200 focus:bg-[#121212] focus:ring-1 focus:ring-emerald-500/20"
          />
        </div>

        {masterPassword && (
          <div className="bg-[#121212]/50 border border-white/5 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                {language === "PL" ? "Siła hasła głównego:" : "Master password strength:"}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${masterPasswordStrength.color}`}>
                {masterPasswordStrength.label}
              </span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  masterPasswordStrength.score <= 2 ? "bg-rose-500" : masterPasswordStrength.score <= 4 ? "bg-amber-500" : "bg-emerald-500"
                }`} 
                style={{ width: `${(masterPasswordStrength.score / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {activeError && (
          <div className="p-3.5 bg-rose-950/20 border border-rose-900/30 text-rose-300 rounded-xl text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-mono text-[10px]">{activeError}</span>
          </div>
        )}

        <button
     type="submit"
     disabled={loading}
     className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-emerald-950/40 disabled:to-emerald-950/40 text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] duration-150"
    >
          {loading ? (
            <>
              <div className="animate-spin h-3.5 w-3.5 border-2 border-black border-t-transparent rounded-full" />
              <span>{t.initializingVault}</span>
            </>
          ) : (
            <>
              <Key className="w-4 h-4 stroke-[2.5]" />
              <span>{t.initVaultBtn}</span>
            </>
          )}
        </button>
      </form>

      <div className="border-t border-white/5 pt-4">
        <button 
     type="button"
     onClick={() => setShowConfigHint(!showConfigHint)}
          className="text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showConfigHint ? "Ukryj szczegóły architektury" : "Pokaż szczegóły architektury"}</span>
        </button>

        {showConfigHint && (
          <p className="text-[10px] font-mono text-slate-500 mt-2.5 leading-relaxed bg-[#121212]/30 p-3 rounded-lg border border-white/5">
            * Generujemy unikalną sól 128-bitową. <br/>
            * Przeiterujemy hasło 100 000 razy za pomocą PBKDF2-HMAC-SHA256, aby uzyskać KEK (Key Encryption Key). <br/>
            * Tworzymy losowy 256-bitowy Vault Key, który szyfrujemy KEK za pomocą AES-GCM. <br/>
            * Ten zaszyfrowany blob synchronizujemy z Firebase, abyś miał dostęp na innych urządzeniach bez ryzyka wycieku hasła.
          </p>
        )}
      </div>
    </div>
  );
}
export default VaultSetup;
