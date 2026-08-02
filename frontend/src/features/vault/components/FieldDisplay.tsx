import React from "react";
import { CopyButton } from "./CopyButton";
import { Eye, EyeOff } from "lucide-react";

interface FieldDisplayProps {
  label: string;
  value: string;
  isPassword?: boolean;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  onCopy?: () => void;
  isCopied?: boolean;
}

export function FieldDisplay({
  label,
  value,
  isPassword = false,
  isVisible = false,
  onToggleVisibility,
  onCopy,
  isCopied = false,
}: FieldDisplayProps) {
  return (
    <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
      <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">
        {label}
      </span>
      <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">
        {isPassword && !isVisible
          ? "••••••••••••••••••••••••••••••••".slice(0, value.length || 16)
          : value}
      </span>
      {(onCopy || isPassword) && (
        <div className="absolute right-2 top-3 flex items-center gap-1.5 text-slate-500">
          {isPassword && onToggleVisibility && (
            <button
              onClick={onToggleVisibility}
              className="hover:text-white cursor-pointer"
            >
              {isVisible ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>
          )}
          {onCopy && (
            <CopyButton
              onCopy={onCopy}
              isCopied={isCopied}
              className="hover:text-white cursor-pointer"
            />
          )}
        </div>
      )}
    </div>
  );
}
