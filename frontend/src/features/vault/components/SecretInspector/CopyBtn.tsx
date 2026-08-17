import React from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  copiedId: string | null;
  copiedField: string | null;
  id?: string;
  field: string;
  onCopy: () => void;
}

export const CopyBtn = ({ copiedId, copiedField, id, field, onCopy }: Props) => {
  const isCopied = copiedId === id && copiedField === field;
  return (
    <button onClick={onCopy} className="absolute right-2 top-2.5 text-slate-500 hover:text-white">
      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};