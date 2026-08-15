import React from "react";

interface Props {
  sshHost: string;
  setSshHost: (v: string) => void;
  sshPassphrase: string;
  setSshPassphrase: (v: string) => void;
  sshPrivateKey: string;
  setSshPrivateKey: (v: string) => void;
}

export function SSHForm({ sshHost, setSshHost, sshPassphrase, setSshPassphrase, sshPrivateKey, setSshPrivateKey }: Props) {
  return (
    <div className="bg-[#0c0c0c] border border-white/5 p-4 rounded-lg space-y-4">
      <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">SSH Security Credentials</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Zdalny Host połączenia</label>
          <input
            type="text"
            value={sshHost}
            onChange={(e) => setSshHost(e.target.value)}
            placeholder="ubuntu@192.168.1.5"
            className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Passphrase (Opcjonalnie)</label>
          <input
            type="password"
            value={sshPassphrase}
            onChange={(e) => setSshPassphrase(e.target.value)}
            placeholder="Wpisz hasło klucza SSH..."
            className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Klucz Prywatny RSA (Private Key)</label>
        <textarea
          value={sshPrivateKey}
          onChange={(e) => setSshPrivateKey(e.target.value)}
          placeholder="-----BEGIN RSA PRIVATE KEY-----..."
          className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono h-24 resize-y"
        />
      </div>
    </div>
  );
}
export default SSHForm;
