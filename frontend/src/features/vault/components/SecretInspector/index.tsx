import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useVaultContext } from "../../context/VaultContext";
import { mapLegacyCategory } from "../../hooks/useVault";
import { EmptyInspector } from "./EmptyInspector";
import { InspectorHeader } from "./InspectorHeader";
import { LegacyWarning } from "./LegacyWarning";
import { AWSDetails } from "./AWSDetails";
import { DatabaseDetails } from "./DatabaseDetails";
import { SSHKeyDetails } from "./SSHKeyDetails";
import { APIKeyDetails } from "./APIKeyDetails";
import { StandardDetails } from "./StandardDetails";
import { InspectorNotes } from "./InspectorNotes";
import { AuditInfo } from "./AuditInfo";
import { InspectorActions } from "./InspectorActions";

export function SecretInspector() {
  const { decryptedEntries, selectedEntryId } = useVaultContext();
  const secret = decryptedEntries.find(e => e.id === selectedEntryId);

  if (!secret) return <EmptyInspector />;

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

          <InspectorHeader secret={secret} />

          <div className="space-y-3.5">
            {secret.isLegacy && <LegacyWarning secret={secret} />}

            {standardizedCategory === "AWS" && <AWSDetails secret={secret} />}
            {standardizedCategory === "Database" && <DatabaseDetails secret={secret} />}
            {standardizedCategory === "SSH Keys" && <SSHKeyDetails secret={secret} />}
            {standardizedCategory === "API Keys" && <APIKeyDetails secret={secret} />}

            {["Websites", "Emails", "Notes", "Servers"].includes(standardizedCategory) && (
              <StandardDetails secret={secret} />
            )}

            {secret.notes && <InspectorNotes notes={secret.notes} />}

            <AuditInfo secret={secret} />
            <InspectorActions secret={secret} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
export default SecretInspector;
