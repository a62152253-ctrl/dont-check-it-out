import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import MainForm from "./MainForm";
import { translations } from "../lib/translations";
import { 
  LogOut, 
  Lock
} from "lucide-react";

export default function SaasDashboard() {
  const { 
    profile, 
    logout,
    language,
    setLanguage
  } = useAuth();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const t = translations[language];

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-[#e0e0e0]">
        <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full mb-4" />
        <p className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          {translations[language || "PL"].loadingWorkspace}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col text-[#e2e8f0] relative">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/[0.02] rounded-full blur-3xl pointer-events-none" />
      
      {/* Sleek Top Header Bar */}
      <header className="sticky top-0 bg-[#080808]/70 backdrop-blur-md border-b border-white/5 px-6 py-3.5 z-30 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3 group">
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

          {/* User Profile & Logout section */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Header Language Switcher */}
            <div className="flex gap-1 bg-white/5 border border-white/5 rounded-lg p-0.5 text-[10px]">
              <button
                type="button"
                onClick={() => setLanguage("PL")}
                className={`px-2.5 py-1 rounded-md font-mono transition-all duration-200 ${
                  language === "PL" 
                    ? "bg-white/10 text-white font-bold shadow-sm" 
                    : "text-slate-500 hover:text-white"
                }`}
              >
                PL
              </button>
              <button
                type="button"
                onClick={() => setLanguage("EN")}
                className={`px-2.5 py-1 rounded-md font-mono transition-all duration-200 ${
                  language === "EN" 
                    ? "bg-white/10 text-white font-bold shadow-sm" 
                    : "text-slate-500 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            {/* User Badging */}
            <div className="hidden sm:flex items-center gap-2.5 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-lg hover:border-white/10 transition-colors">
              <img 
                src={profile.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.email}`} 
                alt="User avatar" 
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded bg-slate-800 border border-white/10 shrink-0"
              />
              <span className="text-xs font-mono text-slate-300 max-w-[150px] truncate">
                {profile.displayName || profile.email}
              </span>
            </div>

            {/* Logout Trigger */}
            <div className="relative">
              {showLogoutConfirm ? (
                <div className="flex items-center gap-1.5 bg-[#0a0a0a] px-2 py-1 rounded-lg border border-white/10 shadow-xl">
                  <button
                    onClick={() => logout()}
                    className="px-2.5 py-1 text-[10px] bg-rose-600 hover:bg-rose-700 text-white font-bold rounded transition-all"
                  >
                    {t.confirm}
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-2.5 py-1 text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 rounded font-semibold transition-all"
                  >
                    {t.cancel}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/5 text-xs text-rose-400 font-semibold transition-all"
                  title={t.signOut}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.signOut}</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Main Workspace Stage */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <MainForm />
      </main>

    </div>
  );
}
