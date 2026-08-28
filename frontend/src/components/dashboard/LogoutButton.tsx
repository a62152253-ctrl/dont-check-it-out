import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { translations } from "../../lib/translations";

export default function LogoutButton({
  logout,
  language
}: {
  logout: () => void;
  language: "PL" | "EN"
}) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const t = translations[language];

  return (
    <div className="relative">
      {showLogoutConfirm ? (
        <div className="flex items-center gap-1.5 bg-[#0a0a0a] px-2 py-1 rounded-lg border border-white/10 shadow-xl">
          <button
            onClick={() => logout()}
            className="px-2.5 py-1 text-[10px] bg-rose-600 hover:bg-rose-700 text-white font-bold rounded transition-all cursor-pointer"
          >
            {t.confirm}
          </button>
          <button
            onClick={() => setShowLogoutConfirm(false)}
            className="px-2.5 py-1 text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 rounded font-semibold cursor-pointer transition-all"
          >
            {t.cancel}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/5 text-xs text-rose-400 font-semibold cursor-pointer transition-all"
          title={t.signOut}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.signOut}</span>
        </button>
      )}
    </div>
  );
}