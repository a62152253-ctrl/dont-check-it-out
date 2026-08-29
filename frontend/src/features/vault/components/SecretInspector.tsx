import React from "react";
import { Cpu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useVaultContext } from "../context/useVaultContext";
import { mapLegacyCategory } from "../hooks/useVault";
import { type DeveloperFields } from "shared";
import { SecretHeader } from "./SecretInspector/SecretHeader";
import { LegacyWarning } from "./SecretInspector/LegacyWarning";
import { AwsCredentials } from "./SecretInspector/AwsCredentials";
import { DbCredentials } from "./SecretInspector/DbCredentials";
import { SshCredentials } from "./SecretInspector/SshCredentials";
import { ApiKeys } from "./SecretInspector/ApiKeys";
import { StandardCredentials } from "./SecretInspector/StandardCredentials";
import { NotesField } from "./SecretInspector/NotesField";
import { AuditLog } from "./SecretInspector/AuditLog";
import { ActionButtons } from "./SecretInspector/ActionButtons";

export function SecretInspector() {
  const {
    decryptedEntries, selectedEntryId, visiblePasswords, setVisiblePasswords,
    copiedId, copiedField, copyText, setEditingId, setIsFormOpen, toggleFavorite,
    moveToTrash, deleteSecretPermanently, migrateLegacyEntry, setSuccessMsg
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

          <SecretHeader secret={secret} toggleFavorite={toggleFavorite} handleEditClick={handleEditClick} />

          <div className="space-y-3.5">
            <LegacyWarning secret={secret} migrateLegacyEntry={migrateLegacyEntry} />

            {standardizedCategory === "AWS" && (
              <AwsCredentials secret={secret} isPassVisible={isPassVisible} setVisiblePasswords={setVisiblePasswords} copiedId={copiedId} copiedField={copiedField} copyText={copyText} handleCopyAWSExports={handleCopyAWSExports} />
            )}

            {standardizedCategory === "Database" && (
              <DbCredentials secret={secret} isPassVisible={isPassVisible} setVisiblePasswords={setVisiblePasswords} handleCopyDbUri={handleCopyDbUri} />
            )}

            {standardizedCategory === "SSH Keys" && (
              <SshCredentials secret={secret} isPassVisible={isPassVisible} setVisiblePasswords={setVisiblePasswords} copiedId={copiedId} copiedField={copiedField} copyText={copyText} />
            )}

            {standardizedCategory === "API Keys" && (
              <ApiKeys secret={secret} copiedId={copiedId} copiedField={copiedField} copyText={copyText} handleDownloadDotenv={handleDownloadDotenv} />
            )}

            {["Websites", "Emails", "Notes", "Servers"].includes(standardizedCategory) && (
              <StandardCredentials secret={secret} isPassVisible={isPassVisible} setVisiblePasswords={setVisiblePasswords} copiedId={copiedId} copiedField={copiedField} copyText={copyText} />
            )}

            <NotesField secret={secret} />
            <AuditLog secret={secret} />
            <ActionButtons secret={secret} moveToTrash={moveToTrash} deleteSecretPermanently={deleteSecretPermanently} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default SecretInspector;
