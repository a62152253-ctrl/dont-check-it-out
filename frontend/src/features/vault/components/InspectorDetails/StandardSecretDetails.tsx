import React from "react";
import { Check, Copy, ExternalLink, Eye, EyeOff } from "lucide-react";

interface Props {
  url?: string;
  username?: string;
  password?: string;
  secretId: string;
  isPassVisible: boolean;
  copiedId: string | null;
  copiedField: string | null;
  copyText: (text: string, id: string, field: string) => void;
  setVisiblePasswords: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function StandardSecretDetails({
  url,
  username,
  password,
  secretId,
  isPassVisible,
  copiedId,
  copiedField,
  copyText,
  setVisiblePasswords
}: Props) {
  return (
    <div className="space-y-3">
      {url && (
        <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative flex items-center justify-between">
          <div className="min-w-0 pr-8">
            <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">URL adresu</span>
            <span className="text-xs font-mono text-slate-300 truncate block select-all">{url}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => copyText(url || "", secretId, "url")}
              className="text-slate-500 hover:text-white"
            >
              {copiedId === secretId && copiedField === "url" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <a
              href={url.startsWith("http") ? url : `https://${url}`}
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-white"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {username && (
        <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
          <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Nazwa Użytkownika / Email</span>
          <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">{username}</span>
          <button
            onClick={() => copyText(username || "", secretId, "user")}
            className="absolute right-2 top-3 text-slate-500 hover:text-white"
          >
            {copiedId === secretId && copiedField === "user" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {password && (
        <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
          <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Klucz Hasła</span>
          <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">
            {isPassVisible ? password : "••••••••••••••••"}
          </span>
          <div className="absolute right-2 top-3 flex items-center gap-1.5 text-slate-500">
            <button
              onClick={() => setVisiblePasswords(p => ({ ...p, [secretId]: !p[secretId] }))}
              className="hover:text-white"
            >
              {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => copyText(password || "", secretId, "pass")}
              className="hover:text-white"
            >
              {copiedId === secretId && copiedField === "pass" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
