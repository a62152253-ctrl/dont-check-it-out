import React from "react";
import { Cpu } from "lucide-react";

export function InspectorEmptyState() {
  return (
    <div className="bg-[#0c0c0c] border border-white/5 rounded-lg p-12 text-center text-slate-500 font-mono text-xs">
      <Cpu className="w-6 h-6 text-slate-800 mx-auto mb-2" />
      <span>Wybierz sekret z listy, aby wyświetlić szczegóły (Zero-Knowledge Audit)</span>
    </div>
  );
}
