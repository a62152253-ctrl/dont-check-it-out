import React from "react";
import { CopyBtn } from "./CopyBtn";
import { Terminal, Eye, EyeOff } from "lucide-react";
import { DecryptedSecret, DeveloperFields } from "shared/types";

interface Props {
  secret: DecryptedSecret;
  copiedId: string | null;
  copiedField: string | null;
  copyText: (text: string, id: string, field: string) => void;
  handleCopyAWS: (fields: DeveloperFields) => void;
  isPassVisible: boolean;
  setVisible: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
}

export const CategoryAWS = ({ secret, copiedId, copiedField, copyText, handleCopyAWS, isPassVisible, setVisible }: Props) => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-[#121212] border border-white/5 p-2 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Access Key ID</span>
        <span className="text-xs font-mono text-slate-300 truncate block select-all pr-6">{secret.developerFields?.awsAccessKeyId || "Brak"}</span>
        <CopyBtn copiedId={copiedId} id={secret.id} field="aws_key" copiedField={copiedField} onCopy={() => copyText(secret.developerFields?.awsAccessKeyId || "", secret.id!, "aws_key")} />
      </div>
      <div className="bg-[#121212] border border-white/5 p-2 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Secret Access Key</span>
        <span className="text-xs font-mono text-slate-300 truncate block select-all pr-6">
          {isPassVisible ? secret.developerFields?.awsSecretAccessKey : "••••••••••••"}
        </span>
        <div className="absolute right-2 top-2.5 flex items-center gap-1.5 text-slate-500">
          <button
            onClick={() => setVisible(p => ({ ...p, [secret.id!]: !p[secret.id!] }))}
            className="hover:text-white cursor-pointer"
          >
            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <CopyBtn copiedId={copiedId} id={secret.id} field="aws_secret" copiedField={copiedField} onCopy={() => copyText(secret.developerFields?.awsSecretAccessKey || "", secret.id!, "aws_secret")} />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-[#121212] border border-white/5 p-2 rounded">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Region (AWS)</span>
        <span className="text-xs font-mono text-slate-300 uppercase font-semibold">{secret.developerFields?.region || "us-east-1"}</span>
      </div>
      <div className="bg-[#121212] border border-white/5 p-2 rounded">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Środowisko</span>
        <span className="text-xs font-mono text-slate-300 uppercase font-semibold">{secret.environment || "dev"}</span>
      </div>
    </div>
    <button onClick={() => handleCopyAWS(secret.developerFields!)} className="w-full py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-300 font-semibold font-mono text-[10px] rounded flex justify-center gap-1.5 cursor-pointer transition-all"><Terminal className="w-3.5 h-3.5" /><span>Kopiuj eksport AWS (Shell env)</span></button>
  </div>
);