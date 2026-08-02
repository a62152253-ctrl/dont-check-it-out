import React from "react";
import { 
  Star, Edit2, Copy, Check, Eye, EyeOff, Terminal, Database, 
  Trash2, Globe, ExternalLink, Calendar, RefreshCw, Folder, Cpu 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useVaultContext } from "../context/useVaultContext";
import { mapLegacyCategory } from "../hooks/useVault";
import { DeveloperFields } from "shared";

export function SecretInspector() {
  const {
    decryptedEntries,
    selectedEntryId,
    visiblePasswords,
    setVisiblePasswords,
    copiedId,
    copiedField,
    copyText,
    setEditingId,
    setIsFormOpen,
    toggleFavorite,
    moveToTrash,
    deleteSecretPermanently,
    migrateLegacyEntry,
    successMsg,
    setSuccessMsg
  } = useVaultContext();

  const secret = decryptedEntries.find(e => e.id === selectedEntryId);

  if (!secret) {
    return (
      <div className="bg-[#0c0c0c] border border-white/5 rounded-lg p-12 text-center text-slate-500 font-mono text-xs">
        <Cpu className="w-6 h-6 text-slate-800 mx-auto mb-2" />
        <span>Wybierz sekret z listy, aby wyświetlić szczegóły (Zero-Knowledge Audit)</span>
      </div>
    );
  }

  const hasKey = secret.password || secret.developerFields?.awsSecretAccessKey || "";
  const isPassVisible = !!visiblePasswords[secret.id || ""];

  const handleEditClick = () => {
    if (secret.id) {
      setEditingId(secret.id);
      setIsFormOpen(true);
    }
  };

  // Helper formats
  const handleCopyAWSExports = (fields?: DeveloperFields) => {
    if (!fields) return;
    const format = `export AWS_ACCESS_KEY_ID=${fields.awsAccessKeyId || ""}\nexport AWS_SECRET_ACCESS_KEY=${fields.awsSecretAccessKey || ""}\nexport AWS_DEFAULT_REGION=${fields.region || "us-east-1"}`;
    navigator.clipboard.writeText(format);
    setSuccessMsg("Skopiowano eksport AWS (Shell Environment variables)!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleCopyDbUri = (fields?: DeveloperFields) => {
    if (!fields) return;
    const engine = (fields.dbEngine || "postgresql").toLowerCase();
    const uri = `${engine}://${fields.dbUser || ""}:${fields.dbPassword || ""}@${fields.dbHost || "localhost"}:${fields.dbPort || "5432"}/${fields.dbName || ""}`;
    navigator.clipboard.writeText(uri);
    setSuccessMsg("Skopiowano URI połączenia bazy danych!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDownloadDotenv = (name: string, content?: string) => {
    if (!content) return;
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.env`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setSuccessMsg("Plik .env wygenerowany i pobrany pomyślnie!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const standardizedCategory = mapLegacyCategory(secret.category);

  return (
    <div className="lg:col-span-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={secret.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="bg-[#0c0c0c]/90 border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.02)]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full blur-2xl pointer-events-none" />

          {/* Inspector Header */}
          <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
            <div>
              <h3 className="font-display font-semibold text-white tracking-tight break-words">{secret.name}</h3>
              <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                <span className="text-[9px] font-mono font-bold bg-white/5 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                  {secret.category}
                </span>
                {secret.project && (
                  <span className="text-[9px] font-mono bg-white/5 text-slate-400 px-2 py-0.5 rounded border border-white/5">
                    {secret.project}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => toggleFavorite(secret.id!, !!secret.isFavorite)}
                className="p-1.5 hover:bg-white/5 text-slate-500 hover:text-amber-400 rounded transition-all cursor-pointer"
                title="Do ulubionych"
              >
                <Star className={`w-4 h-4 ${secret.isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
              </button>

              <button
                onClick={handleEditClick}
                className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded transition-all cursor-pointer"
                title="Edytuj sekret"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3.5">
            {secret.isLegacy && (
              <div className="bg-amber-950/10 border border-amber-900/30 p-3 rounded-lg text-amber-300 text-[10px] space-y-2">
                <p className="font-semibold">⚠️ Ten wpis jest przechowywany w czystym tekście (legacy).</p>
                <button
                  onClick={() => migrateLegacyEntry(secret)}
                  className="w-full py-1.5 bg-amber-400 hover:bg-amber-500 text-black font-bold font-mono text-[9px] uppercase rounded transition-all cursor-pointer"
                >
                  🔒 Zaszyfruj w locie kluczem AES
                </button>
              </div>
            )}

            {/* CATEGORY: AWS */}
            {standardizedCategory === "AWS" && secret.developerFields && (
              <div className="space-y-3">
                <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
                  <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">AWS Access Key ID</span>
                  <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">{secret.developerFields.awsAccessKeyId || "Brak"}</span>
                  <button
                    onClick={() => copyText(secret.developerFields?.awsAccessKeyId || "", secret.id!, "aws_id")}
                    className="absolute right-2 top-3 text-slate-500 hover:text-white cursor-pointer"
                    title="Kopiuj ID"
                  >
                    {copiedId === secret.id && copiedField === "aws_id" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
                  <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">AWS Secret Access Key</span>
                  <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">
                    {isPassVisible ? secret.developerFields.awsSecretAccessKey : "••••••••••••••••••••••••••••••••"}
                  </span>
                  <div className="absolute right-2 top-3 flex items-center gap-1.5 text-slate-500">
                    <button
                      onClick={() => setVisiblePasswords(p => ({ ...p, [secret.id!]: !p[secret.id!] }))}
                      className="hover:text-white cursor-pointer"
                    >
                      {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => copyText(secret.developerFields?.awsSecretAccessKey || "", secret.id!, "aws_secret")}
                      className="hover:text-white cursor-pointer"
                    >
                      {copiedId === secret.id && copiedField === "aws_secret" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#121212] border border-white/5 p-2 rounded">
                    <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Region</span>
                    <span className="text-xs font-mono text-slate-300">{secret.developerFields.region || "us-east-1"}</span>
                  </div>
                  <div className="bg-[#121212] border border-white/5 p-2 rounded">
                    <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Środowisko</span>
                    <span className="text-xs font-mono text-slate-300 uppercase font-semibold">{secret.environment || "dev"}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyAWSExports(secret.developerFields)}
                  className="w-full py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-300 font-semibold font-mono text-[10px] rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Kopiuj eksport AWS (Shell env)</span>
                </button>
              </div>
            )}

            {/* CATEGORY: Database */}
            {standardizedCategory === "Database" && secret.developerFields && (
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
                    <button
                      onClick={() => setVisiblePasswords(p => ({ ...p, [secret.id!]: !p[secret.id!] }))}
                      className="absolute right-2 top-2.5 text-slate-500 hover:text-white cursor-pointer"
                    >
                      {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyDbUri(secret.developerFields)}
                  className="w-full py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-300 font-semibold font-mono text-[10px] rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Kopiuj Connection String / URI</span>
                </button>
              </div>
            )}

            {/* CATEGORY: SSH Keys */}
            {standardizedCategory === "SSH Keys" && secret.developerFields && (
              <div className="space-y-3">
                <div className="bg-[#121212] border border-white/5 p-2 rounded relative">
                  <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Host zdalny (SSH Connection)</span>
                  <span className="text-xs font-mono text-slate-300 select-all pr-8 break-all">{secret.developerFields.sshHost || "np. ubuntu@192.168.1.1"}</span>
                  <button
                    onClick={() => copyText(secret.developerFields?.sshHost || "", secret.id!, "ssh_host")}
                    className="absolute right-2 top-2.5 text-slate-500 hover:text-white cursor-pointer"
                  >
                    {copiedId === secret.id && copiedField === "ssh_host" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {secret.developerFields.sshPassphrase && (
                  <div className="bg-[#121212] border border-white/5 p-2 rounded relative">
                    <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Klucz Passphrase</span>
                    <span className="text-xs font-mono text-slate-300 select-all pr-8">
                      {isPassVisible ? secret.developerFields.sshPassphrase : "••••••••••"}
                    </span>
                    <div className="absolute right-2 top-2 flex items-center gap-1 text-slate-500">
                      <button
                        onClick={() => setVisiblePasswords(p => ({ ...p, [secret.id!]: !p[secret.id!] }))}
                        className="hover:text-white cursor-pointer"
                      >
                        {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => copyText(secret.developerFields?.sshPassphrase || "", secret.id!, "ssh_pass")}
                        className="hover:text-white cursor-pointer"
                      >
                        {copiedId === secret.id && copiedField === "ssh_pass" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-1 bg-[#070707] border border-white/5 p-2.5 rounded relative max-h-[160px] overflow-y-auto">
                  <span className="block text-[8px] font-mono text-slate-500 uppercase">Klucz Prywatny RSA (Private Key)</span>
                  <pre className="text-[9px] font-mono text-emerald-500/80 leading-normal select-all break-all whitespace-pre-wrap mt-1 select-all pr-6">
                    {secret.developerFields.sshPrivateKey ? secret.developerFields.sshPrivateKey.substring(0, 70) + "..." : "Brak klucza"}
                  </pre>
                  {secret.developerFields.sshPrivateKey && (
                    <button
                      onClick={() => copyText(secret.developerFields?.sshPrivateKey || "", secret.id!, "ssh_key")}
                      className="absolute right-2 top-2.5 text-slate-500 hover:text-white cursor-pointer"
                      title="Skopiuj cały klucz SSH"
                    >
                      {copiedId === secret.id && copiedField === "ssh_key" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* CATEGORY: API Keys (Dotenv) */}
            {standardizedCategory === "API Keys" && secret.developerFields && (
              <div className="space-y-3">
                <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative max-h-[160px] overflow-y-auto">
                  <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Zawartość Konfiguracji / Dotenv</span>
                  <pre className="text-[10px] font-mono text-emerald-400 select-all whitespace-pre-wrap leading-relaxed mt-1 break-all pr-6 select-all">
                    {secret.developerFields.dotenvContent || "Brak danych .env"}
                  </pre>
                  <button
                    onClick={() => copyText(secret.developerFields?.dotenvContent || "", secret.id!, "dotenv")}
                    className="absolute right-2 top-2.5 text-slate-500 hover:text-white cursor-pointer"
                  >
                    {copiedId === secret.id && copiedField === "dotenv" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  onClick={() => handleDownloadDotenv(secret.name, secret.developerFields?.dotenvContent)}
                  className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 font-semibold font-mono text-[10px] rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 rotate-180" />
                  <span>Pobierz jako plik .env</span>
                </button>
              </div>
            )}

            {/* STANDARD CATEGORIES: Websites / Notes / Emails */}
            {["Websites", "Emails", "Notes", "Servers"].includes(standardizedCategory) && (
              <div className="space-y-3">
                {secret.url && (
                  <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative flex items-center justify-between">
                    <div className="min-w-0 pr-8">
                      <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">URL adresu</span>
                      <span className="text-xs font-mono text-slate-300 truncate block select-all">{secret.url}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyText(secret.url || "", secret.id!, "url")}
                        className="text-slate-500 hover:text-white cursor-pointer"
                      >
                        {copiedId === secret.id && copiedField === "url" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a 
                        href={secret.url.startsWith("http") ? secret.url : `https://${secret.url}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-slate-500 hover:text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {secret.username && (
                  <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
                    <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Nazwa Użytkownika / Email</span>
                    <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">{secret.username}</span>
                    <button
                      onClick={() => copyText(secret.username || "", secret.id!, "user")}
                      className="absolute right-2 top-3 text-slate-500 hover:text-white cursor-pointer"
                    >
                      {copiedId === secret.id && copiedField === "user" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {secret.password && (
                  <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
                    <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Klucz Hasła</span>
                    <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">
                      {isPassVisible ? secret.password : "••••••••••••••••"}
                    </span>
                    <div className="absolute right-2 top-3 flex items-center gap-1.5 text-slate-500">
                      <button
                        onClick={() => setVisiblePasswords(p => ({ ...p, [secret.id!]: !p[secret.id!] }))}
                        className="hover:text-white cursor-pointer"
                      >
                        {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => copyText(secret.password || "", secret.id!, "pass")}
                        className="hover:text-white cursor-pointer"
                      >
                        {copiedId === secret.id && copiedField === "pass" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Note text field */}
            {secret.notes && (
              <div className="bg-[#121212] border border-white/5 p-3 rounded text-xs font-mono space-y-1">
                <span className="block text-[9px] text-slate-500 uppercase">Dodatkowe notatki (Secure notes)</span>
                <p className="text-slate-300 leading-relaxed break-words whitespace-pre-wrap">{secret.notes}</p>
              </div>
            )}

            {/* Audit log timings info */}
            <div className="border-t border-white/5 pt-3 flex flex-wrap gap-x-4 gap-y-2 text-[9px] font-mono text-slate-600 justify-between">
              {secret.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 shrink-0" />
                  Stworzono: {new Date(secret.createdAt).toLocaleDateString()}
                </span>
              )}
              {secret.updatedAt && (
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 shrink-0" />
                  Modyfikowano: {new Date(secret.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="border-t border-white/5 pt-3.5 flex gap-2">
              {secret.isTrash ? (
                <>
                  <button
                    onClick={() => moveToTrash(secret.id!, false)}
                    className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px] uppercase rounded transition-all cursor-pointer text-center"
                  >
                    Przywróć
                  </button>
                  <button
                    onClick={() => deleteSecretPermanently(secret.id!)}
                    className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 rounded transition-all cursor-pointer flex items-center justify-center"
                    title="Usuń trwale"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => moveToTrash(secret.id!, true)}
                  className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold font-mono text-[10px] uppercase rounded transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Przenieś do kosza
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
export default SecretInspector;
