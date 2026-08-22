import React from "react";
import {
  Terminal, Plus, Lock, Search, Sparkles, Download,
  LayoutDashboard, Key, ShieldAlert, Settings, Activity, ShieldCheck, CheckCircle2, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useVault } from "../../vault/hooks/useVault";
import { VaultProvider } from "../../vault/context/VaultContext";
import VaultErrorBoundary from "../../vault/components/VaultErrorBoundary";
import VaultSetup from "../../vault/components/VaultSetup";
import VaultUnlock from "../../vault/components/VaultUnlock";
import DashboardView from "../../vault/components/DashboardView";
import GeneratorView from "../../vault/components/GeneratorView";
import SecurityView from "../../vault/components/SecurityView";
import SettingsView from "../../vault/components/SettingsView";
import SecretList from "../../vault/components/SecretList";
import SecretInspector from "../../vault/components/SecretInspector";
import SecretFormModal from "../../vault/components/SecretFormModal";
import CommandPaletteModal from "../../vault/components/CommandPaletteModal";
import MainFormQuickActions from "./MainForm/MainFormQuickActions";
import MainFormSidebar from "./MainForm/MainFormSidebar";

export default function MainForm() {
  const vault = useVault();
  const {
    loading,
    initialized,
    unlocked,
    language,
    error,
    successMsg,
    viewMode,
    setViewMode,
    setSelectedCategory,
    decryptedEntries,
    setIsFormOpen,
    setEditingId,
    setShowCommandPalette,
    lockVault,
    resetVault
  } = vault;

  // 1. Loading Gateway
  if (loading && !initialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] text-slate-300">
        <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full mb-3" />
        <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
          {language === "PL" ? "ŁADOWANIE OBSZARU ROBOCZEGO..." : "LOADING SECURE WORKSPACE..."}
        </span>
      </div>
    );
  }

  // 2. Vault Onboarding / Setup
  if (!initialized) {
    return (
      <VaultSetup
        onInitialize={vault.initializeVault}
        error={error}
        loading={loading}
        language={language}
      />
    );
  }

  // 3. Locked Vault Screen
  if (!unlocked) {
    return (
      <VaultUnlock
        onUnlock={vault.unlockVault}
        onReset={resetVault}
        error={error}
        loading={loading}
        language={language}
      />
    );
  }

  // 4. Main Active View render
  const renderActiveView = () => {
    switch (viewMode) {
      case "dashboard":
        return <DashboardView />;
      case "generator":
        return <GeneratorView />;
      case "security":
        return <SecurityView />;
      case "settings":
      case "activity":
        return <SettingsView />;
      default:
        // "all", "favorites", "trash" view modes
        return (
          <>
            <SecretList />
            <SecretInspector />
          </>
        );
    }
  };

  return (
    <VaultProvider value={vault}>
      <VaultErrorBoundary>
        <div className="space-y-8" id="developer-vault-workspace">

          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-light text-white tracking-tight">The Zero-Knowledge Vault for Developers</h2>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-slate-400 text-xs">
                  Szyfrowany w locie AES-GCM-256 • Lokalne deszyfrowanie RAM
                </span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded">
                  Zabezpieczony
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setEditingId(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center gap-2 py-2 px-3.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg transition-all shadow-lg shadow-emerald-500/5 cursor-pointer border-0"
              >
                <Plus className="w-4 h-4" />
                Dodaj Sekret
              </button>

              <button
                onClick={lockVault}
                className="flex items-center gap-2 py-2 px-3.5 text-xs font-semibold bg-white/5 hover:bg-white/10 text-rose-400 hover:text-rose-300 rounded-lg transition-all border border-white/5 cursor-pointer"
                title="Wyczyść RAM i zablokuj"
              >
                <Lock className="w-3.5 h-3.5" />
                Zablokuj
              </button>
            </div>
          </div>

          {/* Success/Error Alerts */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3.5 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-emerald-300 text-xs font-mono flex items-center gap-2.5 shadow-xl"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3.5 bg-red-950/20 border border-red-900/40 rounded-lg text-red-300 text-xs font-mono flex items-center gap-2.5 shadow-xl"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Actions Bar */}
          <MainFormQuickActions
            setEditingId={setEditingId}
            setIsFormOpen={setIsFormOpen}
            setShowCommandPalette={setShowCommandPalette}
            setViewMode={setViewMode}
          />

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* Sidebar Navigation */}
            <MainFormSidebar
              viewMode={viewMode}
              setViewMode={setViewMode}
              setSelectedCategory={setSelectedCategory}
              decryptedEntries={decryptedEntries}
              lockVault={lockVault}
            />

            {/* Render Tab Panel */}
            {renderActiveView()}

          </div>

          {/* Form Modal popup overlay */}
          <SecretFormModal />

          {/* Command Palette Ctrl+K popup */}
          <CommandPaletteModal />

        </div>
      </VaultErrorBoundary>
    </VaultProvider>
  );
}
