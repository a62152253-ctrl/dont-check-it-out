import React from "react";

interface Props { error: Error; }

export function ErrorStack({ error }: Props) {
  return (
    <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-left font-mono text-[10px] text-rose-300 max-h-[150px] overflow-y-auto break-all">
      {error.stack || error.message}
    </div>
  );
}
