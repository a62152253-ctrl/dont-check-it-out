import React from "react";
import {
  Star, Edit2, Copy, Check, Eye, EyeOff, Terminal, Database,
  Trash2, Globe, ExternalLink, Calendar, RefreshCw, Folder, Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useVaultContext } from "../../context/useVaultContext";
import { mapLegacyCategory } from "../../hooks/useVault";
import { DeveloperFields } from "../../types";
import { SecretInspectorHeader } from "./SecretInspectorHeader";
import { SecretInspectorBody } from "./SecretInspectorBody";
import { SecretInspectorFooter } from "./SecretInspectorFooter";

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

  const isPassVisible = !!visiblePasswords[secret.id || ""];

  const handleEditClick = () => {
    if (secret.id) {
      setEditingId(secret.id);
      setIsFormOpen(true);
    }
  };

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

          <SecretInspectorHeader
            secret={secret}
            toggleFavorite={toggleFavorite}
            handleEditClick={handleEditClick}
          />

          <div className="space-y-3.5">
            {secret.isLegacy && (
              <div className="bg-amber-950/10 border border-amber-900/30 p-3 rounded-lg text-amber-300 text-[10px] space-y-2">
                <p className="font-semibold">⚠️ Ten wpis jest przechowywany w czystym tekście (legacy).</p>
                <button
                  onClick={() => migrateLegacyEntry(secret)}
                  className="w-full py-1.5 bg-amber-400 hover:bg-amber-500 text-black font-bold font-mono text-[9px] uppercase rounded transition-all  "
                >
                  🔒 Zaszyfruj w locie kluczem AES
                </button>
              </div>
            )}
            <SecretInspectorBody
              secret={secret}
              standardizedCategory={standardizedCategory}
              copiedId={copiedId}
              copiedField={copiedField}
              copyText={copyText}
              isPassVisible={isPassVisible}
              setVisiblePasswords={setVisiblePasswords}
              handleCopyAWSExports={handleCopyAWSExports}
              handleCopyDbUri={handleCopyDbUri}
              handleDownloadDotenv={handleDownloadDotenv}
            />
            <SecretInspectorFooter
              secret={secret}
              moveToTrash={moveToTrash}
              deleteSecretPermanently={deleteSecretPermanently}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
export default SecretInspector;
