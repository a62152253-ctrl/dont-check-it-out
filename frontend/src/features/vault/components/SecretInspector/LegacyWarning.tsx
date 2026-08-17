import React from "react";

interface Props {
  isLegacy?: boolean;
  onMigrate: () => void;
}

export const LegacyWarning = ({ isLegacy, onMigrate }: Props) => isLegacy ? (
  <div className="bg-amber-950/10 border border-amber-900/30 p-3 rounded-lg text-amber-300 text-[10px] space-y-2">
    <p className="font-semibold">⚠️ Ten wpis jest przechowywany w czystym tekście (legacy).</p>
    <button onClick={onMigrate} className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded transition-colors font-semibold">
      Migruj do AES-GCM-256
    </button>
  </div>
) : null;