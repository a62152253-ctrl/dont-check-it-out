import React, { useState, useEffect, useMemo } from "react";
import { Key, Copy, Sparkles } from "lucide-react";
import { useVaultContext } from "../../context/useVaultContext";
import { generateSecurePassword } from "../../utils/generators";
import { getEntropyDetails } from "../../utils/passwordStrength";

export function PasswordGenerator() {
  const { theme, language, setSuccessMsg } = useVaultContext();

  const [genPreset, setGenPreset] = useState<"API_KEY" | "PASSWORD" | "PASSPHRASE" | "TOKEN">("PASSWORD");
  const [genLength, setGenLength] = useState(32);
  const [genUppercase, setGenUppercase] = useState(true);
  const [genLowercase, setGenLowercase] = useState(true);
  const [genNumbers, setGenNumbers] = useState(true);
  const [genSymbols, setGenSymbols] = useState(true);
  const [genExcludeAmbiguous, setGenExcludeAmbiguous] = useState(false);
  const [genPassphraseWords, setGenPassphraseWords] = useState(4);
  const [genPassphraseSeparator, setGenPassphraseSeparator] = useState("-");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const handleGenerate = () => {
    const val = generateSecurePassword(
      genPreset,
      genLength,
      genUppercase,
      genLowercase,
      genNumbers,
      genSymbols,
      genExcludeAmbiguous,
      genPassphraseWords,
      genPassphraseSeparator
    );
    setGeneratedPassword(val);
  };

  useEffect(() => {
    handleGenerate();
  }, [
    genPreset, genLength, genUppercase, genLowercase, genNumbers, 
    genSymbols, genExcludeAmbiguous, genPassphraseWords, genPassphraseSeparator
  ]);

  const entropyDetails = useMemo(() => {
    return getEntropyDetails(
      genPreset === "PASSPHRASE" ? "PASSPHRASE" : genPreset,
      genLength,
      genUppercase,
      genLowercase,
      genNumbers,
      genSymbols,
      genExcludeAmbiguous,
      genPassphraseWords
    );
  }, [genPreset, genLength, genUppercase, genLowercase, genNumbers, genSymbols, genExcludeAmbiguous, genPassphraseWords]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setSuccessMsg(language === "PL" ? "Skopiowano do schowka!" : "Copied to clipboard!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="bg-[#0c0c0c]/90 border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.02)]">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
      
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold uppercase text-slate-300 font-mono tracking-wider">
            {language === "PL" ? "Inteligentny Generator" : "Smart Key Generator"}
          </h4>
        </div>
        <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 font-semibold uppercase">
          AES-GCM Compliant
        </span>
      </div>

      <div className="space-y-4">
        {/* Result Box */}
        <div className="bg-[#121212]/80 border border-white/5 rounded-xl p-4.5 text-center relative group min-h-[90px] flex flex-col justify-center shadow-inner overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none" />
          <span className="block text-[9px] font-mono text-emerald-500/60 uppercase tracking-widest mb-1.5 font-bold">
            {language === "PL" ? "Wygenerowany Klucz / Hasło" : "Generated Key / Secret"}
          </span>
          <p className="text-xs md:text-sm font-mono text-emerald-400 break-all select-all font-bold px-8 leading-relaxed glow-emerald">
            {generatedPassword}
          </p>
          <button type="button"
            onClick={handleCopy}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white bg-white/5 p-2 rounded-lg border border-white/5 transition-all hover:bg-white/10 active:scale-95 cursor-pointer"
            title={language === "PL" ? "Kopiuj" : "Copy"}
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Preset Selector tabs */}
        <div className="space-y-2">
          <span className="block text-[10px] font-mono text-slate-400 uppercase font-semibold">
            {language === "PL" ? "Wybierz Typ (Preset):" : "Select Preset Type:"}
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
            {(["PASSWORD", "PASSPHRASE", "API_KEY", "TOKEN"] as const).map((pr) => (
              <button type="button"
                key={pr}
                onClick={() => {
                  setGenPreset(pr);
                  if (pr === "API_KEY") setGenLength(24);
                  else if (pr === "TOKEN") setGenLength(16);
                  else if (pr === "PASSWORD") setGenLength(32);
                }}
                className={`text-[10px] font-mono py-2 rounded-lg border transition-all cursor-pointer text-center tracking-tight ${
                  genPreset === pr
                    ? `bg-emerald-500/20 text-white border-emerald-500/50 font-bold`
                    : "bg-white/5 text-slate-400 border-transparent hover:text-white"
                }`}
              >
                {pr === "PASSPHRASE" ? (language === "PL" ? "Fraza" : "Phrase") : pr.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Settings based on preset */}
        {genPreset === "PASSPHRASE" ? (
          <div className="space-y-4 p-3.5 bg-white/[0.02] border border-white/5 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>{language === "PL" ? "Liczba słów:" : "Word count:"}</span>
                <span className={`${theme.text} font-bold`}>{genPassphraseWords} słów</span>
              </div>
              <input
                type="range"
                min="3"
                max="8"
                value={genPassphraseWords}
                onChange={(e) => setGenPassphraseWords(parseInt(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-slate-400 uppercase">
                {language === "PL" ? "Separator słów:" : "Word separator:"}
              </label>
              <input
                type="text"
                maxLength={3}
                value={genPassphraseSeparator}
                onChange={(e) => setGenPassphraseSeparator(e.target.value)}
                className="w-full bg-[#121212] border border-white/5 rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-white/20"
                placeholder="np. -"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-3.5 bg-white/[0.02] border border-white/5 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>{language === "PL" ? "Długość klucza:" : "Key length:"}</span>
                <span className={`${theme.text} font-bold`}>{genLength} znaków</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={genLength}
                onChange={(e) => setGenLength(parseInt(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Checkboxes */}
            {genPreset === "PASSWORD" && (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={genUppercase}
                    onChange={(e) => setGenUppercase(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>A-Z (Uppercase)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={genLowercase}
                    onChange={(e) => setGenLowercase(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>a-z (Lowercase)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={genNumbers}
                    onChange={(e) => setGenNumbers(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>0-9 (Numbers)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={genSymbols}
                    onChange={(e) => setGenSymbols(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>!@#$ (Symbols)</span>
                </label>
              </div>
            )}

            {/* Exclude ambiguous option */}
            <label className="flex items-center gap-2 text-[10px] font-mono text-slate-400 cursor-pointer select-none pt-1 border-t border-white/5">
              <input
                type="checkbox"
                checked={genExcludeAmbiguous}
                onChange={(e) => setGenExcludeAmbiguous(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span>{language === "PL" ? "Wyklucz podobne znaki (1, l, 0, O)" : "Exclude ambiguous characters (1, l, 0, O)"}</span>
            </label>
          </div>
        )}

        {/* Real-time Entropy Estimator Card */}
        <div className="bg-[#121212] border border-white/5 rounded-lg p-3.5 space-y-2.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-500">{language === "PL" ? "Entropia Hasła:" : "Key Entropy:"}</span>
            <span className={`${entropyDetails.color} font-bold`}>{entropyDetails.bits} bits</span>
          </div>
          
          {/* Entropy Bar */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                entropyDetails.bits >= 100 ? "bg-violet-500" :
                entropyDetails.bits >= 75 ? "bg-emerald-500" :
                entropyDetails.bits >= 50 ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${Math.min(100, (entropyDetails.bits / 128) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>{language === "PL" ? "Ocena siły:" : "Strength rating:"}</span>
            <span className="font-semibold text-white">{entropyDetails.rating}</span>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>{language === "PL" ? "Czas łamania (brute force):" : "Est. crack time (brute force):"}</span>
            <span className="text-slate-300">{entropyDetails.time}</span>
          </div>
        </div>

        <button type="button"
          onClick={handleGenerate}
          className={`w-full py-2.5 ${theme.primary} rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-95`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === "PL" ? "Regeneruj Nowy Klucz" : "Regenerate New Dev Key"}</span>
        </button>
      </div>
    </div>
  );
}
export default PasswordGenerator;
