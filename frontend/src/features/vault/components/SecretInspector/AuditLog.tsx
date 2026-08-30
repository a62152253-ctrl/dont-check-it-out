import React from "react";
import { Calendar, RefreshCw } from "lucide-react";
import { DecryptedSecret } from "../../types";

export function AuditLog({ secret }: { secret: DecryptedSecret }) {
  return (
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
  );
}
