import React from "react";
import { Database, Eye, EyeOff } from "lucide-react";
import { useVaultContext } from "../../context/useVaultContext";
import { DecryptedSecret } from "../../types";

export function DbCategory({ secret }: { secret: DecryptedSecret }) {
  const { visiblePasswords, setVisiblePasswords, setSuccessMsg } = useVaultContext();
  if (!secret.developerFields) return null;
  const isPassVisible = !!visiblePasswords[secret.id || ""];

  const handleCopyDbUri = () => {
    const f = secret.developerFields!;
    const engine = (f.dbEngine || "postgresql").toLowerCase();
    const uri = `${engine}://${f.dbUser || ""}:${f.dbPassword || ""}@${f.dbHost || "localhost"}:${f.dbPort || "5432"}/${f.dbName || ""}`;
    navigator.clipboard.writeText(uri);
    setSuccessMsg("Skopiowano URI połączenia bazy danych!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-3 gap-1.5">
        <div className="bg-[#121212] border border-white/5 p-1.5 rounded col-span-1">
          <span className="block text-[8px] font-mono text-slate-500 uppercase">Silnik</span>
          <span className="text-[11px] font-mono text-sky-400 font-bold">{secret.developerFields.dbEngine || "PostgreSQL"}</span>
        </div>
        <div className="bg-[#121212] border border-white/5 p-1.5 rounded col-span-2">
          <span className="block text-[8px] font-mono text-slate-500 uppercase">Host</span>
          <span className="text-[11px] font-mono text-slate-300 truncate block select-all">{secret.developerFields.dbHost || "localhost"}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        <div className="bg-[#121212] border border-white/5 p-1.5 rounded col-span-1">
          <span className="block text-[8px] font-mono text-slate-500 uppercase">Port</span>
          <span className="text-[11px] font-mono text-slate-300">{secret.developerFields.dbPort || "5432"}</span>
        </div>
        <div className="bg-[#121212] border border-white/5 p-1.5 rounded col-span-2">
          <span className="block text-[8px] font-mono text-slate-500 uppercase">Nazwa Bazy</span>
          <span className="text-[11px] font-mono text-slate-300 truncate block select-all">{secret.developerFields.dbName || "postgres"}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <div className="bg-[#121212] border border-white/5 p-2 rounded">
          <span className="block text-[8px] font-mono text-slate-500 uppercase">Użytkownik</span>
          <span className="text-[11px] font-mono text-slate-300 truncate block select-all">{secret.developerFields.dbUser || "Brak"}</span>
        </div>
        <div className="bg-[#121212] border border-white/5 p-2 rounded relative">
          <span className="block text-[8px] font-mono text-slate-500 uppercase">Hasło DB</span>
          <span className="text-[11px] font-mono text-slate-300 truncate block">
            {isPassVisible ? secret.developerFields.dbPassword : "••••••••••"}
          </span>
          <button onClick={() => setVisiblePasswords(p => ({ ...p, [secret.id!]: !p[secret.id!] }))} className="absolute right-2 top-2.5 text-slate-500 hover:text-white cursor-pointer">
            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      <button onClick={handleCopyDbUri} className="w-full py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-300 font-semibold font-mono text-[10px] rounded transition-all cursor-pointer flex items-center justify-center gap-1.5">
        <Database className="w-3.5 h-3.5" />
        <span>Kopiuj Connection String / URI</span>
      </button>
    </div>
  );
}
