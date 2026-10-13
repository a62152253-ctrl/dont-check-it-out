import React from "react";
import { Shield } from "lucide-react";

interface Props {
  loading: boolean;
  unlockText: string;
  unlockingText: string;
}

export const VaultUnlockButton = ({ loading, unlockText, unlockingText }: Props) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/10  flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] duration-150"
  >
    {loading ? (
      <>
        <div className="animate-spin h-3.5 w-3.5 border-2 border-black border-t-transparent rounded-full" />
        <span>{unlockingText}</span>
      </>
    ) : (
      <>
        <Shield className="w-4 h-4 stroke-[2.5]" />
        <span>{unlockText}</span>
      </>
    )}
  </button>
);
