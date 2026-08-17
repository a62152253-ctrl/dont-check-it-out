import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useVaultContext } from "@/features/vault/context/useVaultContext";
import { mapLegacyCategory } from "@/features/vault/hooks/useVault";
import { DeveloperFields } from "shared/types";
import { InspectorHeader } from "./SecretInspector/InspectorHeader";
import { LegacyWarning } from "./SecretInspector/LegacyWarning";
import { CategoryAWS } from "./SecretInspector/CategoryAWS";
import { CategoryDatabase } from "./SecretInspector/CategoryDatabase";
import { CategorySSH } from "./SecretInspector/CategorySSH";
import { CategoryAPIKeys } from "./SecretInspector/CategoryAPIKeys";
import { CategoryStandard } from "./SecretInspector/CategoryStandard";
import { NotesField } from "./SecretInspector/NotesField";
import { AuditLog } from "./SecretInspector/AuditLog";
import { ActionButtons } from "./SecretInspector/ActionButtons";

export function SecretInspector() {
  const { decryptedEntries, selectedEntryId, visiblePasswords, setVisiblePasswords, copiedId, copiedField, copyText, setEditingId, setIsFormOpen, toggleFavorite, moveToTrash, deleteSecretPermanently, migrateLegacyEntry, setSuccessMsg } = useVaultContext();
  const secret = decryptedEntries.find(s => s.id === selectedEntryId);

  if (!secret) {
    return (
      <div className="lg:col-span-4 bg-[#0c0c0c]/90 border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-xl min-h-[400px]">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white font-display tracking-wide">Brak wybranego wpisu</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[200px] leading-relaxed">
            Wybierz sekret z listy, aby zobaczyć szczegóły lub skopiować ukryte dane.
          </p>
        </div>
      </div>
    );
  }

  const isPassVisible = !!visiblePasswords[secret.id!];

  const handleEditClick = () => { setEditingId(secret.id || null); setIsFormOpen(true); };
  const handleCopyAWSExports = (fields: DeveloperFields) => {
    const exports = `export AWS_ACCESS_KEY_ID=${fields.awsAccessKeyId || ""}\nexport AWS_SECRET_ACCESS_KEY=${fields.awsSecretAccessKey || ""}\nexport AWS_DEFAULT_REGION=${fields.region || "us-east-1"}`;
    navigator.clipboard.writeText(exports); setSuccessMsg("Skopiowano polecenia eksportu AWS"); setTimeout(() => setSuccessMsg(null), 3000);
  };
  const handleCopyDbUri = (fields: DeveloperFields) => {
    const uri = `${fields.dbEngine || "postgresql"}://${fields.dbUser || ""}:${fields.dbPassword || ""}@${fields.dbHost || "localhost"}:${fields.dbPort || "5432"}/${fields.dbName || "postgres"}`;
    navigator.clipboard.writeText(uri); setSuccessMsg("Skopiowano URI do bazy danych"); setTimeout(() => setSuccessMsg(null), 3000);
  };
  const handleDownloadDotenv = (name: string, content?: string) => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const element = document.createElement("a");
    element.href = url; element.download = `${name.replace(/\s+/g, '_').toLowerCase()}.env`;
    document.body.appendChild(element); element.click(); document.body.removeChild(element);
    setSuccessMsg("Plik .env wygenerowany i pobrany pomyślnie!"); setTimeout(() => setSuccessMsg(null), 3000);
  };

  const cat = mapLegacyCategory(secret.category);

  return (
    <div className="lg:col-span-4">
      <AnimatePresence mode="wait">
        <motion.div key={secret.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-[#0c0c0c]/90 border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.02)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full blur-2xl pointer-events-none" />
          <InspectorHeader secret={secret} toggleFav={toggleFavorite} onEdit={handleEditClick} />
          <div className="space-y-3.5">
            <LegacyWarning isLegacy={secret.isLegacy} onMigrate={() => migrateLegacyEntry(secret)} />
            {cat === "AWS" && secret.developerFields && <CategoryAWS secret={secret} copiedId={copiedId} copiedField={copiedField} copyText={copyText} handleCopyAWS={handleCopyAWSExports} isPassVisible={isPassVisible} setVisible={setVisiblePasswords} />}
            {cat === "Database" && secret.developerFields && <CategoryDatabase secret={secret} isPassVisible={isPassVisible} setVisible={setVisiblePasswords} handleCopyDbUri={handleCopyDbUri} />}
            {cat === "SSH Keys" && secret.developerFields && <CategorySSH secret={secret} copiedId={copiedId} copiedField={copiedField} copyText={copyText} isPassVisible={isPassVisible} setVisible={setVisiblePasswords} />}
            {cat === "API Keys" && secret.developerFields && <CategoryAPIKeys secret={secret} copiedId={copiedId} copiedField={copiedField} copyText={copyText} handleDownload={handleDownloadDotenv} />}
            {["Websites", "Emails", "Notes", "Servers"].includes(cat) && <CategoryStandard secret={secret} copiedId={copiedId} copiedField={copiedField} copyText={copyText} isPassVisible={isPassVisible} setVisible={setVisiblePasswords} />}
            <NotesField notes={secret.notes} />
            <AuditLog createdAt={secret.createdAt} updatedAt={secret.updatedAt} />
            <ActionButtons secret={secret} moveToTrash={moveToTrash} deleteSecretPermanently={deleteSecretPermanently} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
export default SecretInspector;