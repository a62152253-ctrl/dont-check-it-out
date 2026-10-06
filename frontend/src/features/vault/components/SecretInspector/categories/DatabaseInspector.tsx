import React from "react";
import { Copy, Check, Database } from "lucide-react";
import type { DecryptedSecret, DeveloperFields } from "../../../types";

export interface DatabaseInspectorProps {
  secret: DecryptedSecret;
  copiedId: string | null;
  copiedField: string | null;
  copyText: (text: string, id: string, field: string) => void;
  handleCopyDbUri: (fields?: DeveloperFields) => void;
}

export function DatabaseInspector({ secret, copiedId, copiedField, copyText, handleCopyDbUri }: DatabaseInspectorProps) {
  if (!secret.developerFields) return null;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
          <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Host / Endpoint</span>
          <span className="text-[10px] font-mono text-slate-300 truncate block pr-6">
            {secret.developerFields.dbHost || "localhost"}
          </span>
          <button
            onClick={() => copyText(secret.developerFields?.dbHost || "localhost", secret.id!, "db_host")}
            className="absolute right-2 top-2.5 text-slate-500 hover:text-white transition-all"
          >
            {copiedId === secret.id && copiedField === "db_host" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      <button
        onClick={() => handleCopyDbUri(secret.developerFields)}
        className="w-full py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-300 font-semibold font-mono text-[10px] rounded transition-all flex items-center justify-center gap-1.5"
      >
        <Database className="w-3.5 h-3.5" />
        <span>Skopiuj standardowy Connection String</span>
      </button>
    </div>
  );
}
