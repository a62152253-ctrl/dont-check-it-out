import React from "react";
import { Copy, Check } from "lucide-react";

export function SecretInspectorSSH({
  secret,
  copiedId,
  copiedField,
  copyText
}: {
  secret: any;
  copiedId: string | null;
  copiedField: string | null;
  copyText: (text: string, id: string, field: string) => void;
}) {
  if (!secret.developerFields) return null;

  return (
    <div className="space-y-3">
      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">SSH Host (Target)</span>
        <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">{secret.developerFields.sshHost || "Brak"}</span>
        <button
          onClick={() => copyText(secret.developerFields?.sshHost || "", secret.id!, "ssh-host")}
          className="absolute right-2 top-3 text-slate-500 hover:text-white"
        >
          {copiedId === secret.id && copiedField === "ssh-host" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">SSH Private Key (RSA/ED25519)</span>
        <div className="relative">
          <pre className="text-[10px] font-mono text-slate-400 blur-[3px] hover:blur-none transition-all duration-300 max-h-[120px] overflow-y-auto whitespace-pre-wrap break-all mt-1 pr-6 select-all">
            {secret.developerFields.sshPrivateKey || "Brak klucza prywatnego"}
          </pre>
          {secret.developerFields.sshPrivateKey && (
            <button
              onClick={() => copyText(secret.developerFields?.sshPrivateKey || "", secret.id!, "ssh_key")}
              className="absolute right-0 top-0 text-slate-500 hover:text-white bg-[#121212]/80 p-1 rounded"
              title="Skopiuj cały klucz SSH"
            >
              {copiedId === secret.id && copiedField === "ssh_key" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
