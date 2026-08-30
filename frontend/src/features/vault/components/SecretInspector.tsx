import React from "react";
import { Cpu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useVaultContext } from "../context/useVaultContext";
import { InspectorContent } from "./SecretInspector/InspectorContent";

export function SecretInspector() {
  const { decryptedEntries, selectedEntryId } = useVaultContext();
  const secret = decryptedEntries.find(e => e.id === selectedEntryId);

  if (!secret) {
    return (
      <div className="bg-[#0c0c0c] border border-white/5 rounded-lg p-12 text-center text-slate-500 font-mono text-xs">
        <Cpu className="w-6 h-6 text-slate-800 mx-auto mb-2" />
        <span>Wybierz sekret z listy, aby wyświetlić szczegóły (Zero-Knowledge Audit)</span>
      </div>
    );
  }

  return (
    <div className="lg:col-span-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={secret.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="bg-[#0c0c0c]/90 border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.02)]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full blur-2xl pointer-events-none" />
          <InspectorContent secret={secret} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default SecretInspector;
