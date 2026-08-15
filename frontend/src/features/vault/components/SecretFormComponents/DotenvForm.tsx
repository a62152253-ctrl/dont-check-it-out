import React from "react";

interface Props {
  dotenvContent: string;
  setDotenvContent: (v: string) => void;
}

export function DotenvForm({ dotenvContent, setDotenvContent }: Props) {
  return (
    <div className="bg-[#0c0c0c] border border-white/5 p-4 rounded-lg space-y-4">
      <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">Konfiguracja zmiennych środowiskowych</span>
      <div>
        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">Wklej plik .env</label>
        <textarea
          value={dotenvContent}
          onChange={(e) => setDotenvContent(e.target.value)}
          placeholder="API_KEY=12345
DEBUG=true
PORT=3000"
          className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-emerald-400 outline-none font-mono h-40 resize-y"
        />
      </div>
    </div>
  );
}
export default DotenvForm;
