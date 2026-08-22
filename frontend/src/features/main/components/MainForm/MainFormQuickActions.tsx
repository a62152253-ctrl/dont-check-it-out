import React from "react";
import { Sparkles, Plus, Search } from "lucide-react";

interface Props {
  setEditingId: (id: string | null) => void;
  setIsFormOpen: (isOpen: boolean) => void;
  setShowCommandPalette: (show: boolean) => void;
  setViewMode: (mode: string) => void;
}

export default function MainFormQuickActions({
  setEditingId,
  setIsFormOpen,
  setShowCommandPalette,
  setViewMode
}: Props) {
  return (
    <div className="bg-[#0c0c0c] border border-white/5 p-3 rounded-lg flex flex-wrap gap-3 items-center justify-between text-xs font-mono shadow-xl">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Szybkie Akcje Sejfu / Quick Actions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setEditingId(null);
            setIsFormOpen(true);
          }}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-emerald-300 rounded border border-white/5 transition-all flex items-center gap-1.5 cursor-pointer text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Secret</span>
        </button>

        <button
          onClick={() => {
            setShowCommandPalette(true);
          }}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded border border-white/5 transition-all flex items-center gap-1.5 cursor-pointer text-xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
          <kbd className="bg-black/40 px-1 py-0.5 rounded text-[8px] text-slate-400 font-semibold border border-white/5">Ctrl+K</kbd>
        </button>

        <button
          onClick={() => {
            setViewMode("generator");
          }}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-amber-400 hover:text-amber-300 rounded border border-white/5 transition-all flex items-center gap-1.5 cursor-pointer text-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate Token</span>
        </button>
      </div>
    </div>
  );
}
