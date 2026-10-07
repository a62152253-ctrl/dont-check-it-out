import React from "react";
import { 
  Star, Edit2, Trash2, Calendar, RefreshCw, Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useVaultContext } from "../context/useVaultContext";
import { mapLegacyCategory } from "../hooks/useVault";
import { AwsDetails } from "./Inspector/AwsDetails";
import { DatabaseDetails } from "./Inspector/DatabaseDetails";
import { SshKeyDetails } from "./Inspector/SshKeyDetails";
import { ApiKeyDetails } from "./Inspector/ApiKeyDetails";
import { StandardDetails } from "./Inspector/StandardDetails";
import { handleCopyAWSExports, handleCopyDbUri, handleDownloadDotenv } from "../utils/inspectorHelpers";

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

  const isPassVisible = !!visiblePasswords[secret.id || ""];
  const handleEditClick = () => {
    if (secret.id) {
      setEditingId(secret.id);
      setIsFormOpen(true);
    }
  };

  const standardizedCategory = mapLegacyCategory(secret.category);
  const isStandardCategory = ["Websites", "Emails", "Notes", "Servers"].includes(standardizedCategory);

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
                className="p-1.5 hover:bg-white/5 text-slate-500 hover:text-amber-400 rounded transition-all"
                title="Do ulubionych"
              >
                <Star className={`w-4 h-4 ${secret.isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
              </button>

              <button
                onClick={handleEditClick}
                className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded transition-all"
                title="Edytuj sekret"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            {secret.isLegacy && (
              <div className="bg-amber-950/10 border border-amber-900/30 p-3 rounded-lg text-amber-300 text-[10px] space-y-2">
                <p className="font-semibold">⚠️ Ten wpis jest przechowywany w czystym tekście (legacy).</p>
                <button
                  onClick={() => migrateLegacyEntry(secret)}
                  className="w-full py-1.5 bg-amber-400 hover:bg-amber-500 text-black font-bold font-mono text-[9px] uppercase rounded transition-all"
                >
                  🔒 Zaszyfruj w locie kluczem AES
                </button>
              </div>
            )}

            {standardizedCategory === "AWS" && (
              <AwsDetails
                secret={secret}
                isPassVisible={isPassVisible}
                copiedId={copiedId}
                copiedField={copiedField}
                copyText={copyText}
                setVisiblePasswords={setVisiblePasswords}
                handleCopyAWSExports={(fields) => handleCopyAWSExports(fields, setSuccessMsg)}
              />
            )}

            {standardizedCategory === "Database" && (
              <DatabaseDetails
                secret={secret}
                isPassVisible={isPassVisible}
                copiedId={copiedId}
                copiedField={copiedField}
                copyText={copyText}
                setVisiblePasswords={setVisiblePasswords}
                handleCopyDbUri={(fields) => handleCopyDbUri(fields, setSuccessMsg)}
              />
            )}

            {standardizedCategory === "SSH Keys" && (
              <SshKeyDetails
                secret={secret}
                isPassVisible={isPassVisible}
                copiedId={copiedId}
                copiedField={copiedField}
                copyText={copyText}
                setVisiblePasswords={setVisiblePasswords}
              />
            )}

            {standardizedCategory === "API Keys" && (
              <ApiKeyDetails
                secret={secret}
                copiedId={copiedId}
                copiedField={copiedField}
                copyText={copyText}
                handleDownloadDotenv={(name, content) => handleDownloadDotenv(name, content, setSuccessMsg)}
              />
            )}

            {isStandardCategory && (
              <StandardDetails
                secret={secret}
                isPassVisible={isPassVisible}
                copiedId={copiedId}
                copiedField={copiedField}
                copyText={copyText}
                setVisiblePasswords={setVisiblePasswords}
              />
            )}

            {secret.notes && (
              <div className="bg-[#121212] border border-white/5 p-3 rounded text-xs font-mono space-y-1">
                <span className="block text-[9px] text-slate-500 uppercase">Dodatkowe notatki (Secure notes)</span>
                <p className="text-slate-300 leading-relaxed break-words whitespace-pre-wrap">{secret.notes}</p>
              </div>
            )}

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

            <div className="border-t border-white/5 pt-3.5 flex gap-2">
              {secret.isTrash ? (
                <>
                  <button
                    onClick={() => moveToTrash(secret.id!, false)}
                    className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px] uppercase rounded transition-all text-center"
                  >
                    Przywróć
                  </button>
                  <button
                    onClick={() => deleteSecretPermanently(secret.id!)}
                    className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 rounded transition-all flex items-center justify-center"
                    title="Usuń trwale"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => moveToTrash(secret.id!, true)}
                  className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold font-mono text-[10px] uppercase rounded transition-all flex items-center justify-center gap-1"
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
