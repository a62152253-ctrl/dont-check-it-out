import React from "react";
import { ShieldCheck, LayoutDashboard, Key, Sparkles, ShieldAlert, Settings, Lock } from "lucide-react";

interface Props {
  viewMode: string;
  setViewMode: (mode: string) => void;
  setSelectedCategory: (category: string) => void;
  decryptedEntries: any[];
  lockVault: () => void;
}

export default function MainFormSidebar({
  viewMode,
  setViewMode,
  setSelectedCategory,
  decryptedEntries,
  lockVault
}: Props) {
  return (
    <div className="lg:col-span-3 space-y-4">
      <div className="bg-[#0c0c0c] border border-white/5 rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2 text-white border-b border-white/5 pb-2.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Nawigacja Sejfu</h4>
        </div>

        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => { setViewMode("dashboard"); setSelectedCategory("All"); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer border-0 ${
              viewMode === "dashboard"
                ? "bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/10"
                : "bg-transparent text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Pulpit (Dashboard)</span>
          </button>

          <button
            onClick={() => { setViewMode("all"); setSelectedCategory("All"); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer border-0 ${
              (viewMode === "all" || viewMode === "favorites" || viewMode === "trash")
                ? "bg-white text-black font-semibold shadow-md"
                : "bg-transparent text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4" />
              <span>Klucze i Hasła</span>
            </div>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
              (viewMode === "all" || viewMode === "favorites" || viewMode === "trash") ? "bg-black/10 text-black" : "bg-white/5 text-slate-500"
            }`}>
              {decryptedEntries.filter((e: any) => !e.isTrash).length}
            </span>
          </button>

          <button
            onClick={() => { setViewMode("generator"); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer border-0 ${
              viewMode === "generator"
                ? "bg-[#161616] text-amber-400 border border-white/10 font-bold"
                : "bg-transparent text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Generator i Import</span>
          </button>

          <button
            onClick={() => { setViewMode("security"); setSelectedCategory("All"); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer border-0 ${
              viewMode === "security"
                ? "bg-[#161616] text-emerald-400 border border-white/10 font-bold"
                : "bg-transparent text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Audyt Centrum</span>
            </div>
          </button>

          <button
            onClick={() => { setViewMode("settings"); setSelectedCategory("All"); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer border-0 ${
              (viewMode === "settings" || viewMode === "activity")
                ? "bg-[#161616] text-white border border-white/10 font-bold"
                : "bg-transparent text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Ustawienia i Logi</span>
          </button>
        </div>

        <div className="border-t border-white/5 pt-3">
          <button
            type="button"
            onClick={lockVault}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-md transition-all cursor-pointer uppercase text-[9px] font-bold"
          >
            <Lock className="w-3.5 h-3.5" />
            Zablokuj Sejf
          </button>
        </div>
      </div>
    </div>
  );
}
