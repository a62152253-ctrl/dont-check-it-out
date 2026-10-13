import React from "react";
import { AlertCircle } from "lucide-react";

export const VaultUnlockError = ({ error }: { error: string }) => (
  <div className="p-3.5 bg-rose-950/20 border border-rose-900/30 text-rose-300 rounded-xl text-xs flex items-center gap-2.5">
    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
    <span className="font-mono text-[10px] leading-relaxed">{error}</span>
  </div>
);
