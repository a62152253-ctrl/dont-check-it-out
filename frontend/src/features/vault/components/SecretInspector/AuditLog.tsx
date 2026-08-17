import React from "react";
import { Calendar, RefreshCw } from "lucide-react";

interface Props {
  createdAt?: string;
  updatedAt?: string;
}

export const AuditLog = ({ createdAt, updatedAt }: Props) => (
  <div className="border-t border-white/5 pt-3 flex flex-wrap gap-x-4 gap-y-2 text-[9px] font-mono text-slate-600 justify-between">
    {createdAt && <span className="flex items-center gap-1"><Calendar className="w-3 h-3 shrink-0" /> Stworzono: {new Date(createdAt).toLocaleDateString()}</span>}
    {updatedAt && <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3 shrink-0" /> Modyfikowano: {new Date(updatedAt).toLocaleDateString()}</span>}
  </div>
);