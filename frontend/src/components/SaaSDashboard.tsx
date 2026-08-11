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
    <div className="min-h-screen bg-[#000000] flex flex-col text-[#e2e8f0] relative">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      
      {/* Sleek Top Header Bar */}
      <header className="sticky top-0 bg-black/40 backdrop-blur-xl border-b border-white/[0.05] px-6 py-3.5 z-30 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center rounded-lg shadow-lg shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-emerald-500/30 transition-transform duration-200 shrink-0">
              <Lock className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-white text-base leading-tight tracking-tight">
                {t.appName}
              </h1>
              <span className="text-[10px] font-mono text-emerald-400/90 font-bold tracking-widest uppercase block mt-0.5">
                {t.appSub}
              </span>
            </div>
          </div>

          {/* User Profile & Logout section */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Header Language Switcher */}
            <div className="flex gap-1 bg-white/[0.03] border border-white/[0.05] shadow-inner rounded-lg p-0.5 text-[10px]">
              <button
                type="button"
                onClick={() => setLanguage("PL")}
                className={`px-2.5 py-1 rounded-md font-mono transition-all duration-200 cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-md font-mono transition-all duration-200 cursor-pointer ${
                  language === "EN" 
                    ? "bg-white/10 text-white font-bold shadow-sm" 
                    : "text-slate-500 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            {/* User Badging */}
            <div className="hidden sm:flex items-center gap-2.5 bg-white/[0.02] border border-white/[0.08] shadow-lg px-3 py-1.5 rounded-lg hover:border-white/10 transition-colors">
              <img 
                src={profile.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.email}`} 
                alt="User avatar" 
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-md ring-2 ring-white/10 bg-slate-800 border border-white/10 shrink-0"
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
                  className="flex items-center gap-2 py-1.5 px-3 rounded-lg border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300 text-xs text-rose-400 font-semibold cursor-pointer transition-all"
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
