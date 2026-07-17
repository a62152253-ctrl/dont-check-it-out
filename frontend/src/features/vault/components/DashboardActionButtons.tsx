import React from "react";
import { Download, Key } from "lucide-react";

interface Props {
  setViewMode: (mode: "generator" | "all") => void;
}

export function DashboardActionButtons({ setViewMode }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => setViewMode("generator")}
        className="flex flex-col items-center justify-center p-3.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-all border border-white/5 gap-2 text-xs font-mono"
      >
        <Download className="w-4 h-4 text-blue-400 rotate-180" />
        <span>Import Vault</span>
      </button>

      <button
        onClick={() => setViewMode("generator")}
        className="flex flex-col items-center justify-center p-3.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-all border border-white/5 gap-2 text-xs font-mono"
      >
        <Key className="w-4 h-4 text-emerald-400" />
        <span>Generate Key</span>
      </button>
    </div>
  );
}
