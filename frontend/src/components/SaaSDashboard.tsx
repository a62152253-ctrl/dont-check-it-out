import React from "react";
import { useAuth } from "../hooks/useAuth";
import MainForm from "./MainForm";
import { translations } from "../lib/translations";
import DashboardLogo from "./dashboard/DashboardLogo";
import LanguageSwitcher from "./dashboard/LanguageSwitcher";
import UserProfile from "./dashboard/UserProfile";
import LogoutButton from "./dashboard/LogoutButton";

export default function SaasDashboard() {
  const { profile, logout, language, setLanguage } = useAuth();
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
      
      <header className="sticky top-0 bg-[#080808]/70 backdrop-blur-md border-b border-white/5 px-6 py-3.5 z-30 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <DashboardLogo language={language as "PL" | "EN"} />
          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSwitcher language={language as "PL" | "EN"} setLanguage={setLanguage} />
            <UserProfile profile={profile} />
            <LogoutButton logout={logout} language={language as "PL" | "EN"} />
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <MainForm />
      </main>
    </div>
  );
}