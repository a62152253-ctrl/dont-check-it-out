import React from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { DeveloperFields } from "../types";

export function SecretInspectorDatabase({
  secret,
  copiedId,
  copiedField,
  copyText,
  handleCopyDbUri
}: {
  secret: any;
  copiedId: string | null;
  copiedField: string | null;
  copyText: (text: string, id: string, field: string) => void;
  handleCopyDbUri: (fields?: DeveloperFields) => void;
}) {
  if (!secret.developerFields) return null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
          <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Host</span>
          <span className="text-xs font-mono text-slate-200 select-all">{secret.developerFields.dbHost || "Brak"}</span>
        </div>
        <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
          <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Port</span>
          <span className="text-xs font-mono text-slate-200 select-all">{secret.developerFields.dbPort || "Brak"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
          <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Baza danych</span>
          <span className="text-xs font-mono text-slate-200 select-all">{secret.developerFields.dbName || "Brak"}</span>
        </div>
        <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
          <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Użytkownik</span>
          <span className="text-xs font-mono text-slate-200 select-all">{secret.developerFields.dbUser || "Brak"}</span>
        </div>
      </div>

      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Hasło do bazy</span>
        <span className="text-xs font-mono text-slate-200 select-all pr-8 blur-[2px] hover:blur-none transition-all duration-300">
          {secret.developerFields.dbPassword || "Brak"}
        </span>
        <button
          onClick={() => copyText(secret.developerFields?.dbPassword || "", secret.id!, "db-pass")}
          className="absolute right-2 top-3 text-slate-500 hover:text-white"
        >
          {copiedId === secret.id && copiedField === "db-pass" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <button
        onClick={() => handleCopyDbUri(secret.developerFields)}
        className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 font-semibold font-mono text-[10px] rounded transition-all flex items-center justify-center gap-1.5"
      >
        <Terminal className="w-3.5 h-3.5" />
        <span>Skopiuj Connection URI</span>
      </button>
    </div>
  );
}
