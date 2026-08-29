import React from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { type DecryptedSecret } from "shared";

interface Props {
  secret: DecryptedSecret;
  copiedId: string | null;
  copiedField: string | null;
  copyText: (text: string, id: string, field: string) => void;
  handleDownloadDotenv: (name: string, content?: string) => void;
}

export const ApiKeys = ({ secret, copiedId, copiedField, copyText, handleDownloadDotenv }: Props) => {
  if (!secret.developerFields) return null;
  return (
    <div className="space-y-3">
      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative max-h-[160px] overflow-y-auto">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Zawartość Konfiguracji / Dotenv</span>
        <pre className="text-[10px] font-mono text-emerald-400 select-all whitespace-pre-wrap leading-relaxed mt-1 break-all pr-6 select-all">
          {secret.developerFields.dotenvContent || "Brak danych .env"}
        </pre>
        <button onClick={() => copyText(secret.developerFields?.dotenvContent || "", secret.id!, "dotenv")} className="absolute right-2 top-2.5 text-slate-500 hover:text-white cursor-pointer">
          {copiedId === secret.id && copiedField === "dotenv" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <button onClick={() => handleDownloadDotenv(secret.name, secret.developerFields?.dotenvContent)} className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 font-semibold font-mono text-[10px] rounded transition-all cursor-pointer flex items-center justify-center gap-1.5">
        <RefreshCw className="w-3.5 h-3.5 rotate-180" />
        <span>Pobierz jako plik .env</span>
      </button>
    </div>
  );
};
