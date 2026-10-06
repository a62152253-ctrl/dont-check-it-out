import React from "react";
import { RefreshCw } from "lucide-react";
import { DecryptedSecret } from "../../../types";

interface APIKeyInspectorProps {
  secret: DecryptedSecret;
  handleDownloadDotenv: (name: string, content?: string) => void;
}

export function APIKeyInspector({ secret, handleDownloadDotenv }: APIKeyInspectorProps) {
  if (!secret.developerFields) return null;

  return (
    <div className="space-y-3">
      <button
        onClick={() => handleDownloadDotenv(secret.name, secret.developerFields?.dotenvContent)}
        className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 font-semibold font-mono text-[10px] rounded transition-all flex items-center justify-center gap-1.5"
      >
        <RefreshCw className="w-3.5 h-3.5 rotate-180" />
        <span>Pobierz jako plik .env</span>
      </button>
    </div>
  );
}
