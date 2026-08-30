import React from "react";
import { Check, Copy } from "lucide-react";
import { useVaultContext } from "../../context/useVaultContext";

export function CopyButton({ textToCopy, secretId, fieldId, title }: { textToCopy: string, secretId: string, fieldId: string, title?: string }) {
  const { copyText, copiedId, copiedField } = useVaultContext();
  const isCopied = copiedId === secretId && copiedField === fieldId;
  return (
    <button
      onClick={() => copyText(textToCopy, secretId, fieldId)}
      className="text-slate-500 hover:text-white cursor-pointer"
      title={title}
    >
      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}
