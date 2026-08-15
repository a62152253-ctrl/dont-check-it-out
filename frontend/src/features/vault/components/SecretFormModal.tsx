import React, { useState, useEffect } from "react";
import { X, Lock, Sliders, Database, Server, Key, Folder, Globe, Cpu } from "lucide-react";
import { useVaultContext } from "../context/useVaultContext";
import { DeveloperFields, DecryptedSecret } from "../types";
import AWSForm from "./SecretFormComponents/AWSForm";
import DatabaseForm from "./SecretFormComponents/DatabaseForm";
import SSHForm from "./SecretFormComponents/SSHForm";
import DotenvForm from "./SecretFormComponents/DotenvForm";
import StandardForm from "./SecretFormComponents/StandardForm";

export function SecretFormModal() {
  const {
    isFormOpen,
    setIsFormOpen,
    editingId,
    setEditingId,
    decryptedEntries,
    saveSecret,
    error,
    setError
  } = useVaultContext();

  // Local form inputs
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("AWS Credentials");
  const [notes, setNotes] = useState("");

  // Developer specific fields
  const [awsAccessKeyId, setAwsAccessKeyId] = useState("");
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState("");
  const [region, setRegion] = useState("us-east-1");
  const [dbHost, setDbHost] = useState("");
  const [dbPort, setDbPort] = useState("");
  const [dbUser, setDbUser] = useState("");
  const [dbPassword, setDbPassword] = useState("");
  const [dbName, setDbName] = useState("");
  const [dbEngine, setDbEngine] = useState("PostgreSQL");
  const [sshHost, setSshHost] = useState("");
  const [sshPrivateKey, setSshPrivateKey] = useState("");
  const [sshPassphrase, setSshPassphrase] = useState("");
  const [dotenvContent, setDotenvContent] = useState("");
  const [project, setProject] = useState("");
  const [environment, setEnvironment] = useState("development");

  // Effect to populate form inputs when editingId is set
  useEffect(() => {
    if (editingId) {
      const secret = decryptedEntries.find(e => e.id === editingId);
      if (secret) {
        setName(secret.name || "");
        setUrl(secret.url || "");
        setUsername(secret.username || "");
        setPassword(secret.password || "");
        
        // Map database standard representation to form category selector values
        let formCat = secret.category;
        if (formCat === "AWS") formCat = "AWS Credentials";
        else if (formCat === "Database") formCat = "Database Connection";
        else if (formCat === "SSH Keys") formCat = "SSH Key";
        else if (formCat === "API Keys") formCat = "Dotenv / Config";
        else if (formCat === "Websites") formCat = "Web Login";
        else if (formCat === "Notes") formCat = "Inne";
        
        setCategory(formCat);
        setNotes(secret.notes || "");
        setProject(secret.project || "");
        setEnvironment(secret.environment || "development");

        const dev = secret.developerFields;
        if (dev) {
          setAwsAccessKeyId(dev.awsAccessKeyId || "");
          setAwsSecretAccessKey(dev.awsSecretAccessKey || "");
          setRegion(dev.region || "us-east-1");
          setDbHost(dev.dbHost || "");
          setDbPort(dev.dbPort || "");
          setDbUser(dev.dbUser || "");
          setDbPassword(dev.dbPassword || "");
          setDbName(dev.dbName || "");
          setDbEngine(dev.dbEngine || "PostgreSQL");
          setSshHost(dev.sshHost || "");
          setSshPrivateKey(dev.sshPrivateKey || "");
          setSshPassphrase(dev.sshPassphrase || "");
          setDotenvContent(dev.dotenvContent || "");
        } else {
          clearDevFields();
        }
      }
    } else {
      // Clear all inputs for new entry creation
      setName("");
      setUrl("");
      setUsername("");
      setPassword("");
      setCategory("AWS Credentials");
      setNotes("");
      setProject("");
      setEnvironment("development");
      clearDevFields();
    }
  }, [editingId, isFormOpen, decryptedEntries]);

  const clearDevFields = () => {
    setAwsAccessKeyId("");
    setAwsSecretAccessKey("");
    setRegion("us-east-1");
    setDbHost("");
    setDbPort("");
    setDbUser("");
    setDbPassword("");
    setDbName("");
    setDbEngine("PostgreSQL");
    setSshHost("");
    setSshPrivateKey("");
    setSshPassphrase("");
    setDotenvContent("");
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const devFields: DeveloperFields = {};

    if (category === "AWS Credentials") {
      devFields.awsAccessKeyId = awsAccessKeyId.trim();
      devFields.awsSecretAccessKey = awsSecretAccessKey.trim();
      devFields.region = region;
    } else if (category === "Database Connection") {
      devFields.dbEngine = dbEngine;
      devFields.dbHost = dbHost.trim();
      devFields.dbPort = dbPort.trim();
      devFields.dbUser = dbUser.trim();
      devFields.dbPassword = dbPassword;
      devFields.dbName = dbName.trim();
    } else if (category === "SSH Key") {
      devFields.sshHost = sshHost.trim();
      devFields.sshPrivateKey = sshPrivateKey.trim();
      devFields.sshPassphrase = sshPassphrase;
    } else if (category === "Dotenv / Config") {
      devFields.dotenvContent = dotenvContent;
    }

    const payload: Omit<DecryptedSecret, "category"> = {
      name: name.trim(),
      username: username.trim() || undefined,
      password: password || undefined,
      url: url.trim() || undefined,
      notes: notes.trim() || undefined,
      project: project.trim() || undefined,
      environment: environment,
      developerFields: Object.keys(devFields).length > 0 ? devFields : undefined
    };

    // Standardize database category name to sync
    let dbCategory = category;
    if (category === "Inne") dbCategory = "Notes";

    await saveSecret(editingId, name, dbCategory, payload);
  };

  if (!isFormOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#080808]/95 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-8 relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-slate-300">
              {editingId ? "Edycja sekretu" : "Nowy sekret deweloperski (Encrypt in Transit)"}
            </h3>
          </div>
          <button 
            onClick={handleClose} 
            className="text-slate-500 hover:text-white transition-all cursor-pointer p-1 hover:bg-white/5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-rose-950/20 border border-rose-900/40 text-rose-300 rounded text-xs">
              {error}
            </div>
          )}

          {/* Grid fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5 font-bold">Tytuł / Nazwa (Plain-text)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="np. AWS Production, Slack Token"
                required
                className="w-full bg-[#121212] border border-white/10 hover:border-white/20 focus:border-white/30 rounded-lg p-2.5 text-xs text-white outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5 font-bold">Kategoria / Typ klucza</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  clearDevFields();
                }}
                className="w-full bg-[#121212] border border-white/10 hover:border-white/20 focus:border-white/30 rounded-lg p-2.5 text-xs text-white outline-none font-mono cursor-pointer"
              >
                <option value="AWS Credentials">☁️ AWS (Certyfikat / IAM)</option>
                <option value="Database Connection">🗄️ Database (Postgres, Mongo)</option>
                <option value="SSH Key">🔑 SSH (Klucze RSA / Host)</option>
                <option value="Dotenv / Config">📄 Dotenv (Konfiguracja pliku .env)</option>
                <option value="Web Login">🌐 Websites (Logowanie WWW)</option>
                <option value="Email Config">✉️ Emails (SMTP, Mailgun)</option>
                <option value="Inne">📦 Notes (Secure note / Notatki)</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC FORMS BY CATEGORY */}

          {/* AWS CREDENTIALS */}
          {category === "AWS Credentials" && (
            <AWSForm
              awsAccessKeyId={awsAccessKeyId}
              setAwsAccessKeyId={setAwsAccessKeyId}
              awsSecretAccessKey={awsSecretAccessKey}
              setAwsSecretAccessKey={setAwsSecretAccessKey}
              region={region}
              setRegion={setRegion}
            />
          )}

          {/* DATABASE CONNECTION */}
          {category === "Database Connection" && (
            <DatabaseForm
              dbEngine={dbEngine}
              setDbEngine={setDbEngine}
              dbHost={dbHost}
              setDbHost={setDbHost}
              dbPort={dbPort}
              setDbPort={setDbPort}
              dbName={dbName}
              setDbName={setDbName}
              dbUser={dbUser}
              setDbUser={setDbUser}
              dbPassword={dbPassword}
              setDbPassword={setDbPassword}
            />
          )}

          {/* SSH KEY */}
          {category === "SSH Key" && (
            <SSHForm
              sshHost={sshHost}
              setSshHost={setSshHost}
              sshPassphrase={sshPassphrase}
              setSshPassphrase={setSshPassphrase}
              sshPrivateKey={sshPrivateKey}
              setSshPrivateKey={setSshPrivateKey}
            />
          )}

          {/* DOTENV CONFIG */}
          {category === "Dotenv / Config" && (
            <DotenvForm
              dotenvContent={dotenvContent}
              setDotenvContent={setDotenvContent}
            />
          )}

          {/* WEBSITES / NOTES / EMAILS (General inputs) */}
          {["Web Login", "Email Config", "Inne"].includes(category) && (
            <StandardForm
              category={category}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              url={url}
              setUrl={setUrl}
            />
          )}

          {/* PROJECT INFO AND SCOPES */}
          <div className="border-t border-white/5 pt-4 space-y-4">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Grupowanie / Zakres deweloperski (Plain-text metadata)</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Nazwa Projektu (np. e-commerce, core-api)</label>
                <input
                  type="text"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="Brak przypisanego projektu"
                  className="w-full bg-[#121212] border border-white/10 hover:border-white/20 focus:border-white/30 rounded-lg p-2.5 text-xs text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Środowisko (Environment scope)</label>
                <select
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 hover:border-white/20 focus:border-white/30 rounded-lg p-2.5 text-xs text-white outline-none font-mono cursor-pointer"
                >
                  <option value="production">🔴 Production (Serwer produkcyjny)</option>
                  <option value="staging">🟡 Staging (Serwer testowy / QA)</option>
                  <option value="development">🔵 Development (Serwer lokalny / Dev)</option>
                  <option value="local">⚪ Local (Zmienne deweloperskie PC)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes field */}
          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5 font-bold">Uwagi / Dodatkowe zaszyfrowane notatki</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="np. Dodatkowe hasła zapasowe, adresy IP VPN..."
              className="w-full h-20 bg-[#121212] border border-white/10 hover:border-white/20 focus:border-white/30 rounded-lg p-2.5 text-xs text-white outline-none font-mono resize-none leading-relaxed"
            />
          </div>

          {/* Submit button */}
          <div className="pt-2 shrink-0">
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs rounded-lg transition-all shadow-lg hover:shadow-emerald-500/10 cursor-pointer text-center"
            >
              Dodaj i zaszyfruj (Save)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SecretFormModal;
