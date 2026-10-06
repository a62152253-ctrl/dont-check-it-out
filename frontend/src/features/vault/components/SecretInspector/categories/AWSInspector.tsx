import React from "react";
import { Copy, Check, Eye, EyeOff, Terminal } from "lucide-react";
import { DecryptedSecret, DeveloperFields } from "../../../types";

interface AWSInspectorProps {
  secret: DecryptedSecret;
  copiedId: string | null;
  copiedField: string | null;
  copyText: (text: string, id: string, field: string) => void;
  isPassVisible: boolean;
  setVisiblePasswords: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleCopyAWSExports: (fields?: DeveloperFields) => void;
}

export function AWSInspector({
  secret,
  copiedId,
  copiedField,
  copyText,
  isPassVisible,
  setVisiblePasswords,
  handleCopyAWSExports
}: AWSInspectorProps) {
  if (!secret.developerFields) return null;

  return (
    <div className="space-y-3">
      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Access Key ID</span>
        <span className="text-xs font-mono text-slate-300">{secret.developerFields.awsAccessKeyId || "Brak"}</span>
        <button
          onClick={() => copyText(secret.developerFields?.awsAccessKeyId || "", secret.id!, "aws_key")}
          className="absolute right-2 top-3 text-slate-500 hover:text-white transition-all"
        >
          {copiedId === secret.id && copiedField === "aws_key" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Secret Access Key</span>
        <span className="text-xs font-mono text-slate-300">
          {isPassVisible ? secret.developerFields.awsSecretAccessKey : "••••••••••••••••••••••••••••••••••••••••"}
        </span>
        <div className="absolute right-2 top-3 flex items-center gap-1.5 text-slate-500">
          <button
            onClick={() => setVisiblePasswords(p => ({ ...p, [secret.id!]: !p[secret.id!] }))}
            className="hover:text-white transition-all"
          >
            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => copyText(secret.developerFields?.awsSecretAccessKey || "", secret.id!, "aws_secret")}
            className="hover:text-white transition-all"
          >
            {copiedId === secret.id && copiedField === "aws_secret" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <button
        onClick={() => handleCopyAWSExports(secret.developerFields)}
        className="w-full py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-300 font-semibold font-mono text-[10px] rounded transition-all flex items-center justify-center gap-1.5"
      >
        <Terminal className="w-3.5 h-3.5" />
        <span>Skopiuj jako zmienne środowiskowe (sh)</span>
      </button>
    </div>
  );
}
