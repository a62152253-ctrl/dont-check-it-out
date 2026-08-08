import React, { useState, useEffect } from "react";
import { Key, Copy, Sparkles } from "lucide-react";
import { useVaultContext } from "../../context/useVaultContext";
import { generateSecurePassword } from "../../utils/generators";

export function SSHKeyGenerator() {
  const { theme, language, setSuccessMsg } = useVaultContext();
  const [generatedKey, setGeneratedKey] = useState("");

  const handleGenerate = () => {
    const val = generateSecurePassword(
      "SSH_KEY",
      128,
      false,
      false,
      false,
      false,
      false,
      4,
      "-"
    );
    setGeneratedKey(val);
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedKey);
    setSuccessMsg(language === "PL" ? "Skopiowano do schowka!" : "Copied to clipboard!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="bg-[#0c0c0c] border border-white/5 rounded-xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30" />
      
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Key className={`w-4 h-4 ${theme.text}`} />
          <h4 className="text-xs font-bold uppercase text-slate-300 font-mono tracking-wider">
            SSH Key Generator
          </h4>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-[#121212] border border-white/5 rounded-lg p-4 text-center relative group min-h-[90px] flex flex-col justify-center">
          <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">
            Generated RSA Private Key
          </span>
          <pre className="text-[10px] font-mono text-emerald-400 break-all select-all font-semibold px-8 leading-relaxed max-h-[180px] overflow-y-auto text-left whitespace-pre-wrap">
            {generatedKey}
          </pre>
          <button
      type="button"
      onClick={handleCopy}
      className="absolute right-3 top-4 text-slate-400 hover:text-white bg-white/5 p-2 rounded-md border border-white/5 transition-all hover:bg-white/10 active:scale-95 "
      title="Copy Key"
     >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
     type="button"
     onClick={handleGenerate}
     className={`w-full py-2.5 ${theme.primary} rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95`}
    >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Regenerate SSH Key</span>
        </button>
      </div>
    </div>
  );
}
export default SSHKeyGenerator;
