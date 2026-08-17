import React from "react";
import { Star, Edit2 } from "lucide-react";
import { DecryptedSecret } from "shared/types";

interface Props {
  secret: DecryptedSecret;
  toggleFav: (id: string, isFav: boolean) => void;
  onEdit: () => void;
}

export const InspectorHeader = ({ secret, toggleFav, onEdit }: Props) => (
  <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
    <div>
      <h3 className="font-display font-semibold text-white tracking-tight break-words">{secret.name}</h3>
      <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
        <span className="text-[9px] font-mono font-bold bg-white/5 text-emerald-400 px-2 py-0.5 rounded uppercase tracking-wider">{secret.category}</span>
        {secret.project && <span className="text-[9px] font-mono bg-white/5 text-slate-400 px-2 py-0.5 rounded border border-white/5">{secret.project}</span>}
      </div>
    </div>
    <div className="flex items-center gap-1 shrink-0">
      <button onClick={() => toggleFav(secret.id!, !!secret.isFavorite)} className="p-1.5 hover:bg-white/5 text-slate-500 rounded transition-all cursor-pointer">
        <Star className={`w-4 h-4 ${secret.isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
      </button>
      <button onClick={onEdit} className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded transition-all cursor-pointer">
        <Edit2 className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);