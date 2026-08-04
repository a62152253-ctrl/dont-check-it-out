import React, { useRef } from "react";
import { Download } from "lucide-react";
import { useVaultContext } from '../../context/useVaultContext';

export function JsonImporter() {
  const { importVault, language } = useVaultContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const data = JSON.parse(text);
        await importVault(data);
      } catch (err) {
        console.error(err);
        alert(language === "PL" ? "Nie udało się zaimportować pliku JSON." : "Failed to import JSON file.");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-[#0c0c0c] border border-white/5 rounded-xl p-6 space-y-4 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
      
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <Download className="w-4 h-4 text-blue-400 shrink-0 rotate-180" />
        <h4 className="text-xs font-bold uppercase text-slate-300 font-mono tracking-wider">
          {language === "PL" ? "Import Kopii Zapasowej JSON" : "Import JSON Backup"}
        </h4>
      </div>

      <div className="space-y-4 text-xs font-mono text-slate-400">
        <p className="leading-relaxed text-[11px]">
          {language === "PL" 
            ? "Przywróć hasła i klucze z pliku eksportu JSON. Wszystkie wpisy zostaną ponownie zabezpieczone Twoim hasłem głównym przed wysłaniem do chmury." 
            : "Restore passwords and keys from a JSON export file. All records are re-secured with your master password locally."}
        </p>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/10 hover:border-emerald-500/30 rounded-xl p-6 text-center cursor-pointer hover:bg-white/[0.01] transition-all group"
        >
          <Download className="w-6 h-6 text-slate-500 mx-auto mb-2 group-hover:text-emerald-400 transition-colors rotate-180" />
          <p className="text-white text-xs font-semibold">
            {language === "PL" ? "Kliknij aby wybrać plik JSON" : "Click to select JSON file"}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">developer-vault-backup.json</p>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".json" 
          className="hidden" 
        />
      </div>
    </div>
  );
}
export default JsonImporter;
