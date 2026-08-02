import React from "react";
import { Sparkles } from "lucide-react";
import { useVaultContext } from "../../context/useVaultContext";
import PasswordGenerator from "./PasswordGenerator";
import SSHKeyGenerator from "./SSHKeyGenerator";
import EnvImporter from "./EnvImporter";
import JsonImporter from "./JsonImporter";

export function GeneratorView() {
  const { theme, language } = useVaultContext();

  return (
    <div className="relative lg:col-span-9 space-y-6 animate-fadeIn">
      {/* Enhanced UI Decoration */}
      <div
        className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.01] rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/[0.01] rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/[0.005] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="hidden lg:block absolute left-4 top-4 w-1 h-1 bg-white/10 rounded-full"
        aria-hidden="true"
      />
      <div
        className="hidden lg:block absolute right-4 bottom-4 w-1.5 h-1.5 bg-emerald-500/10 rounded-full"
        aria-hidden="true"
      />
      {/* End Enhanced UI Decoration */}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Sparkles className={`w-5 h-5 ${theme.text}`} />
            <h2 className="text-xl font-light text-white tracking-tight">
              {language === "PL"
                ? "Centrum Kryptograficzne & Importer"
                : "Cryptographic Center & Importer"}
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
