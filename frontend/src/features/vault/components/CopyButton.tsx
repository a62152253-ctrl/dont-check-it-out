import React from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  onCopy: (e: React.MouseEvent) => void;
  isCopied: boolean;
  className?: string;
  title?: string;
}

export function CopyButton({
  onCopy,
  isCopied,
  className = "",
  title,
}: CopyButtonProps) {
  return (
    <button onClick={onCopy} className={className} title={title}>
      {isCopied ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
