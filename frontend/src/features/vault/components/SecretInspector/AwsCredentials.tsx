import React from "react";
import { Terminal, Copy, Check, Eye, EyeOff } from "lucide-react";
import { type DecryptedSecret, type DeveloperFields } from "shared";

interface Props {
  secret: DecryptedSecret;
  isPassVisible: boolean;
  setVisiblePasswords: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  copiedId: string | null;
  copiedField: string | null;
  copyText: (text: string, id: string, field: string) => void;
  handleCopyAWSExports: (fields?: DeveloperFields) => void;
}

export const AwsCredentials = ({ secret, isPassVisible, setVisiblePasswords, copiedId, copiedField, copyText, handleCopyAWSExports }: Props) => {
  if (!secret.developerFields) return null;
  return (
    <div className="space-y-3">
      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">AWS Access Key ID</span>
        <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">{secret.developerFields.awsAccessKeyId || "Brak"}</span>
        <button onClick={() => copyText(secret.developerFields?.awsAccessKeyId || "", secret.id!, "aws_id")} className="absolute right-2 top-3 text-slate-500 hover:text-white cursor-pointer" title="Kopiuj ID">
          {copiedId === secret.id && copiedField === "aws_id" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">AWS Secret Access Key</span>
        <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">{isPassVisible ? secret.developerFields.awsSecretAccessKey : "••••••••••••••••••••••••••••••••"}</span>
        <div className="absolute right-2 top-3 flex items-center gap-1.5 text-slate-500">
          <button onClick={() => setVisiblePasswords(p => ({ ...p, [secret.id!]: !p[secret.id!] }))} className="hover:text-white cursor-pointer">
            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => copyText(secret.developerFields?.awsSecretAccessKey || "", secret.id!, "aws_secret")} className="hover:text-white cursor-pointer">
            {copiedId === secret.id && copiedField === "aws_secret" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#121212] border border-white/5 p-2 rounded">
          <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Region</span>
          <span className="text-xs font-mono text-slate-300">{secret.developerFields.region || "us-east-1"}</span>
        </div>
        <div className="bg-[#121212] border border-white/5 p-2 rounded">
          <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Środowisko</span>
          <span className="text-xs font-mono text-slate-300 uppercase font-semibold">{secret.environment || "dev"}</span>
        </div>
      </div>
      <button onClick={() => handleCopyAWSExports(secret.developerFields)} className="w-full py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-300 font-semibold font-mono text-[10px] rounded transition-all cursor-pointer flex items-center justify-center gap-1.5">
        <Terminal className="w-3.5 h-3.5" />
        <span>Kopiuj eksport AWS (Shell env)</span>
      </button>
    </div>
  );
};
