import React from "react";
import { Sparkles } from "lucide-react";
import { useVaultContext } from "@/features/vault/context/useVaultContext";
import PasswordGenerator from "./PasswordGenerator";
import SSHKeyGenerator from "./SSHKeyGenerator";
import EnvImporter from "./EnvImporter";
import JsonImporter from "./JsonImporter";

export function GeneratorView() {
  const { theme, language } = useVaultContext();

  return (
    <div className="lg:col-span-9 space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Sparkles className={`w-5 h-5 ${theme.text}`} />
            <h2 className="text-xl font-light text-white tracking-tight">
              {language === "PL" ? "Centrum Kryptograficzne & Importer" : "Cryptographic Center & Importer"}
            </h2>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            {language === "PL" 
              ? "Zaawansowany generator kluczy/passphrases oraz bezpieczny importer konfiguracji" 
              : "Advanced developer key/passphrase generator and secure configuration importer"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Interactive Generators */}
        <div className="space-y-6">
          <PasswordGenerator />
          <SSHKeyGenerator />
        </div>

        {/* Importer widgets */}
        <div className="space-y-6">
          <EnvImporter />
          <JsonImporter />
        </div>
      </div>
    </div>
  );
}
export default GeneratorView;
