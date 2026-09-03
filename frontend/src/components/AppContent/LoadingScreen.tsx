import React from "react";
import { useAuth } from "../../hooks/useAuth";

export function LoadingScreen() {
  const { language } = useAuth();
  const isPL = language === "PL";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-[#e0e0e0]">
      <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-2xl shadow-white/5 mb-6 animate-pulse">
        <svg className="animate-spin h-7 w-7 text-black" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
      <h3 className="font-display font-bold text-white text-base tracking-tight">CipherVault Gateway</h3>
      <p className="text-[10px] text-slate-500 mt-2 font-mono tracking-widest">
        {isPL ? "ZAKŁADANIE BEZPIECZNEGO POŁĄCZENIA SZYFRUJĄCEGO..." : "ESTABLISHING SECURE SHIELD CONNECTION..."}
      </p>
    </div>
  );
}
