import React from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import type { DeveloperFields } from "shared";

interface Props {
  fields: DeveloperFields;
  secretId: string;
  isPassVisible: boolean;
  copiedId: string | null;
  copiedField: string | null;
  copyText: (text: string, id: string, field: string) => void;
  setVisiblePasswords: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function SshSecretDetails({
  fields,
  secretId,
  isPassVisible,
  copiedId,
  copiedField,
  copyText,
  setVisiblePasswords
}: Props) {
  return (
    <div className="space-y-3">
      <div className="bg-[#121212] border border-white/5 p-2 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Host zdalny (SSH Connection)</span>
        <span className="text-xs font-mono text-slate-300 select-all pr-8 break-all">{fields.sshHost || "np. ubuntu@192.168.1.1"}</span>
        <button
          onClick={() => copyText(fields.sshHost || "", secretId, "ssh_host")}
          className="absolute right-2 top-2.5 text-slate-500 hover:text-white"
        >
          {copiedId === secretId && copiedField === "ssh_host" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {fields.sshPassphrase && (
        <div className="bg-[#121212] border border-white/5 p-2 rounded relative">
          <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Klucz Passphrase</span>
          <span className="text-xs font-mono text-slate-300 select-all pr-8">
            {isPassVisible ? fields.sshPassphrase : "••••••••••"}
          </span>
          <div className="absolute right-2 top-2 flex items-center gap-1 text-slate-500">
            <button
              onClick={() => setVisiblePasswords(p => ({ ...p, [secretId]: !p[secretId] }))}
              className="hover:text-white"
            >
              {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => copyText(fields.sshPassphrase || "", secretId, "ssh_pass")}
              className="hover:text-white"
            >
              {copiedId === secretId && copiedField === "ssh_pass" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1 bg-[#070707] border border-white/5 p-2.5 rounded relative max-h-[160px] overflow-y-auto">
        <span className="block text-[8px] font-mono text-slate-500 uppercase">Klucz Prywatny RSA (Private Key)</span>
        <pre className="text-[9px] font-mono text-emerald-500/80 leading-normal select-all break-all whitespace-pre-wrap mt-1 select-all pr-6">
          {fields.sshPrivateKey ? fields.sshPrivateKey.substring(0, 70) + "..." : "Brak klucza"}
        </pre>
        {fields.sshPrivateKey && (
          <button
            onClick={() => copyText(fields.sshPrivateKey || "", secretId, "ssh_key")}
            className="absolute right-2 top-2.5 text-slate-500 hover:text-white"
            title="Skopiuj cały klucz SSH"
          >
            {copiedId === secretId && copiedField === "ssh_key" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
