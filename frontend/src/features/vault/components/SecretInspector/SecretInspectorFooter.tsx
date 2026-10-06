import React from "react";
import { Calendar, RefreshCw, Trash2 } from "lucide-react";
import { DecryptedSecret } from "../../types";

interface SecretInspectorFooterProps {
  secret: DecryptedSecret;
  moveToTrash: (id: string, isTrash: boolean) => void;
  deleteSecretPermanently: (id: string) => void;
}

export function SecretInspectorFooter({ secret, moveToTrash, deleteSecretPermanently }: SecretInspectorFooterProps) {
  return (
    <>
      <div className="border-t border-white/5 pt-3 flex flex-wrap gap-x-4 gap-y-2 text-[9px] font-mono text-slate-600 justify-between">
        {secret.createdAt && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 shrink-0" />
            Stworzono: {new Date(secret.createdAt).toLocaleDateString()}
          </span>
        )}
        {secret.updatedAt && (
          <span className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3 shrink-0" />
            Modyfikowano: {new Date(secret.updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="border-t border-white/5 pt-3.5 flex gap-2">
        {secret.isTrash ? (
          <>
            <button
              onClick={() => moveToTrash(secret.id!, false)}
              className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px] uppercase rounded transition-all   text-center"
            >
              Przywróć
            </button>
            <button
              onClick={() => deleteSecretPermanently(secret.id!)}
              className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 rounded transition-all   flex items-center justify-center"
              title="Usuń trwale"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => moveToTrash(secret.id!, true)}
            className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold font-mono text-[10px] uppercase rounded transition-all   flex items-center justify-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Przenieś do kosza
          </button>
        )}
      </div>
    </>
  );
}
