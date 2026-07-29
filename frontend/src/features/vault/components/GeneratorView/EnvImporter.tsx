import React, { useState } from "react";
import { Terminal, RefreshCw, Lock } from "lucide-react";
import { useVaultContext } from "../../context/useVaultContext";
import { parseDotenvContent, ParsedDotenvItem } from "../../utils/dotenvParser";

export function EnvImporter() {
  const { saveSecret, language, setSuccessMsg, addActivityLog } = useVaultContext();

  const [dotenvPaste, setDotenvPaste] = useState("");
  const [parsedDotenvList, setParsedDotenvList] = useState<ParsedDotenvItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    const list = parseDotenvContent(dotenvPaste);
    setParsedDotenvList(list);
    addActivityLog("Analyzed Dotenv Paste", `Wykryto ${list.length} kluczy w formacie .env`);
  };

  const handleBatchImport = async () => {
    const selectedItems = parsedDotenvList.filter(item => item.checked);
    if (selectedItems.length === 0) return;

    setLoading(true);
    let importedCount = 0;

    try {
      for (const item of selectedItems) {
        const cat = item.category;
        const mappedCat = 
          cat === "Database" 
            ? "Database Connection" 
            : cat === "API Keys" 
              ? "Dotenv / Config" 
              : cat === "SSH Keys" 
                ? "SSH Key" 
                : cat === "AWS" 
                  ? "AWS Credentials" 
                  : "Notes";
        
        const developerFields: any = {};
        if (mappedCat === "AWS Credentials") {
          developerFields.awsAccessKeyId = item.key;
          developerFields.awsSecretAccessKey = item.val;
          developerFields.region = "us-east-1";
        } else if (mappedCat === "Database Connection") {
          developerFields.dbHost = "localhost";
          developerFields.dbPort = "5432";
          developerFields.dbUser = item.key;
          developerFields.dbPassword = item.val;
          developerFields.dbName = "production";
          developerFields.dbEngine = "PostgreSQL";
        } else if (mappedCat === "SSH Key") {
          developerFields.sshPrivateKey = item.val;
          developerFields.sshHost = "localhost";
        } else if (mappedCat === "Dotenv / Config") {
          developerFields.dotenvContent = `${item.key}=${item.val}`;
        }

        const unencryptedPayload = {
          name: `Import: ${item.key}`,
          username: item.key,
          password: item.val,
          notes: `Zaszyfrowano automatycznie z importu .env\n${item.key}=${item.val}`,
          developerFields: Object.keys(developerFields).length > 0 ? developerFields : undefined
        };

        await saveSecret(null, `Import: ${item.key}`, mappedCat, unencryptedPayload);
        importedCount++;
      }

      addActivityLog("Batch Imported Dotenv", `Pomyślnie zaimportowano ${importedCount} kluczy .env`);
      setSuccessMsg(`Pomyślnie zaimportowano ${importedCount} kluczy deweloperskich!`);
      setParsedDotenvList([]);
      setDotenvPaste("");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0c0c0c] border border-white/5 rounded-xl p-6 space-y-4 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-30" />
      
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
          <h4 className="text-xs font-bold uppercase text-slate-300 font-mono tracking-wider">
            {language === "PL" ? "Grupowy Importer Plików .env" : "Batch .env Importer"}
          </h4>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          value={dotenvPaste}
          onChange={(e) => setDotenvPaste(e.target.value)}
          placeholder={language === "PL" ? "Wklej tutaj zawartość pliku .env (np. API_KEY=sk_live_abc...)" : "Paste your .env file here (e.g. API_KEY=sk_live_abc...)"}
          className="w-full h-32 bg-[#121212] border border-white/5 rounded-lg p-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-white/20 resize-none leading-relaxed"
        />

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!dotenvPaste.trim()}
          className="w-full py-2 bg-white/5 hover:bg-white/10 text-white font-mono text-xs rounded-lg border border-white/5 hover:border-white/20 transition-all  disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{language === "PL" ? "Analizuj i Paruj Klucze .env" : "Analyze .env Keys"}</span>
        </button>
      </div>

      {parsedDotenvList.length > 0 && (
        <div className="space-y-3 border-t border-white/5 pt-4 animate-fadeIn">
          <h5 className="text-[10px] font-bold uppercase font-mono text-slate-400 tracking-wider">
            Wykryte Sekrety deweloperskie ({parsedDotenvList.length})
          </h5>
          
          <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1">
            {parsedDotenvList.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white/[0.01] border border-white/5 rounded p-2 text-[11px] font-mono">
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => {
                      const copy = [...parsedDotenvList];
                      copy[idx].checked = e.target.checked;
                      setParsedDotenvList(copy);
                    }}
                    className="accent-emerald-500 rounded shrink-0 "
                  />
                  <div className="overflow-hidden">
                    <span className="text-white font-semibold truncate block">{item.key}</span>
                    <span className="text-slate-500 truncate block text-[10px]">
                      {item.val.substring(0, 8)}... (długość: {item.val.length})
                    </span>
                  </div>
                </div>

                <select
                  value={item.category}
                  onChange={(e) => {
                    const copy = [...parsedDotenvList];
                    copy[idx].category = e.target.value;
                    setParsedDotenvList(copy);
                  }}
                  className="bg-[#121212] border border-white/5 text-[9px] text-slate-300 rounded px-1.5 py-1 focus:outline-none shrink-0 "
                >
                  <option value="API Keys">API Keys</option>
                  <option value="Database">Database</option>
                  <option value="AWS">AWS</option>
                  <option value="SSH Keys">SSH Key</option>
                </select>
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleBatchImport}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-bold font-mono text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/10 active:scale-95  disabled:bg-emerald-950/40"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{loading ? "Importowanie..." : "Zaszyfruj i Importuj Zaznaczone"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
export default EnvImporter;
