import React from "react";
import { Copy, Check } from "lucide-react";
import type { DecryptedSecret } from "../../../types";

export interface SSHKeyInspectorProps {
  secret: DecryptedSecret;
  copiedId: string | null;
  copiedField: string | null;
  copyText: (text: string, id: string, field: string) => void;
}

export function SSHKeyInspector({ secret, copiedId, copiedField, copyText }: SSHKeyInspectorProps) {
  if (!secret.developerFields) return null;

  return (
    <div className="space-y-3">
      <div className="space-y-1 bg-[#070707] border border-white/5 p-2.5 rounded relative max-h-[160px] overflow-y-auto">
        <span className="block text-[8px] font-mono text-slate-500 uppercase">Klucz Prywatny RSA (Private Key)</span>
        <pre className="text-[9px] font-mono text-emerald-500/80 leading-normal select-all break-all whitespace-pre-wrap mt-1 pr-6">
          {secret.developerFields.sshPrivateKey ? secret.developerFields.sshPrivateKey.substring(0, 70) + "..." : "Brak klucza"}
        </pre>
        {secret.developerFields.sshPrivateKey && (
          <button
            onClick={() => copyText(secret.developerFields?.sshPrivateKey || "", secret.id!, "ssh_key")}
            className="absolute right-2 top-2.5 text-slate-500 hover:text-white transition-all"
            title="Skopiuj cały klucz SSH"
          >
            {copiedId === secret.id && copiedField === "ssh_key" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
