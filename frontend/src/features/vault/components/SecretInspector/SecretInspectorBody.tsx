import React from "react";
import type { DecryptedSecret, DeveloperFields } from "../../types";
import { AWSInspector } from "./categories/AWSInspector";
import { DatabaseInspector } from "./categories/DatabaseInspector";
import { SSHKeyInspector } from "./categories/SSHKeyInspector";
import { APIKeyInspector } from "./categories/APIKeyInspector";
import { StandardInspector } from "./categories/StandardInspector";

export interface SecretInspectorBodyProps {
  secret: DecryptedSecret;
  standardizedCategory: string;
  copiedId: string | null;
  copiedField: string | null;
  copyText: (text: string, id: string, field: string) => void;
  isPassVisible: boolean;
  setVisiblePasswords: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleCopyAWSExports: (fields?: DeveloperFields) => void;
  handleCopyDbUri: (fields?: DeveloperFields) => void;
  handleDownloadDotenv: (name: string, content?: string) => void;
}

export function SecretInspectorBody({ secret, standardizedCategory, copiedId, copiedField, copyText, isPassVisible, setVisiblePasswords, handleCopyAWSExports, handleCopyDbUri, handleDownloadDotenv }: SecretInspectorBodyProps) {
  return (
    <>
      {standardizedCategory === "AWS" && (
        <AWSInspector
          secret={secret}
          copiedId={copiedId}
          copiedField={copiedField}
          copyText={copyText}
          isPassVisible={isPassVisible}
          setVisiblePasswords={setVisiblePasswords}
          handleCopyAWSExports={handleCopyAWSExports}
        />
      )}

      {standardizedCategory === "Database" && (
        <DatabaseInspector
          secret={secret}
          copiedId={copiedId}
          copiedField={copiedField}
          copyText={copyText}
          handleCopyDbUri={handleCopyDbUri}
        />
      )}

      {standardizedCategory === "SSH Keys" && (
        <SSHKeyInspector
          secret={secret}
          copiedId={copiedId}
          copiedField={copiedField}
          copyText={copyText}
        />
      )}

      {standardizedCategory === "API Keys" && (
        <APIKeyInspector
          secret={secret}
          handleDownloadDotenv={handleDownloadDotenv}
        />
      )}

      {["Websites", "Emails", "Notes", "Servers"].includes(standardizedCategory) && (
        <StandardInspector
          secret={secret}
          copiedId={copiedId}
          copiedField={copiedField}
          copyText={copyText}
          isPassVisible={isPassVisible}
          setVisiblePasswords={setVisiblePasswords}
        />
      )}

      {secret.notes && (
        <div className="bg-[#121212] border border-white/5 p-3 rounded text-xs font-mono space-y-1">
          <span className="block text-[9px] text-slate-500 uppercase">Dodatkowe notatki (Secure notes)</span>
          <p className="text-slate-300 leading-relaxed break-words whitespace-pre-wrap">{secret.notes}</p>
        </div>
      )}
    </>
  );
}
