import React from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { DeveloperFields } from "../types";

export function SecretInspectorAWS({
  secret,
  copiedId,
  copiedField,
  copyText,
  handleCopyAWSExports
}: {
  secret: any;
  copiedId: string | null;
  copiedField: string | null;
  copyText: (text: string, id: string, field: string) => void;
  handleCopyAWSExports: (fields?: DeveloperFields) => void;
}) {
  if (!secret.developerFields) return null;

  return (
    <div className="space-y-3">
      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">AWS Access Key ID</span>
        <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">{secret.developerFields.awsAccessKeyId || "Brak"}</span>
        <button
          onClick={() => copyText(secret.developerFields?.awsAccessKeyId || "", secret.id!, "aws-id")}
          className="absolute right-2 top-3 text-slate-500 hover:text-white"
        >
          {copiedId === secret.id && copiedField === "aws-id" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">AWS Secret Access Key</span>
        <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all blur-[2px] hover:blur-none transition-all duration-300">
          {secret.developerFields.awsSecretAccessKey || "Brak"}
        </span>
        <button
          onClick={() => copyText(secret.developerFields?.awsSecretAccessKey || "", secret.id!, "aws-secret")}
          className="absolute right-2 top-3 text-slate-500 hover:text-white"
        >
          {copiedId === secret.id && copiedField === "aws-secret" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <button
        onClick={() => handleCopyAWSExports(secret.developerFields)}
        className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-semibold font-mono text-[10px] rounded transition-all flex items-center justify-center gap-1.5"
      >
        <Terminal className="w-3.5 h-3.5" />
        <span>Skopiuj zmienne środowiskowe (export ...)</span>
      </button>
    </div>
  );
}
