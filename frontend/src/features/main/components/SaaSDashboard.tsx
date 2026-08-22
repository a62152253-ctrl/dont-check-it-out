import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import MainForm from "./MainForm";
import { translations } from "../../../lib/translations";
import SaaSDashboardHeader from "./SaaSDashboard/SaaSDashboardHeader";

export default function SaasDashboard() {
  const {
    profile,
    logout,
    language,
    setLanguage
  } = useAuth();

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

      <SaaSDashboardHeader
        profile={profile}
        language={language}
        setLanguage={setLanguage}
        logout={logout}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        <MainForm />
      </main>

      {/* Footer minimal info */}
      <footer className="py-6 border-t border-white/5 mt-auto bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-500">
          <p>© {new Date().getFullYear()} Ciphervault Labs. Military-grade zero-knowledge encryption.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-emerald-400 transition-colors">v2.1.0</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Security Audit</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
