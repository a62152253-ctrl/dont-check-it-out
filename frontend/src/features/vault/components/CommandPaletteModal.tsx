import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { useVaultContext } from "@/features/vault/context/useVaultContext";

export function CommandPaletteModal() {
  const {
    showCommandPalette,
    setShowCommandPalette,
    decryptedEntries,
    setSelectedEntryId,
    setViewMode,
    setSelectedCategory,
    setIsInlineEditing,
    lockVault,
    setIsFormOpen,
    setEditingId,
    setSuccessMsg,
    copyText
  } = useVaultContext();

  const [paletteQuery, setPaletteQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Toggle Command Palette with Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowCommandPalette(!showCommandPalette);
        setPaletteQuery("");
        setSelectedIndex(0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCommandPalette, setShowCommandPalette]);

  // Compute matched palette actions & secrets
  const paletteResults = useMemo(() => {
    const qLower = paletteQuery.toLowerCase();
    
    const actions = [
      { id: "action-add", type: "action", name: "Dodaj nowy sekret (New Secret)", desc: "AWS, DB, SSH, Dotenv lub Logowanie", icon: "➕" },
      { id: "action-gen", type: "action", name: "Utility: Generator haseł", desc: "Wygeneruj bezpieczny klucz/token API", icon: "🎲" },
      { id: "action-lock", type: "action", name: "Lock Vault (Zablokuj)", desc: "Natychmiast wyczyść pamięć RAM", icon: "🔒" },
      { id: "action-fav", type: "action", name: "Widok: Ulubione (Favorites)", desc: "Pokaż ulubione pozycje deweloperskie", icon: "⭐" },
      { id: "action-trash", type: "action", name: "Widok: Kosz (Trash)", desc: "Usunięte klucze i pliki", icon: "🗑️" },
      { id: "action-all", type: "action", name: "Widok: Wszystkie wpisy", desc: "Powróć do pełnej listy", icon: "📂" }
    ];

    const matchedActions = actions.filter(act => 
      act.name.toLowerCase().includes(qLower) || 
      act.desc.toLowerCase().includes(qLower)
    );

    const matchedEntries = decryptedEntries.filter(e => 
      !e.isTrash && (
        e.name.toLowerCase().includes(qLower) || 
        (e.project && e.project.toLowerCase().includes(qLower)) ||
        (e.environment && e.environment.toLowerCase().includes(qLower)) ||
        (e.username && e.username.toLowerCase().includes(qLower))
      )
    ).map(e => ({
      id: `secret-${e.id}`,
      type: "entry",
      entry: e,
      name: e.name,
      desc: `${e.category} • ${e.project || "Brak projektu"} • ${e.environment || "Wszystkie"}`,
      icon: "🔑"
    }));

    return [...matchedActions, ...matchedEntries];
  }, [decryptedEntries, paletteQuery]);

  const handleExecutePaletteAction = (actionItem: any) => {
    if (actionItem.type === "action") {
      if (actionItem.id === "action-add") {
        setEditingId(null);
        setIsFormOpen(true);
      } else if (actionItem.id === "action-gen") {
        setViewMode("generator");
      } else if (actionItem.id === "action-lock") {
        lockVault();
      } else if (actionItem.id === "action-fav") {
        setViewMode("favorites");
        setSelectedCategory("All");
      } else if (actionItem.id === "action-trash") {
        setViewMode("trash");
        setSelectedCategory("All");
      } else if (actionItem.id === "action-all") {
        setViewMode("all");
        setSelectedCategory("All");
      }
    } else if (actionItem.type === "entry") {
      const entry = actionItem.entry;
      setSelectedEntryId(entry.id);
      setIsInlineEditing(false);
      
      const copyVal = entry.password || (entry.developerFields?.awsSecretAccessKey) || (entry.developerFields?.dotenvContent) || "";
      if (copyVal) {
        copyText(copyVal, entry.id!, "pass");
        setSuccessMsg(`Wybrano i skopiowano sekret dla: ${entry.name}`);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    }
    setShowCommandPalette(false);
    setPaletteQuery("");
  };

  // Keyboard navigation inside palette
  useEffect(() => {
    if (!showCommandPalette) return;
    const handlePaletteKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (paletteResults.length > 0 ? (prev + 1) % paletteResults.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (paletteResults.length > 0 ? (prev - 1 + paletteResults.length) % paletteResults.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (paletteResults[selectedIndex]) {
          handleExecutePaletteAction(paletteResults[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener("keydown", handlePaletteKeys);
    return () => window.removeEventListener("keydown", handlePaletteKeys);
  }, [showCommandPalette, selectedIndex, paletteResults]);

  if (!showCommandPalette) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4 cursor-pointer"
      onClick={() => setShowCommandPalette(false)}
    >
      <div 
        className="bg-[#0a0a0a]/95 border border-white/10 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden cursor-default relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        
        <div className="flex items-center border-b border-white/10 p-3.5 gap-2.5 bg-white/[0.01]">
          <Search className="w-5 h-5 text-slate-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={paletteQuery}
            onChange={(e) => {
              setPaletteQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Szukaj akcji lub sekretów deweloperskich..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder-slate-600 font-mono"
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto p-1.5 space-y-0.5">
          {paletteResults.length === 0 ? (
            <div className="p-4 text-center text-xs font-mono text-slate-500">
              Brak dopasowań dla zapytania
            </div>
          ) : (
            paletteResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleExecutePaletteAction(item)}
                  className={`w-full flex items-center justify-between p-2.5 rounded text-left font-mono text-xs transition-colors cursor-pointer ${
                    isSelected ? "bg-white text-black font-semibold" : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-base shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <p className={`truncate ${isSelected ? "text-black" : "text-white"}`}>{item.name}</p>
                      <p className={`text-[10px] truncate mt-0.5 ${isSelected ? "text-black/60" : "text-slate-500"}`}>{item.desc}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-[9px] bg-black/10 text-black px-1.5 py-0.5 rounded font-bold uppercase shrink-0">Enter</span>
                  )}
                </button>
              );
            })
          )}
        </div>
        
        <div className="border-t border-white/5 p-2 px-3 text-[9px] font-mono text-slate-600 flex justify-between shrink-0">
          <span>Nawiguj: ↑↓  •  Wybierz: Enter  •  Zamknij: Esc</span>
          <span>CipherVault Commands</span>
        </div>
      </div>
    </div>
  );
}
export default CommandPaletteModal;
