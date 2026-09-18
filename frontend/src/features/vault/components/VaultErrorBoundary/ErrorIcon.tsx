import React from "react";
import { AlertTriangle } from "lucide-react";

export function ErrorIcon() {
  return (
    <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400">
      <AlertTriangle className="w-7 h-7" />
    </div>
  );
}
