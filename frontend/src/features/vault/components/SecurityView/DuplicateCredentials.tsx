import React, { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { useVaultContext } from "../../context/useVaultContext";
import { DecryptedSecret } from "../../types";

export function DuplicateCredentials() {
  const { decryptedEntries, setViewMode, setSelectedCategory, setSelectedEntryId } = useVaultContext();

  const duplicateGroups = useMemo(() => {
    const active = decryptedEntries.filter(e => !e.isTrash);
    const groups: Record<string, DecryptedSecret[]> = {};
    
    active.forEach(entry => {
      const pass = entry.password || entry.developerFields?.awsSecretAccessKey || "";
      if (pass) {
        groups[pass] = groups[pass] || [];
        groups[pass].push(entry);
      }
    });

    return Object.entries(groups).filter(([_, group]) => group.length > 1);
  }, [decryptedEntries]);

  const handleSelectEntry = (id: string) => {
    setViewMode("all");
    setSelectedCategory("All");
    setSelectedEntryId(id);
  };

  return (
    <div className="bg-[#0c0c0c] border border-white/5 rounded-lg p-5 space-y-4">
      <h4 className="text-xs font-semibold uppercase text-slate-300 font-mono border-b border-white/5 pb-2 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-400" />
        Analiza Powtarzających się Haseł / Duplicated Credentials
      </h4>
      <p className="text-[11px] font-mono text-slate-500 leading-normal">
        Używanie tego samego hasła w wielu usługach zwiększa ryzyko infekcji krzyżowej (credential stuffing). Dąż do pełnej unikalności.
      </p>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {duplicateGroups.length === 0 ? (
          <p className="text-[11px] font-mono text-emerald-400 py-2">✓ Wszystkie hasła w Twoim sejfie deweloperskim są unikalne.</p>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] font-mono text-amber-500">
              Wykryto powtórzenia wartości haseł lub kluczy dla niektórych Twoich wpisów. Rozważ wygenerowanie unikalnych wartości.
            </p>
            {duplicateGroups.map(([pass, group], idx) => (
              <div key={idx} className="p-3 bg-[#121212] border border-amber-500/10 rounded space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center border-b border-white/5 pb-1">
                  <span className="text-amber-400 font-bold uppercase text-[9px]">Współdzielone Hasło ({group.length} wpisów)</span>
                  <span className="text-slate-500 text-[10px] select-all">Hasło: {pass.substring(0, 3)}...{pass.substring(pass.length - 3)}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.map(e => (
                    <button type="button"
                      key={e.id}
                      onClick={() => handleSelectEntry(e.id!)}
                      className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-white rounded border border-white/5 cursor-pointer text-[9px] font-mono"
                    >
                      {e.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default DuplicateCredentials;
