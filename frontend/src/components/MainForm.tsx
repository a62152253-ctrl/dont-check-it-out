import React from "react";
import { 
  Terminal, Plus, Lock, Search, Sparkles, Download, 
  LayoutDashboard, Key, ShieldAlert, Settings, Activity, ShieldCheck, CheckCircle2, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useVault } from "../features/vault/hooks/useVault";
import { VaultProvider } from "../features/vault/context/VaultContext";
import VaultErrorBoundary from "../features/vault/components/VaultErrorBoundary";
import VaultSetup from "../features/vault/components/VaultSetup";
import VaultUnlock from "../features/vault/components/VaultUnlock";
import DashboardView from "../features/vault/components/DashboardView";
import GeneratorView from "../features/vault/components/GeneratorView";
import SecurityView from "../features/vault/components/SecurityView";
import SettingsView from "../features/vault/components/SettingsView";
import SecretList from "../features/vault/components/SecretList";
import SecretInspector from "../features/vault/components/SecretInspector";
import SecretFormModal from "../features/vault/components/SecretFormModal";
import CommandPaletteModal from "../features/vault/components/CommandPaletteModal";

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
        <span className="text-xs  tracking-widest text-slate-500 uppercase">
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
                <Terminal className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-light text-white tracking-tight">The Zero-Knowledge Vault for Developers</h2>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-slate-400 text-xs">
                  Szyfrowany w locie AES-GCM-256 • Lokalne deszyfrowanie RAM
                </span>
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
                <span className="text-[10px]  uppercase bg-indigo-600/10 text-indigo-400 border border-emerald-500/10 px-2 py-0.5 rounded">
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
                className="flex items-center gap-2 py-2 px-3.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/10 cursor-pointer border-0"
              >
                <Plus className="w-4 h-4" />
                Dodaj Sekret
              </button>

              <button
                onClick={lockVault}
                className="flex items-center gap-2 py-2 px-3.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 rounded-lg transition-all border border-slate-800 cursor-pointer"
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
                className="p-3.5 bg-indigo-950/30 border border-indigo-900/50 rounded-lg text-indigo-300 text-xs  flex items-center gap-2.5 shadow-xl"
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3.5 bg-red-950/20 border border-red-900/40 rounded-lg text-red-300 text-xs  flex items-center gap-2.5 shadow-xl"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Actions Bar */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex flex-wrap gap-3 items-center justify-between text-xs  shadow-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="font-bold text-slate-400 uppercase tracking-wide text-xs">Szybkie Akcje Sejfu / Quick Actions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setEditingId(null);
                  setIsFormOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 rounded border border-slate-800 transition-all flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Secret</span>
              </button>
              
              <button
                onClick={() => {
                  setShowCommandPalette(true);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-800 transition-all flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
                <kbd className="bg-slate-950 px-1 py-0.5 rounded text-[8px] text-slate-400 font-semibold border border-slate-800">Ctrl+K</kbd>
              </button>

              <button
                onClick={() => {
                  setViewMode("generator");
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 rounded border border-slate-800 transition-all flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Token</span>
              </button>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 text-white border-b border-slate-800 pb-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <h4 className="text-xs  font-bold uppercase tracking-wide text-slate-400">Nawigacja Sejfu</h4>
                </div>

                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => { setViewMode("dashboard"); setSelectedCategory("All"); }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer border-0 ${
                      viewMode === "dashboard"
                        ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20"
                        : "bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Pulpit (Dashboard)</span>
                  </button>

                  <button
                    onClick={() => { setViewMode("all"); setSelectedCategory("All"); }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer border-0 ${
                      (viewMode === "all" || viewMode === "favorites" || viewMode === "trash")
                        ? "bg-white text-slate-900 font-semibold shadow-md"
                        : "bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Key className="w-4 h-4" />
                      <span>Klucze i Hasła</span>
                    </div>
                    <span className={`text-[10px]  font-bold px-1.5 py-0.5 rounded ${
                      (viewMode === "all" || viewMode === "favorites" || viewMode === "trash") ? "bg-indigo-500/20 text-white" : "bg-slate-800 text-slate-500"
                    }`}>
                      {decryptedEntries.filter(e => !e.isTrash).length}
                    </span>
                  </button>

                  <button
                    onClick={() => { setViewMode("generator"); }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer border-0 ${
                      viewMode === "generator"
                        ? "bg-slate-800 text-blue-400 border border-slate-700 font-bold"
                        : "bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Generator i Import</span>
                  </button>

                  <button
                    onClick={() => { setViewMode("security"); setSelectedCategory("All"); }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer border-0 ${
                      viewMode === "security"
                        ? "bg-slate-800 text-indigo-400 border border-slate-700 font-bold"
                        : "bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Audyt Centrum</span>
                    </div>
                  </button>

                  <button
                    onClick={() => { setViewMode("settings"); setSelectedCategory("All"); }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer border-0 ${
                      (viewMode === "settings" || viewMode === "activity")
                        ? "bg-slate-800 text-white border border-slate-700 font-bold"
                        : "bg-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Ustawienia i Logi</span>
                  </button>
                </div>
                
                <div className="border-t border-slate-800 pt-3">
                  <button
                    type="button"
                    onClick={lockVault}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-md transition-all cursor-pointer uppercase text-[10px] font-bold"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Zablokuj Sejf
                  </button>
                </div>
              </div>
            </div>

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
