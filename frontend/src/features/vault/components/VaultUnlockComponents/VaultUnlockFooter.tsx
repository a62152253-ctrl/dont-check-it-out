import React from "react";

interface Props {
  language: "PL" | "EN";
  onReset: () => void;
  resetText: string;
}

export const VaultUnlockFooter = ({ language, onReset, resetText }: Props) => (
  <div className="border-t border-white/5 pt-4 text-center space-y-3">
    <p className="text-[9px] font-mono text-slate-600 leading-normal px-2">
      {language === "PL"
        ? "Wskazówka Demo: Jeśli to Twoje pierwsze uruchomienie, użyj hasła utworzonego w kroku inicjalizacji."
        : "Demo Hint: If this is your first load, use the master password you created during initialization."}
    </p>
    <div className="pt-1">
      <button
        type="button"
        onClick={onReset}
        className="text-[10px] font-mono text-rose-400 hover:text-rose-300 underline  transition-colors"
      >
        {resetText}
      </button>
    </div>
  </div>
);
