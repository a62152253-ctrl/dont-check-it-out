import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useVaultContext } from "../../context/useVaultContext";
import { DecryptedSecret } from "../../types";
import { CopyButton } from "./CopyButton";

export function SshCategory({ secret }: { secret: DecryptedSecret }) {
  const { visiblePasswords, setVisiblePasswords } = useVaultContext();
  if (!secret.developerFields) return null;
  const isPassVisible = !!visiblePasswords[secret.id || ""];

  return (
    <div className="space-y-3">
      <div className="bg-[#121212] border border-white/5 p-2 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Host zdalny (SSH Connection)</span>
        <span className="text-xs font-mono text-slate-300 select-all pr-8 break-all">{secret.developerFields.sshHost || "np. ubuntu@192.168.1.1"}</span>
        <div className="absolute right-2 top-2.5">
          <CopyButton textToCopy={secret.developerFields.sshHost || ""} secretId={secret.id!} fieldId="ssh_host" />
        </div>
      </div>
      {secret.developerFields.sshPassphrase && (
        <div className="bg-[#121212] border border-white/5 p-2 rounded relative">
          <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Klucz Passphrase</span>
          <span className="text-xs font-mono text-slate-300 select-all pr-8">
            {isPassVisible ? secret.developerFields.sshPassphrase : "••••••••••"}
          </span>
          <div className="absolute right-2 top-2 flex items-center gap-1 text-slate-500">
            <button onClick={() => setVisiblePasswords(p => ({ ...p, [secret.id!]: !p[secret.id!] }))} className="hover:text-white cursor-pointer">
              {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <CopyButton textToCopy={secret.developerFields.sshPassphrase || ""} secretId={secret.id!} fieldId="ssh_pass" />
          </div>
        </div>
      )}
      <div className="space-y-1 bg-[#070707] border border-white/5 p-2.5 rounded relative max-h-[160px] overflow-y-auto">
        <span className="block text-[8px] font-mono text-slate-500 uppercase">Klucz Prywatny RSA (Private Key)</span>
        <pre className="text-[9px] font-mono text-emerald-500/80 leading-normal select-all break-all whitespace-pre-wrap mt-1 select-all pr-6">
          {secret.developerFields.sshPrivateKey ? secret.developerFields.sshPrivateKey.substring(0, 70) + "..." : "Brak klucza"}
        </pre>
        {secret.developerFields.sshPrivateKey && (
          <div className="absolute right-2 top-2.5">
            <CopyButton textToCopy={secret.developerFields.sshPrivateKey || ""} secretId={secret.id!} fieldId="ssh_key" title="Skopiuj cały klucz SSH" />
          </div>
        )}
      </div>
    </div>
  );
}
