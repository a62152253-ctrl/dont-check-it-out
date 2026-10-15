import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useVaultContext } from "../../context/useVaultContext";
import { mapLegacyCategory } from "../../hooks/useVault";
import { DeveloperFields } from "../../types";
import { EmptyState } from "./EmptyState";
import { InspectorHeader } from "./InspectorHeader";
import { LegacyWarning } from "./LegacyWarning";
import { AWSDetails } from "./AWSDetails";
import { DatabaseDetails } from "./DatabaseDetails";
import { SSHDetails } from "./SSHDetails";
import { APIKeyDetails } from "./APIKeyDetails";
import { StandardDetails } from "./StandardDetails";
import { NotesDetails } from "./NotesDetails";
import { AuditLogDetails } from "./AuditLogDetails";
import { ActionButtons } from "./ActionButtons";

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

  if (!secret) return <EmptyState />;

  const isPassVisible = !!visiblePasswords[secret.id || ""];
  const standardizedCategory = mapLegacyCategory(secret.category);

  const handleEditClick = () => {
    if (secret.id) {
      setEditingId(secret.id);
      setIsFormOpen(true);
    }
  };

  const handleCopyAWSExports = async (fields?: DeveloperFields) => {
    if (!fields) return;
    const format = `export AWS_ACCESS_KEY_ID=${fields.awsAccessKeyId || ""}\nexport AWS_SECRET_ACCESS_KEY=${fields.awsSecretAccessKey || ""}\nexport AWS_DEFAULT_REGION=${fields.region || "us-east-1"}`;
    await navigator.clipboard.writeText(format);
    setSuccessMsg("Skopiowano eksport AWS (Shell Environment variables)!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleCopyDbUri = async (fields?: DeveloperFields) => {
    if (!fields) return;
    const engine = (fields.dbEngine || "postgresql").toLowerCase();
    const uri = `${engine}://${fields.dbUser || ""}:${fields.dbPassword || ""}@${fields.dbHost || "localhost"}:${fields.dbPort || "5432"}/${fields.dbName || ""}`;
    await navigator.clipboard.writeText(uri);
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

          <InspectorHeader secret={secret} toggleFavorite={toggleFavorite} onEditClick={handleEditClick} />

          <div className="space-y-3.5">
            <LegacyWarning secret={secret} migrateLegacyEntry={migrateLegacyEntry} />

            {standardizedCategory === "AWS" && (
              <AWSDetails secret={secret} isPassVisible={isPassVisible} copiedId={copiedId} copiedField={copiedField} setVisiblePasswords={setVisiblePasswords} copyText={copyText} handleCopyAWSExports={handleCopyAWSExports} />
            )}

            {standardizedCategory === "Database" && (
              <DatabaseDetails secret={secret} isPassVisible={isPassVisible} copiedId={copiedId} copiedField={copiedField} setVisiblePasswords={setVisiblePasswords} copyText={copyText} handleCopyDbUri={handleCopyDbUri} />
            )}

            {standardizedCategory === "SSH Keys" && (
              <SSHDetails secret={secret} isPassVisible={isPassVisible} copiedId={copiedId} copiedField={copiedField} setVisiblePasswords={setVisiblePasswords} copyText={copyText} />
            )}

            {standardizedCategory === "API Keys" && (
              <APIKeyDetails secret={secret} copiedId={copiedId} copiedField={copiedField} copyText={copyText} handleDownloadDotenv={handleDownloadDotenv} />
            )}

            {["Websites", "Emails", "Notes", "Servers"].includes(standardizedCategory) && (
              <StandardDetails secret={secret} isPassVisible={isPassVisible} copiedId={copiedId} copiedField={copiedField} setVisiblePasswords={setVisiblePasswords} copyText={copyText} />
            )}

            <NotesDetails secret={secret} />
            <AuditLogDetails secret={secret} />
            <ActionButtons secret={secret} moveToTrash={moveToTrash} deleteSecretPermanently={deleteSecretPermanently} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
export default SecretInspector;
