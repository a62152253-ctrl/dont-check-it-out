import React from "react";
import { RefreshCw } from "lucide-react";
import { useVaultContext } from "../../context/useVaultContext";
import { DecryptedSecret } from "../../types";
import { CopyButton } from "./CopyButton";

export function DotenvCategory({ secret }: { secret: DecryptedSecret }) {
  const { setSuccessMsg } = useVaultContext();
  if (!secret.developerFields) return null;

  const handleDownloadDotenv = () => {
    const content = secret.developerFields?.dotenvContent;
    if (!content) return;
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${secret.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.env`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setSuccessMsg("Plik .env wygenerowany i pobrany pomyślnie!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-3">
      <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative max-h-[160px] overflow-y-auto">
        <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Zawartość Konfiguracji / Dotenv</span>
        <pre className="text-[10px] font-mono text-emerald-400 select-all whitespace-pre-wrap leading-relaxed mt-1 break-all pr-6 select-all">
          {secret.developerFields.dotenvContent || "Brak danych .env"}
        </pre>
        <div className="absolute right-2 top-2.5">
          <CopyButton textToCopy={secret.developerFields.dotenvContent || ""} secretId={secret.id!} fieldId="dotenv" />
        </div>
      </div>
      <button onClick={handleDownloadDotenv} className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 font-semibold font-mono text-[10px] rounded transition-all cursor-pointer flex items-center justify-center gap-1.5">
        <RefreshCw className="w-3.5 h-3.5 rotate-180" />
        <span>Pobierz jako plik .env</span>
      </button>
    </div>
  );
}
