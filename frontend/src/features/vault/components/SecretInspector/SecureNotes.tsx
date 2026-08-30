import React from "react";
import { DecryptedSecret } from "../../types";

export function SecureNotes({ secret }: { secret: DecryptedSecret }) {
  if (!secret.notes) return null;
  return (
    <div className="bg-[#121212] border border-white/5 p-3 rounded text-xs font-mono space-y-1">
      <span className="block text-[9px] text-slate-500 uppercase">Dodatkowe notatki (Secure notes)</span>
      <p className="text-slate-300 leading-relaxed break-words whitespace-pre-wrap">{secret.notes}</p>
    </div>
  );
}
