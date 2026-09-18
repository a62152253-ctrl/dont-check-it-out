import React from "react";
import { RefreshCw } from "lucide-react";

interface Props { onReload: () => void; }

export function ReloadButton({ onReload }: Props) {
  return (
    <button
      onClick={onReload}
      className="inline-flex items-center gap-2 py-2.5 px-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-rose-500/10 cursor-pointer mx-auto hover:scale-[1.01] active:scale-[0.99]"
    >
      <RefreshCw className="w-3.5 h-3.5" />
      <span>Odśwież aplikację</span>
    </button>
  );
}
