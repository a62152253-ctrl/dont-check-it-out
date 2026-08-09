import React, { useMemo } from "react";
import { 
  Clock, Shield, Plus, Download, Key, Lock, Activity, 
  Sparkles, CheckCircle2, AlertCircle, LayoutDashboard, Database
} from "lucide-react";
import { useVaultContext } from "../context/useVaultContext";
import { getCategoryIcon } from "../utils/categoryIcon";
import { formatTimeAgo } from "../utils/timeAgo";
import { getPasswordStrength } from "../utils/passwordStrength";
import { mapLegacyCategory } from "../hooks/useVault";
import { DecryptedSecret } from "../types";

export function DashboardView() {
  const {
    decryptedEntries,
    recentlyOpenedIds,
    setViewMode,
    setSelectedCategory,
    setSelectedEntryId,
    setIsFormOpen,
    setEditingId,
    lockVault,
    activityLogs,
    theme
  } = useVaultContext();

  const importInputRef = React.useRef<HTMLInputElement>(null);

  // Statistics calculation
  const stats = useMemo(() => {
    let strongCount = 0;
    let weakCount = 0;
    let legacyCount = 0;
    const catCounts: Record<string, number> = {};
    const activeEntries = decryptedEntries.filter(e => !e.isTrash);
    const projectsSet = new Set<string>();

    activeEntries.forEach(entry => {
      if (entry.isLegacy) legacyCount++;
      if (entry.project) projectsSet.add(entry.project.toLowerCase());

      const checkPassword = entry.password || (entry.developerFields?.awsSecretAccessKey) || "";
      const strength = getPasswordStrength(checkPassword);
      if (strength.score >= 5) strongCount++;
      if (strength.score <= 2) weakCount++;
      
      const normalizedCat = mapLegacyCategory(entry.category);
      catCounts[normalizedCat] = (catCounts[normalizedCat] || 0) + 1;
    });

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentlyAddedCount = activeEntries.filter(e => {
      if (!e.createdAt) return false;
      try {
        return new Date(e.createdAt).getTime() > thirtyDaysAgo;
      } catch (e) {
        return false;
      }
    }).length;

    const favoritesCount = activeEntries.filter(e => e.isFavorite).length;

    return {
      total: activeEntries.length,
      strong: strongCount,
      weak: weakCount,
      legacy: legacyCount,
      projects: projectsSet.size,
      categories: catCounts,
      categoriesCount: Object.keys(catCounts).length,
      recentlyAdded: recentlyAddedCount,
      favorites: favoritesCount
    };
  }, [decryptedEntries]);

  const addedThisWeek = useMemo(() => {
    const active = decryptedEntries.filter(e => !e.isTrash);
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return active.filter(e => {
      if (!e.createdAt) return false;
      try {
        return new Date(e.createdAt).getTime() > sevenDaysAgo;
      } catch (e) {
        return false;
      }
    }).length;
  }, [decryptedEntries]);

  const oldSecrets180Count = useMemo(() => {
    const active = decryptedEntries.filter(e => !e.isTrash);
    const oneHundredEightyDaysAgo = Date.now() - 180 * 24 * 60 * 60 * 1000;
    return active.filter(e => {
      const dateToCheck = e.updatedAt || e.createdAt;
      if (!dateToCheck) return false;
      try {
        return new Date(dateToCheck).getTime() < oneHundredEightyDaysAgo;
      } catch (e) {
        return false;
      }
    }).length;
  }, [decryptedEntries]);

  const duplicatedCount = useMemo(() => {
    const active = decryptedEntries.filter(e => !e.isTrash);
    const passwords = active.map(e => e.password || e.developerFields?.awsSecretAccessKey || "").filter(Boolean);
    const counts: Record<string, number> = {};
    passwords.forEach(p => counts[p] = (counts[p] || 0) + 1);
    return Object.values(counts).filter(count => count > 1).reduce((acc, c) => acc + c, 0);
  }, [decryptedEntries]);

  const oldSecretsCount = useMemo(() => {
    const active = decryptedEntries.filter(e => !e.isTrash);
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    return active.filter(e => {
      if (!e.updatedAt) return false;
      try {
        return new Date(e.updatedAt).getTime() < ninetyDaysAgo;
      } catch (e) {
        return false;
      }
    }).length;
  }, [decryptedEntries]);

  const securityScore = useMemo(() => {
    if (decryptedEntries.length === 0) return 100;
    let score = 100;
    
    // Deduct points for weak passwords
    const weakPct = stats.weak / decryptedEntries.length;
    score -= Math.round(weakPct * 40);
    
    // Deduct points for legacy plain-text secrets
    const legacyPct = stats.legacy / decryptedEntries.length;
    score -= Math.round(legacyPct * 30);
    
    // Deduct points for duplicates
    if (decryptedEntries.length > 0) {
      const dupPct = duplicatedCount / decryptedEntries.length;
      score -= Math.round(dupPct * 20);
    }
    
    return Math.max(25, Math.min(100, score));
  }, [decryptedEntries, stats, duplicatedCount]);

  const recentlyOpenedSecrets = useMemo(() => {
    return recentlyOpenedIds
      .map(id => decryptedEntries.find(e => e.id === id))
      .filter((e): e is DecryptedSecret => !!e && !e.isTrash)
      .slice(0, 5);
  }, [recentlyOpenedIds, decryptedEntries]);

  return (
    <div className="lg:col-span-9 space-y-8">
      
      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/[0.02] backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between hover:-translate-y-1 hover:border-white/20 transition-all duration-500 relative group overflow-hidden">
          <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/[0.02] rounded-full blur-2xl pointer-events-none group-hover:bg-white/[0.04] transition-colors duration-500" />
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Total Secrets</span>
            <h3 className="text-5xl font-display font-light text-white mt-2 tracking-tight group-hover:scale-105 origin-left transition-transform duration-500">{stats.total}</h3>
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-6">Wszystkie aktywne klucze i hasła</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-500 relative group overflow-hidden">
          <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-blue-500/[0.02] rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/[0.04] transition-colors duration-500" />
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400">Categories</span>
            <h3 className="text-5xl font-display font-light text-blue-400 mt-2 tracking-tight group-hover:scale-105 origin-left transition-transform duration-500">{stats.categoriesCount}</h3>
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-6">Aktywne grupy i typy sekretów</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between hover:-translate-y-1 hover:border-amber-500/30 transition-all duration-500 relative group overflow-hidden">
          <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-amber-500/[0.02] rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/[0.04] transition-colors duration-500" />
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">Recently Added</span>
            <h3 className="text-5xl font-display font-light text-amber-400 mt-2 tracking-tight group-hover:scale-105 origin-left transition-transform duration-500">{stats.recentlyAdded}</h3>
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-6">Wpisy dodane w ciągu 30 dni</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between hover:-translate-y-1 hover:border-rose-500/30 transition-all duration-500 relative group overflow-hidden">
          <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-rose-500/[0.02] rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/[0.04] transition-colors duration-500" />
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400">Favorites</span>
            <h3 className="text-5xl font-display font-light text-rose-400 mt-2 tracking-tight group-hover:scale-105 origin-left transition-transform duration-500">{stats.favorites}</h3>
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-6">Oznaczone jako ulubione dewelopera</p>
        </div>
      </div>

      {/* Main Bento Body */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column (md:col-span-7) */}
        <div className="md:col-span-7 space-y-8">
          
          {/* Recently Used */}
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Clock className="w-4 h-4 text-slate-500" />
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-300">Recently Opened / Ostatnio używane</h4>
            </div>
            {recentlyOpenedSecrets.length === 0 ? (
              <div className="py-8 text-center text-slate-500 font-mono text-xs">
                <Key className="w-5 h-5 text-slate-800 mx-auto mb-1.5" />
                <span>Brak ostatnio otwieranych wpisów w tej sesji</span>
              </div>
            ) : (
              <div className="space-y-3">
                {recentlyOpenedSecrets.map(secret => (
                  <button
                    key={secret.id}
                    onClick={() => {
                      setViewMode("all");
                      setSelectedCategory("All");
                      setSelectedEntryId(secret.id!);
                    }}
                    className="w-full flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-2xl hover:bg-white/[0.04] transition-all duration-300 text-left group hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-xl text-slate-400 group-hover:text-emerald-400 transition-colors shadow-inner">
                        {getCategoryIcon(mapLegacyCategory(secret.category))}
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{secret.name}</h5>
                        <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">
                          {secret.category} {secret.project ? `• ${secret.project}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono bg-white/5 px-2.5 py-1 rounded-full">
                      {secret.updatedAt ? formatTimeAgo(secret.updatedAt) : "Niedawno"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Security Overview */}
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-300">Security Overview / Audyt bezpieczeństwa</h4>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Security Status</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-4xl font-display font-light ${securityScore >= 80 ? 'text-emerald-400' : securityScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>{securityScore}%</span>
                    <span className="text-[10px] text-slate-500 font-mono">ocena</span>
                  </div>
                </div>
                
                {/* Refined Progress Bar */}
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                  <div 
                    className={`h-full relative rounded-full transition-all duration-1000 ease-out ${
                      securityScore >= 80 ? "bg-gradient-to-r from-emerald-600 to-emerald-400" : securityScore >= 50 ? "bg-gradient-to-r from-amber-600 to-amber-400" : "bg-gradient-to-r from-rose-600 to-rose-400"
                    }`}
                    style={{ width: `${securityScore}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" style={{ animationDuration: '2s' }} />
                  </div>
                </div>
              </div>

              {/* Security items checklist */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span className="text-emerald-500 font-bold">✓</span> Szyfrowany sejf lokalny (Encrypted Vault)
                  </span>
                  <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 px-2 py-0.5 rounded text-[9px]">
                    Zabezpieczony
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2 text-slate-400">
                    {stats.weak === 0 ? (
                      <>
                        <span className="text-emerald-500 font-bold">✓</span> Brak słabych haseł deweloperskich
                      </>
                    ) : (
                      <>
                        <span className="text-rose-500 font-bold">⚠</span> {stats.weak} słabe hasła deweloperskie
                      </>
                    )}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    stats.weak === 0 
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/10" 
                      : "text-rose-400 bg-rose-500/10 border border-rose-500/10"
                  }`}>
                    {stats.weak === 0 ? "Silne" : "Słabe hasła"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2 text-slate-400">
                    {duplicatedCount === 0 ? (
                      <>
                        <span className="text-emerald-500 font-bold">✓</span> Wszystkie hasła są unikalne
                      </>
                    ) : (
                      <>
                        <span className="text-amber-500 font-bold">⚠</span> Wykryto {duplicatedCount} powtórzone hasła
                      </>
                    )}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    duplicatedCount === 0 
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/10" 
                      : "text-amber-400 bg-amber-500/10 border border-amber-500/10"
                  }`}>
                    {duplicatedCount === 0 ? "Unikalne" : "Duplikaty"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono py-1.5">
                  <span className="flex items-center gap-2 text-slate-400">
                    {oldSecretsCount === 0 ? (
                      <>
                        <span className="text-emerald-500 font-bold">✓</span> Wszystkie hasła są świeże
                      </>
                    ) : (
                      <>
                        <span className="text-slate-500 font-bold">⚠</span> {oldSecretsCount} sekretów ma ponad 90 dni
                      </>
                    )}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    oldSecretsCount === 0 
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/10" 
                      : "text-slate-500 bg-white/5 border border-white/5"
                  }`}>
                    {oldSecretsCount === 0 ? "Świeże" : "Stare hasła"}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (md:col-span-5) */}
        <div className="md:col-span-5 space-y-8">
          
          {/* Quick Actions */}
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-300">Quick Actions / Szybkie akcje</h4>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setEditingId(null);
                  setIsFormOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-2xl transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 text-center"
              >
                <Plus className="w-5 h-5 text-black" />
                Dodaj Nowy Sekret
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setViewMode("generator")}
                  className="flex flex-col items-center justify-center p-4 bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 hover:text-white rounded-2xl transition-all border border-white/5 hover:border-white/20 gap-3 text-xs font-mono shadow-inner"
                >
                  <Download className="w-5 h-5 text-blue-400 rotate-180" />
                  <span>Import Vault</span>
                </button>

                <button
                  onClick={() => setViewMode("generator")}
                  className="flex flex-col items-center justify-center p-4 bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 hover:text-white rounded-2xl transition-all border border-white/5 hover:border-white/20 gap-3 text-xs font-mono shadow-inner"
                >
                  <Key className="w-5 h-5 text-amber-400" />
                  <span>Generate Key</span>
                </button>
              </div>

              <button
                onClick={lockVault}
                className="w-full flex items-center justify-center gap-2 py-3 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-mono text-[10px] uppercase border border-rose-500/20 rounded-2xl transition-all hover:border-rose-500/40 mt-2"
              >
                <Lock className="w-3.5 h-3.5" />
                Lock Vault (Zablokuj RAM)
              </button>
            </div>
          </div>

          {/* Vault Activity */}
          <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Activity className="w-4 h-4 text-slate-500" />
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-300">Vault Activity / Dziennik zdarzeń</h4>
            </div>

            {activityLogs.length === 0 ? (
              <div className="py-8 text-center text-slate-500 font-mono text-xs">
                <Activity className="w-5 h-5 text-slate-800 mx-auto mb-1.5" />
                <span>Brak wpisów w audycie bezpieczeństwa</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {activityLogs.slice(0, 7).map((log, index) => (
                  <div key={index} className="flex items-start justify-between text-xs border-b border-white/5 pb-2.5 last:border-0 last:pb-0 font-mono">
                    <div className="space-y-0.5">
                      <p className="text-white font-medium text-[11px]">{log.action}</p>
                      <p className="text-[9px] text-slate-500 break-all leading-normal">{log.detail}</p>
                    </div>
                    <span className="text-[8px] text-slate-500 shrink-0 ml-2">
                      {formatTimeAgo(log.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
export default DashboardView;
