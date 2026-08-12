import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import MainForm from "./MainForm";
import { translations } from "../lib/translations";
import { 
  LogOut, 
  Lock,
  Shield
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-200">
        <div className="animate-spin h-6 w-6 border-2 border-slate-500 border-t-transparent rounded-full mb-4" />
        <p className="text-sm font-medium text-slate-400">
          {translations[language || "PL"].loadingWorkspace}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200">
      
      {/* Sleek Top Header Bar */}
      <header className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-3 z-30 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 bg-indigo-600 flex items-center justify-center rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-200 shrink-0">
              <Shield className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-slate-50 text-lg leading-tight tracking-tight">
                {t.appName}
              </h1>
              <span className="text-[10px] font-medium text-indigo-400 uppercase tracking-wide block mt-0.5">
                {t.appSub}
              </span>
            </div>
          </div>

          {/* User Profile & Logout section */}
          <div className="flex items-center gap-3 sm:gap-5">
            
            {/* Header Language Switcher */}
            <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
              <button
                type="button"
                onClick={() => setLanguage("PL")}
                className={`px-3 py-1 rounded-md font-medium transition-all duration-200 cursor-pointer ${
                  language === "PL" 
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                PL
              </button>
              <button
                type="button"
                onClick={() => setLanguage("EN")}
                className={`px-3 py-1 rounded-md font-medium transition-all duration-200 cursor-pointer ${
                  language === "EN" 
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            {/* User Badging */}
            <div className="hidden sm:flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg hover:border-slate-700 transition-colors">
              <img 
                src={profile.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.email}`} 
                alt="User avatar" 
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 shrink-0"
              />
              <span className="text-sm font-medium text-slate-300 max-w-[150px] truncate">
                {profile.displayName || profile.email}
              </span>
            </div>

            {/* Logout Trigger */}
            <div className="relative">
              {showLogoutConfirm ? (
                <div className="flex items-center gap-2 bg-slate-900 px-2 py-1.5 rounded-lg border border-slate-700 shadow-lg">
                  <button
                    onClick={() => logout()}
                    className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-all cursor-pointer"
                  >
                    {t.confirm}
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md font-medium cursor-pointer transition-all"
                  >
                    {t.cancel}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-2 py-2 px-3 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-sm text-slate-400 hover:text-red-400 font-medium cursor-pointer transition-all"
                  title={t.signOut}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.signOut}</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Main Workspace Stage */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <MainForm />
      </main>

    </div>
  );
}
