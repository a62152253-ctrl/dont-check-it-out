import React from "react";
import { Trash2 } from "lucide-react";
import { type DecryptedSecret } from "shared";

interface Props {
  secret: DecryptedSecret;
  moveToTrash: (id: string, isTrash: boolean) => void;
  deleteSecretPermanently: (id: string) => void;
}

export const ActionButtons = ({ secret, moveToTrash, deleteSecretPermanently }: Props) => (
  <div className="border-t border-white/5 pt-3.5 flex gap-2">
    {secret.isTrash ? (
      <>
        <button onClick={() => moveToTrash(secret.id!, false)} className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px] uppercase rounded transition-all cursor-pointer text-center">
          Przywróć
        </button>
        <button onClick={() => deleteSecretPermanently(secret.id!)} className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 rounded transition-all cursor-pointer flex items-center justify-center" title="Usuń trwale">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </>
    ) : (
      <button onClick={() => moveToTrash(secret.id!, true)} className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold font-mono text-[10px] uppercase rounded transition-all cursor-pointer flex items-center justify-center gap-1">
        <Trash2 className="w-3.5 h-3.5" />
        Przenieś do kosza
      </button>
    )}
  </div>
);
