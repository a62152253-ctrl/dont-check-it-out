import React, { useMemo } from "react";
import { Search, Command, Lock, Star, Copy, Check } from "lucide-react";
import { useVaultContext } from "../context/useVaultContext";
import { getCategoryIcon } from "../utils/categoryIcon";
import { formatTimeAgo } from "../utils/timeAgo";
import { mapLegacyCategory } from "../hooks/useVault";
import type { DecryptedSecret } from "shared";

export function SecretList() {
  const {
    decryptedEntries,
    isDecryptingEntries,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode,
    selectedEntryId,
    setSelectedEntryId,
    setIsInlineEditing,
    recentlyOpenedIds,
    copiedId,
    copiedField,
    copyText
  } = useVaultContext();

  const filteredDecryptedEntries = useMemo(() => {
    return decryptedEntries.filter(entry => {
      const queryLower = searchQuery.toLowerCase();
      const matchesSearch = 
        entry.name.toLowerCase().includes(queryLower) ||
        (entry.username && entry.username.toLowerCase().includes(queryLower)) ||
        (entry.notes && entry.notes.toLowerCase().includes(queryLower)) ||
        (entry.project && entry.project.toLowerCase().includes(queryLower)) ||
        (entry.environment && entry.environment.toLowerCase().includes(queryLower));
      
      const matchesCategory = selectedCategory === "All" || entry.category === selectedCategory;

      let matchesViewMode = false;
      if (viewMode === "all") {
        matchesViewMode = !entry.isTrash;
      } else if (viewMode === "favorites") {
        matchesViewMode = !entry.isTrash && !!entry.isFavorite;
      } else if (viewMode === "trash") {
        matchesViewMode = !!entry.isTrash;
      }

      return matchesSearch && matchesCategory && matchesViewMode;
    });
  }, [decryptedEntries, searchQuery, selectedCategory, viewMode]);

  const recentlyOpenedSecrets = useMemo(() => {
    return recentlyOpenedIds
      .map(id => decryptedEntries.find(e => e.id === id))
      .filter((e): e is DecryptedSecret => !!e && !e.isTrash)
      .slice(0, 5);
  }, [recentlyOpenedIds, decryptedEntries]);

  return (
    <div className="lg:col-span-5 space-y-4">
      {/* Sleek Horizontal Category Filters Bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
        {[
          { label: "Wszystkie", view: "all", cat: "All", icon: "🔑" },
          { label: "Ulubione", view: "favorites", cat: "All", icon: "⭐" },
          { label: "AWS", view: "all", cat: "AWS", icon: "☁️" },
          { label: "Bazy (SQL)", view: "all", cat: "Database", icon: "🗄️" },
          { label: "SSH", view: "all", cat: "SSH Keys", icon: "🔒" },
          { label: "Dotenv", view: "all", cat: "API Keys", icon: "📄" },
          { label: "Web", view: "all", cat: "Websites", icon: "🌐" },
          { label: "Inne", view: "all", cat: "Notes", icon: "📦" },
          { label: "Kosz", view: "trash", cat: "All", icon: "🗑️" },
        ].map((item) => {
          const isActive = viewMode === item.view && selectedCategory === item.cat;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setViewMode(item.view as any);
                setSelectedCategory(item.cat);
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-medium transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                isActive
                  ? "bg-white text-black border-white font-bold"
                  : "bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Real-time Filter inputs */}
      <div className="bg-[#0c0c0c] p-3 rounded-lg border border-white/5 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj (np. aws prod, staging, payments)..."
            className="w-full pl-9 pr-4 py-2 bg-[#121212] border border-white/10 hover:border-white/20 focus:border-white/30 rounded-lg outline-none text-xs transition-all text-white placeholder-slate-500 font-mono"
          />
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-mono text-slate-400 shrink-0 bg-white/5 px-2 py-1.5 rounded border border-white/5">
          <Command className="w-3 h-3 text-slate-500" />
          <kbd className="bg-black/40 px-1 py-0.5 rounded text-[8px] text-white">Ctrl+K</kbd>
          <span>Szukaj</span>
        </div>
      </div>

      {/* List display */}
      <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
        {isDecryptingEntries ? (
          <div className="bg-[#0f0f0f] border border-white/10 rounded-lg py-12 flex flex-col items-center justify-center text-slate-400">
            <div className="animate-spin h-5 w-5 border border-white border-t-transparent rounded-full mb-3" />
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">WebCrypto AES-GCM deszyfracja w toku...</span>
          </div>
        ) : filteredDecryptedEntries.length === 0 ? (
          <div className="bg-[#0f0f0f] border border-white/10 rounded-lg py-12 text-center text-slate-400">
            <Lock className="w-6 h-6 text-slate-700 mx-auto mb-2" />
            <p className="text-xs font-semibold">Brak sekretów pasujących do filtra</p>
            <p className="text-[10px] text-slate-500 mt-1">Stwórz nowy wpis deweloperski klikając "Dodaj sekret".</p>
          </div>
        ) : (
          filteredDecryptedEntries.map((secret) => {
            const isSelected = selectedEntryId === secret.id;
            const hasStrongValue = secret.password || (secret.developerFields?.awsSecretAccessKey) || "";

            return (
              <div
                key={secret.id}
                onClick={() => {
                  setSelectedEntryId(secret.id || null);
                  setIsInlineEditing(false);
                }}
                className={`group relative text-left w-full p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-white text-black shadow-xl shadow-white/5 border-white"
                    : "bg-[#0c0c0c]/80 border-white/5 hover:border-emerald-500/30 text-white hover:bg-[#0c0c0c] hover:shadow-[0_0_15px_rgba(16,185,129,0.03)]"
                }`}
              >
                <div className="min-w-0 flex-1 flex items-center gap-3">
                  <div className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center shrink-0 border transition-colors duration-200 ${
                    isSelected 
                      ? "bg-black/5 border-black/10 text-black" 
                      : "bg-white/[0.02] border-white/5 text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-500/20"
                  }`}>
                    {getCategoryIcon(mapLegacyCategory(secret.category))}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-xs truncate max-w-[140px]">{secret.name}</span>
                      {secret.isFavorite && (
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                      )}
                      {secret.environment && (
                        <span className={`text-[8px] font-mono px-1 py-0.5 rounded border uppercase font-semibold ${
                          secret.environment === "production" 
                            ? (isSelected ? "bg-red-500/10 border-red-500/20 text-red-600" : "bg-red-500/10 border-red-500/10 text-red-400")
                            : (isSelected ? "bg-blue-500/10 border-blue-500/20 text-blue-600" : "bg-blue-500/10 border-blue-500/10 text-blue-400")
                        }`}>
                          {secret.environment}
                        </span>
                      )}
                    </div>

                    <div className={`text-[9px] font-mono mt-1.5 space-y-0.5 ${isSelected ? "text-black/70" : "text-slate-500"}`}>
                      <p className="truncate">
                        {secret.project ? `project: ${secret.project}` : "project: unassigned"}
                      </p>
                      <div className="flex gap-2 flex-wrap items-center">
                        <span>Edytowano: {secret.updatedAt ? formatTimeAgo(secret.updatedAt) : "Niedawno"}</span>
                        <span className="flex items-center gap-1">
                          <span className={`w-1 h-1 rounded-full ${recentlyOpenedSecrets.some(r => r.id === secret.id) ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
                          {recentlyOpenedSecrets.some(r => r.id === secret.id) ? "Użyto: Dzisiaj" : "Użyto: Niedawno"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Copier & actions block */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
                    {hasStrongValue && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyText(hasStrongValue, secret.id || "", "pass");
                        }}
                        className={`p-1.5 rounded transition-all ${
                          isSelected ? "hover:bg-black/10 text-black" : "hover:bg-white/10 text-slate-400 hover:text-white"
                        }`}
                        title="Skopiuj hasło / klucz"
                      >
                        {copiedId === secret.id && copiedField === "pass" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {secret.isLegacy && (
                    <span className="text-[8px] font-mono uppercase font-bold bg-amber-500/20 text-amber-400 border border-amber-500/10 px-1 py-0.5 rounded">
                      Legacy Plain
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
export default SecretList;
