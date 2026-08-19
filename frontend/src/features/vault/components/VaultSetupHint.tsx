import React from "react";
import { Info } from "lucide-react";

interface VaultSetupHintProps {
  showConfigHint: boolean;
  setShowConfigHint: (val: boolean) => void;
}

export function VaultSetupHint({ showConfigHint, setShowConfigHint }: VaultSetupHintProps) {
  return (
    <div className="border-t border-white/5 pt-4">
      <button
        type="button"
        onClick={() => setShowConfigHint(!showConfigHint)}
        className="text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition-all cursor-pointer"
      >
        <Info className="w-3.5 h-3.5" />
        <span>{showConfigHint ? "Ukryj szczegóły architektury" : "Pokaż szczegóły architektury"}</span>
      </button>

      {showConfigHint && (
        <p className="text-[10px] font-mono text-slate-500 mt-2.5 leading-relaxed bg-[#121212]/30 p-3 rounded-lg border border-white/5">
          * Generujemy unikalną sól 128-bitową. <br/>
          * Przeiterujemy hasło 100 000 razy za pomocą PBKDF2-HMAC-SHA256, aby uzyskać KEK (Key Encryption Key). <br/>
          * Tworzymy losowy 256-bitowy Vault Key, który szyfrujemy KEK za pomocą AES-GCM. <br/>
          * Ten zaszyfrowany blob synchronizujemy z Firebase, abyś miał dostęp na innych urządzeniach bez ryzyka wycieku hasła.
        </p>
      )}
    </div>
  );
}
export default VaultSetupHint;
