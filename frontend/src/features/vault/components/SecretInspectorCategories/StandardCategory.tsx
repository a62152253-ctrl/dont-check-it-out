import React from "react";
import { Copy, Check, Eye, EyeOff, ExternalLink } from "lucide-react";

interface Props {
  id: string;
  url?: string;
  username?: string;
  password?: string;
  isPassVisible: boolean;
  copiedId: string | null;
  copiedField: string | null;
  setVisiblePasswords: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  copyText: (text: string, id: string, field: string) => void;
}

export function StandardCategory({
  id,
  url,
  username,
  password,
  isPassVisible,
  copiedId,
  copiedField,
  setVisiblePasswords,
  copyText
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
              onClick={() => copyText(url || "", id, "url")}
              className="text-slate-500 hover:text-white"
            >
              {copiedId === id && copiedField === "url" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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
            onClick={() => copyText(username || "", id, "user")}
            className="absolute right-2 top-3 text-slate-500 hover:text-white"
          >
            {copiedId === id && copiedField === "user" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
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
              onClick={() => setVisiblePasswords(p => ({ ...p, [id]: !p[id] }))}
              className="hover:text-white"
            >
              {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => copyText(password || "", id, "pass")}
              className="hover:text-white"
            >
              {copiedId === id && copiedField === "pass" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
