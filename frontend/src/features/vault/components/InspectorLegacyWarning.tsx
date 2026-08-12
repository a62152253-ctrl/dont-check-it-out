import React from "react";
import { DecryptedSecret } from "../types";

interface Props {
  secret: DecryptedSecret;
  migrateLegacyEntry: (secret: DecryptedSecret) => void;
}

export function InspectorLegacyWarning({ secret, migrateLegacyEntry }: Props) {
  if (!secret.isLegacy) return null;
  return (
    <div className="bg-amber-950/10 border border-amber-900/30 p-3 rounded-lg text-amber-300 text-[10px] space-y-2">
      <p className="font-semibold">⚠️ Ten wpis jest przechowywany w czystym tekście (legacy).</p>
      <button
        onClick={() => migrateLegacyEntry(secret)}
        className="w-full py-1.5 bg-amber-400 hover:bg-amber-500 text-black font-bold font-mono text-[9px] uppercase rounded transition-all cursor-pointer"
      >
        🔒 Zaszyfruj w locie kluczem AES
      </button>
    </div>
  );
}
