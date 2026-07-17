import React from "react";
import { DecryptedSecret } from "shared";
import { getCategoryIcon } from "../utils/categoryIcon";
import { formatTimeAgo } from "../utils/timeAgo";
import { mapLegacyCategory } from "../hooks/useVault";

interface Props {
  secret: DecryptedSecret;
  onClick: () => void;
}

export function SecretDashboardButton({ secret, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-lg hover:bg-white/[0.03] transition-all text-left group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/5 rounded text-slate-400 group-hover:text-white transition-colors">
          {getCategoryIcon(mapLegacyCategory(secret.category))}
        </div>
        <div>
          <h5 className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">{secret.name}</h5>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
            {secret.category} {secret.project ? `• ${secret.project}` : ""}
          </p>
        </div>
      </div>
      <span className="text-[9px] text-slate-500 font-mono">
        {secret.updatedAt ? formatTimeAgo(secret.updatedAt) : "Niedawno"}
      </span>
    </button>
  );
}
