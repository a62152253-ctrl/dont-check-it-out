import React from "react";
import { 
  Star, Edit2, Copy, Check, Eye, EyeOff, Terminal, Database, 
  Trash2, Globe, ExternalLink, Calendar, RefreshCw, Folder, Cpu 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useVaultContext } from "../context/useVaultContext";
import { mapLegacyCategory } from "../hooks/useVault";
import { DeveloperFields } from "../types";
import LegacyWarning from "./SecretInspectorComponents/LegacyWarning";
import AWSDetails from "./SecretInspectorComponents/AWSDetails";
import DatabaseDetails from "./SecretInspectorComponents/DatabaseDetails";
import SSHDetails from "./SecretInspectorComponents/SSHDetails";
import APIKeyDetails from "./SecretInspectorComponents/APIKeyDetails";
import StandardDetails from "./SecretInspectorComponents/StandardDetails";

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
            <LegacyWarning secret={secret} migrateLegacyEntry={migrateLegacyEntry} />

            {/* CATEGORY: AWS */}
            {standardizedCategory === "AWS" && secret.developerFields && (
              <AWSDetails
                fields={secret.developerFields}
                id={secret.id!}
                environment={secret.environment || "dev"}
                isPassVisible={isPassVisible}
                copiedId={copiedId}
                copiedField={copiedField}
                copyText={copyText}
                setVisiblePasswords={setVisiblePasswords}
                handleCopyAWSExports={handleCopyAWSExports}
              />
            )}

            {/* CATEGORY: Database */}
            {standardizedCategory === "Database" && secret.developerFields && (
              <DatabaseDetails
                fields={secret.developerFields}
                id={secret.id!}
                isPassVisible={isPassVisible}
                setVisiblePasswords={setVisiblePasswords}
                handleCopyDbUri={handleCopyDbUri}
              />
            )}

            {/* CATEGORY: SSH Keys */}
            {standardizedCategory === "SSH Keys" && secret.developerFields && (
              <SSHDetails
                fields={secret.developerFields}
                id={secret.id!}
                isPassVisible={isPassVisible}
                copiedId={copiedId}
                copiedField={copiedField}
                copyText={copyText}
                setVisiblePasswords={setVisiblePasswords}
              />
            )}

            {/* CATEGORY: API Keys (Dotenv) */}
            {standardizedCategory === "API Keys" && secret.developerFields && (
              <APIKeyDetails
                fields={secret.developerFields}
                id={secret.id!}
                name={secret.name}
                copiedId={copiedId}
                copiedField={copiedField}
                copyText={copyText}
                handleDownloadDotenv={handleDownloadDotenv}
              />
            )}

            {/* STANDARD CATEGORIES: Websites / Notes / Emails */}
            {["Websites", "Emails", "Notes", "Servers"].includes(standardizedCategory) && (
              <StandardDetails
                secret={secret}
                isPassVisible={isPassVisible}
                copiedId={copiedId}
                copiedField={copiedField}
                copyText={copyText}
                setVisiblePasswords={setVisiblePasswords}
              />
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
