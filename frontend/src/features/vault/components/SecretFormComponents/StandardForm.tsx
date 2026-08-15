import React from "react";

interface Props {
  category: string;
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  url: string;
  setUrl: (v: string) => void;
}

export function StandardForm({ category, username, setUsername, password, setPassword, url, setUrl }: Props) {
  return (
    <div className="bg-[#0c0c0c] border border-white/5 p-4 rounded-lg space-y-4">
      <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400">Dane Dostępowe Logowania</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Login / Email / Nazwa użytkownika</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Wpisz login..."
            className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Hasło deweloperskie</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wpisz hasło..."
            className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono"
          />
        </div>
      </div>
      {category === "Web Login" && (
        <div>
          <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">URL Adresu WWW</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://dashboard.stripe.com"
            className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono"
          />
        </div>
      )}
    </div>
  );
}
export default StandardForm;
