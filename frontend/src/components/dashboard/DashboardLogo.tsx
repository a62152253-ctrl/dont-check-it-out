import React from "react";
import { Lock } from "lucide-react";
import { translations } from "../../lib/translations";

export default function DashboardLogo({ language }: { language: "PL" | "EN" }) {
  const t = translations[language];
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center rounded-lg shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-200 shrink-0">
        <Lock className="w-4 h-4 text-black stroke-[2.5]" />
      </div>
      <div>
        <h1 className="font-display font-semibold text-white text-base leading-tight tracking-tight">
          {t.appName}
        </h1>
        <span className="text-[9px] font-mono text-emerald-400/80 font-bold tracking-widest uppercase block mt-0.5">
          {t.appSub}
        </span>
      </div>
    </div>
  );
}