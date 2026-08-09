import React, { useMemo } from "react";
import { 
  Clock, Shield, Plus, Download, Key, Lock, Activity, 
  Sparkles, CheckCircle2, AlertCircle, LayoutDashboard, Database
} from "lucide-react";
import { useVaultContext } from "../context/VaultContext";
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
    <div className="lg:col-span-9 space-y-6">
      
      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0c0c0c]/85 p-5 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between hover:-translate-y-0.5 hover:border-white/15 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full blur-xl pointer-events-none group-hover:bg-white/[0.02] transition-colors" />
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Total Secrets</span>
            <h3 className="text-3xl font-display font-semibold text-white mt-1.5">{stats.total}</h3>
          </div>
          <p className="text-[9px] font-mono text-slate-500 mt-4">Wszystkie aktywne klucze i hasła</p>
        </div>

        <div className="bg-[#0c0c0c]/85 p-5 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between hover:-translate-y-0.5 hover:border-blue-500/25 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/[0.01] rounded-full blur-xl pointer-events-none group-hover:bg-blue-500/[0.02] transition-colors" />
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">Categories</span>
            <h3 className="text-3xl font-display font-semibold text-blue-400 mt-1.5">{stats.categoriesCount}</h3>
          </div>
          <p className="text-[9px] font-mono text-slate-500 mt-4">Aktywne grupy i typy sekretów</p>
        </div>

        <div className="bg-[#0c0c0c]/85 p-5 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between hover:-translate-y-0.5 hover:border-amber-500/25 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.01] rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/[0.02] transition-colors" />
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">Recently Added</span>
            <h3 className="text-3xl font-display font-semibold text-amber-400 mt-1.5">{stats.recentlyAdded}</h3>
          </div>
          <p className="text-[9px] font-mono text-slate-500 mt-4">Wpisy dodane w ciągu 30 dni</p>
        </div>

        <div className="bg-[#0c0c0c]/85 p-5 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between hover:-translate-y-0.5 hover:border-rose-500/25 transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/[0.01] rounded-full blur-xl pointer-events-none group-hover:bg-rose-500/[0.02] transition-colors" />
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">Favorites</span>
            <h3 className="text-3xl font-display font-semibold text-rose-400 mt-1.5">{stats.favorites}</h3>
          </div>
          <p className="text-[9px] font-mono text-slate-500 mt-4">Oznaczone jako ulubione dewelopera</p>
        </div>
      </div>

      {/* Main Bento Body */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column (md:col-span-7) */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Recently Used */}
          <div className="bg-[#0c0c0c] border border-white/5 rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Recently Opened / Ostatnio używane</h4>
            </div>
            {recentlyOpenedSecrets.length === 0 ? (
              <div className="py-8 text-center text-slate-500 font-mono text-xs">
                <Key className="w-5 h-5 text-slate-800 mx-auto mb-1.5" />
                <span>Brak ostatnio otwieranych wpisów w tej sesji</span>
              </div>
            ) : (
              <div className="space-y-2">
                {recentlyOpenedSecrets.map(secret => (
                  <button
                    key={secret.id}
                    onClick={() => {
                      setViewMode("all");
                      setSelectedCategory("All");
                      setSelectedEntryId(secret.id!);
                    }}
                    className="w-full flex items-center justify-between p-3 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-lg hover:bg-white/[0.03] transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded text-slate-400 group-hover:text-white transition-colors">
                        {getCategoryIcon(mapLegacyCategory(secret.category))}
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">{secret.name}</h5>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {secret.category} {secret.project ? `• ${secret.project}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {secret.updatedAt ? formatTimeAgo(secret.updatedAt) : "Niedawno"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Security Overview */}
          <div className="bg-[#0c0c0c] border border-white/5 rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Security Overview / Audyt bezpieczeństwa</h4>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-mono font-bold text-slate-400">Security Status</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-light text-white">{securityScore}%</span>
                    <span className="text-[10px] text-slate-500 font-mono">ocena</span>
                  </div>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="flex items-center gap-1 font-mono text-[10px] tracking-tight">
                  <span className="text-slate-500 mr-1">Rating:</span>
                  {Array.from({ length: 10 }).map((_, i) => {
                    const isActive = i < Math.round(securityScore / 10);
                    return (
                      <span key={i} className={isActive ? (securityScore >= 80 ? "text-emerald-500" : securityScore >= 50 ? "text-amber-500" : "text-rose-500") : "text-slate-800"}>
                        █
                      </span>
                    );
                  })}
                </div>

                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full transition-all duration-700 ${
                      securityScore >= 80 ? "bg-emerald-500" : securityScore >= 50 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${securityScore}%` }}
                  />
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
        <div className="md:col-span-5 space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-[#0c0c0c] border border-white/5 rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Quick Actions / Szybkie akcje</h4>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setEditingId(null);
                  setIsFormOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-sm rounded-lg transition-all shadow-lg hover:shadow-emerald-500/10 cursor-pointer text-center"
              >
                <Plus className="w-5 h-5 text-black" />
                Dodaj Sekret
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setViewMode("generator")}
                  className="flex flex-col items-center justify-center p-3.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-all border border-white/5 gap-2 text-xs font-mono cursor-pointer"
                >
                  <Download className="w-4 h-4 text-blue-400 rotate-180" />
                  <span>Import Vault</span>
                </button>

                <button
                  onClick={() => setViewMode("generator")}
                  className="flex flex-col items-center justify-center p-3.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-all border border-white/5 gap-2 text-xs font-mono cursor-pointer"
                >
                  <Key className="w-4 h-4 text-emerald-400" />
                  <span>Generate Key</span>
                </button>
              </div>

              <button
                onClick={lockVault}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-mono text-[10px] uppercase border border-rose-500/20 rounded-lg transition-all cursor-pointer mt-1"
              >
                <Lock className="w-3.5 h-3.5" />
                Lock Vault (Zablokuj RAM)
              </button>
            </div>
          </div>

          {/* Vault Activity */}
          <div className="bg-[#0c0c0c] border border-white/5 rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Activity className="w-4 h-4 text-slate-500" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Vault Activity / Dziennik zdarzeń</h4>
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
