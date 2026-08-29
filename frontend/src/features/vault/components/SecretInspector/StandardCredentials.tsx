import React from "react";
import { Copy, Check, ExternalLink, Eye, EyeOff } from "lucide-react";
import { type DecryptedSecret } from "shared";

interface Props {
  secret: DecryptedSecret;
  isPassVisible: boolean;
  setVisiblePasswords: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  copiedId: string | null;
  copiedField: string | null;
  copyText: (text: string, id: string, field: string) => void;
}

export const StandardCredentials = ({ secret, isPassVisible, setVisiblePasswords, copiedId, copiedField, copyText }: Props) => (
  <div className="space-y-3">
    {secret.url && (
      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative flex items-center justify-between">
        <div className="min-w-0 pr-8">
          <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">URL adresu</span>
          <span className="text-xs font-mono text-slate-300 truncate block select-all">{secret.url}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => copyText(secret.url || "", secret.id!, "url")} className="text-slate-500 hover:text-white cursor-pointer">
            {copiedId === secret.id && copiedField === "url" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <a href={secret.url.startsWith("http") ? secret.url : `https://${secret.url}`} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    )}
    {secret.username && (
      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Nazwa Użytkownika / Email</span>
        <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">{secret.username}</span>
        <button onClick={() => copyText(secret.username || "", secret.id!, "user")} className="absolute right-2 top-3 text-slate-500 hover:text-white cursor-pointer">
          {copiedId === secret.id && copiedField === "user" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    )}
    {secret.password && (
      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Klucz Hasła</span>
        <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">
          {isPassVisible ? secret.password : "••••••••••••••••"}
        </span>
        <div className="absolute right-2 top-3 flex items-center gap-1.5 text-slate-500">
          <button onClick={() => setVisiblePasswords(p => ({ ...p, [secret.id!]: !p[secret.id!] }))} className="hover:text-white cursor-pointer">
            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => copyText(secret.password || "", secret.id!, "pass")} className="hover:text-white cursor-pointer">
            {copiedId === secret.id && copiedField === "pass" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    )}
  </div>
);
