import React from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  isCopied: boolean;
  onCopy: () => void;
  className?: string;
  title?: string;
}

export function CopyButton({ isCopied, onCopy, className, title }: CopyButtonProps) {
  return (
    <button
      onClick={onCopy}
      className={className || "absolute right-2 top-2.5 text-slate-500 hover:text-white transition-colors cursor-pointer"}
      title={title}
    >
      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}
