import React from "react";
import { Terminal, Eye, EyeOff } from "lucide-react";
import { useVaultContext } from "../../context/useVaultContext";
import { DecryptedSecret } from "../../types";
import { CopyButton } from "./CopyButton";

export function AwsCategory({ secret }: { secret: DecryptedSecret }) {
  const { visiblePasswords, setVisiblePasswords, setSuccessMsg } = useVaultContext();
  if (!secret.developerFields) return null;
  const isPassVisible = !!visiblePasswords[secret.id || ""];

  const handleCopyAWSExports = () => {
    const f = secret.developerFields!;
    const format = `export AWS_ACCESS_KEY_ID=${f.awsAccessKeyId || ""}\nexport AWS_SECRET_ACCESS_KEY=${f.awsSecretAccessKey || ""}\nexport AWS_DEFAULT_REGION=${f.region || "us-east-1"}`;
    navigator.clipboard.writeText(format);
    setSuccessMsg("Skopiowano eksport AWS (Shell Environment variables)!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-3">
      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">AWS Access Key ID</span>
        <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">{secret.developerFields.awsAccessKeyId || "Brak"}</span>
        <div className="absolute right-2 top-3">
          <CopyButton textToCopy={secret.developerFields.awsAccessKeyId || ""} secretId={secret.id!} fieldId="aws_id" />
        </div>
      </div>
      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">AWS Secret Access Key</span>
        <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">
          {isPassVisible ? secret.developerFields.awsSecretAccessKey : "••••••••••••••••••••••••••••••••"}
        </span>
        <div className="absolute right-2 top-3 flex items-center gap-1.5 text-slate-500">
          <button onClick={() => setVisiblePasswords(p => ({ ...p, [secret.id!]: !p[secret.id!] }))} className="hover:text-white cursor-pointer">
            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <CopyButton textToCopy={secret.developerFields.awsSecretAccessKey || ""} secretId={secret.id!} fieldId="aws_secret" />
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
      <button onClick={handleCopyAWSExports} className="w-full py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-300 font-semibold font-mono text-[10px] rounded transition-all cursor-pointer flex items-center justify-center gap-1.5">
        <Terminal className="w-3.5 h-3.5" />
        <span>Kopiuj eksport AWS (Shell env)</span>
      </button>
    </div>
  );
}
