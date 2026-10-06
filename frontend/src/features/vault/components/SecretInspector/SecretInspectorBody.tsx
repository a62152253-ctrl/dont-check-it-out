import React from "react";
import { Copy, Check, Eye, EyeOff, Terminal, Database, Globe, ExternalLink, RefreshCw } from "lucide-react";
import { DecryptedSecret, DeveloperFields } from "../../types";

interface SecretInspectorBodyProps {
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

export function SecretInspectorBody({
  secret,
  standardizedCategory,
  copiedId,
  copiedField,
  copyText,
  isPassVisible,
  setVisiblePasswords,
  handleCopyAWSExports,
  handleCopyDbUri,
  handleDownloadDotenv
}: SecretInspectorBodyProps) {
  return (
    <>
      {standardizedCategory === "AWS" && secret.developerFields && (
        <div className="space-y-3">
          <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
            <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Access Key ID</span>
            <span className="text-xs font-mono text-slate-300">{secret.developerFields.awsAccessKeyId || "Brak"}</span>
            <button
              onClick={() => copyText(secret.developerFields?.awsAccessKeyId || "", secret.id!, "aws_key")}
              className="absolute right-2 top-3 text-slate-500 hover:text-white  "
            >
              {copiedId === secret.id && copiedField === "aws_key" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
            <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Secret Access Key</span>
            <span className="text-xs font-mono text-slate-300">
              {isPassVisible ? secret.developerFields.awsSecretAccessKey : "••••••••••••••••••••••••••••••••••••••••"}
            </span>
            <div className="absolute right-2 top-3 flex items-center gap-1.5 text-slate-500">
              <button
                onClick={() => setVisiblePasswords(p => ({ ...p, [secret.id!]: !p[secret.id!] }))}
                className="hover:text-white  "
              >
                {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => copyText(secret.developerFields?.awsSecretAccessKey || "", secret.id!, "aws_secret")}
                className="hover:text-white  "
              >
                {copiedId === secret.id && copiedField === "aws_secret" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            onClick={() => handleCopyAWSExports(secret.developerFields)}
            className="w-full py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-300 font-semibold font-mono text-[10px] rounded transition-all   flex items-center justify-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Skopiuj jako zmienne środowiskowe (sh)</span>
          </button>
        </div>
      )}

      {standardizedCategory === "Database" && secret.developerFields && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
              <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Host / Endpoint</span>
              <span className="text-[10px] font-mono text-slate-300 truncate block pr-6">
                {secret.developerFields.dbHost || "localhost"}
              </span>
              <button
                onClick={() => copyText(secret.developerFields?.dbHost || "localhost", secret.id!, "db_host")}
                className="absolute right-2 top-2.5 text-slate-500 hover:text-white  "
              >
                {copiedId === secret.id && copiedField === "db_host" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <button
            onClick={() => handleCopyDbUri(secret.developerFields)}
            className="w-full py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-300 font-semibold font-mono text-[10px] rounded transition-all   flex items-center justify-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Skopiuj standardowy Connection String</span>
          </button>
        </div>
      )}

      {standardizedCategory === "SSH Keys" && secret.developerFields && (
        <div className="space-y-3">
          <div className="space-y-1 bg-[#070707] border border-white/5 p-2.5 rounded relative max-h-[160px] overflow-y-auto">
            <span className="block text-[8px] font-mono text-slate-500 uppercase">Klucz Prywatny RSA (Private Key)</span>
            <pre className="text-[9px] font-mono text-emerald-500/80 leading-normal select-all break-all whitespace-pre-wrap mt-1 select-all pr-6">
              {secret.developerFields.sshPrivateKey ? secret.developerFields.sshPrivateKey.substring(0, 70) + "..." : "Brak klucza"}
            </pre>
            {secret.developerFields.sshPrivateKey && (
              <button
                onClick={() => copyText(secret.developerFields?.sshPrivateKey || "", secret.id!, "ssh_key")}
                className="absolute right-2 top-2.5 text-slate-500 hover:text-white  "
                title="Skopiuj cały klucz SSH"
              >
                {copiedId === secret.id && copiedField === "ssh_key" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>
      )}

      {standardizedCategory === "API Keys" && secret.developerFields && (
        <div className="space-y-3">
          <button
            onClick={() => handleDownloadDotenv(secret.name, secret.developerFields?.dotenvContent)}
            className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 font-semibold font-mono text-[10px] rounded transition-all   flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 rotate-180" />
            <span>Pobierz jako plik .env</span>
          </button>
        </div>
      )}

      {["Websites", "Emails", "Notes", "Servers"].includes(standardizedCategory) && (
        <div className="space-y-3">
          {secret.url && (
            <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative flex items-center justify-between">
              <div className="min-w-0 pr-8">
                <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">URL adresu</span>
                <span className="text-xs font-mono text-slate-300 truncate block select-all">{secret.url}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyText(secret.url || "", secret.id!, "url")}
                  className="text-slate-500 hover:text-white  "
                >
                  {copiedId === secret.id && copiedField === "url" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={secret.url.startsWith("http") ? secret.url : `https://${secret.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 hover:text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {secret.username && (
            <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
              <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Nazwa Użytkownika / Email</span>
              <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">{secret.username}</span>
              <button
                onClick={() => copyText(secret.username || "", secret.id!, "user")}
                className="absolute right-2 top-3 text-slate-500 hover:text-white  "
              >
                {copiedId === secret.id && copiedField === "user" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {secret.password && (
            <div className="bg-[#121212] border border-white/5 p-2.5 rounded relative">
              <span className="block text-[9px] font-mono text-slate-500 uppercase mb-0.5">Klucz Hasła</span>
              <span className="text-xs font-mono text-slate-200 select-all pr-8 break-all">
                {isPassVisible ? secret.password : "••••••••••••••••"}
              </span>
              <div className="absolute right-2 top-3 flex items-center gap-1.5 text-slate-500">
                <button
                  onClick={() => setVisiblePasswords(p => ({ ...p, [secret.id!]: !p[secret.id!] }))}
                  className="hover:text-white  "
                >
                  {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => copyText(secret.password || "", secret.id!, "pass")}
                  className="hover:text-white  "
                >
                  {copiedId === secret.id && copiedField === "pass" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>
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
