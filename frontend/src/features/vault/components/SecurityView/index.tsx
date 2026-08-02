import React, { useMemo } from "react";
import { ShieldCheck, Activity, Shield } from "lucide-react";
import { useVaultContext } from "../../context/useVaultContext";
import SecurityScoreCard from "./SecurityScoreCard";
import WeakPasswordList from "./WeakPasswordList";
import DuplicateCredentials from "./DuplicateCredentials";

export function SecurityView() {
  const {
    decryptedEntries,
    migrateAllLegacyEntries,
    setViewMode,
    setSelectedCategory,
    loading,
  } = useVaultContext();

  const stats = useMemo(() => {
    let legacyCount = 0;
    const activeEntries = decryptedEntries.filter((e) => !e.isTrash);
    activeEntries.forEach((entry) => {
      if (entry.isLegacy) legacyCount++;
    });
    return {
      legacy: legacyCount,
    };
  }, [decryptedEntries]);

  return (
    <div className="relative lg:col-span-9 space-y-6">
      {/* Enhanced UI Decoration */}
      <div
        className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.01] rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/[0.01] rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/[0.005] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="hidden lg:block absolute left-4 top-4 w-1 h-1 bg-white/10 rounded-full"
        aria-hidden="true"
      />
      <div
        className="hidden lg:block absolute right-4 bottom-4 w-1.5 h-1.5 bg-emerald-500/10 rounded-full"
        aria-hidden="true"
      />
      {/* End Enhanced UI Decoration */}

      <SecurityScoreCard />

      {/* Bulk Actions & Remediation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Migration Action */}
        <div className="bg-[#0c0c0c] border border-white/5 rounded-lg p-5 space-y-4">
          <h4 className="text-xs font-semibold uppercase text-slate-300 font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Grupowa Szyfracja (Bulk Migration)
          </h4>
          <p className="text-[11px] font-mono text-slate-500 leading-normal">
            Zaszyfruj wszystkie starsze, niezaszyfrowane (legacy plain-text)
            wpisy za pomocą nowoczesnego algorytmu AES-256-GCM. Podniesie to
            Twój wskaźnik bezpieczeństwa o 100%.
          </p>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="font-mono text-[10px] text-slate-500">
              Legacy do konwersji:{" "}
              <b className="text-amber-400">{stats.legacy}</b>
            </span>
            <button
              disabled={stats.legacy === 0 || loading}
              onClick={migrateAllLegacyEntries}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-white/5 disabled:text-slate-600 rounded text-[10px] font-mono text-black font-bold transition-all"
            >
              {loading ? "Szyfrowanie..." : "Rozpocznij konwersję"}
            </button>
          </div>
        </div>

        {/* Password entropy indicator */}
        <div className="bg-[#0c0c0c] border border-white/5 rounded-lg p-5 space-y-4">
          <h4 className="text-xs font-semibold uppercase text-slate-300 font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Szybki Generator Rotacji (Quick Rotator)
          </h4>
          <p className="text-[11px] font-mono text-slate-500 leading-normal">
            Chcesz szybko wygenerować i skopiować nowy silny klucz dla wybranej
            usługi? Użyj szybkiego generatora, aby natychmiast zrotować słabe
            hasło.
          </p>
          <button
            onClick={() => {
              setViewMode("all");
              setSelectedCategory("All");
            }}
            className="w-full text-center py-2 bg-white/5 hover:bg-white/10 text-white rounded text-[10px] font-mono border border-white/5 transition-all cursor-pointer"
          >
            Przejdź do Generatora kluczy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeakPasswordList />
        <DuplicateCredentials />
      </div>
    </div>
  );
}
export default SecurityView;
