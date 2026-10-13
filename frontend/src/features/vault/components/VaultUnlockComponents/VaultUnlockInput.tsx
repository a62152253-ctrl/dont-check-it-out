import React from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  label: string;
  placeholder: string;
}

export const VaultUnlockInput = ({ value, onChange, label, placeholder }: Props) => (
  <div>
    <div className="flex items-center justify-between mb-1.5 px-0.5">
      <label className="text-[10px] font-mono uppercase text-emerald-500/80 tracking-wider font-bold">{label}</label>
      <span className="text-[9px] font-mono text-slate-600">AES-GCM-256</span>
    </div>
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      className="w-full bg-[#121212]/80 border border-white/5 hover:border-white/10 focus:border-emerald-500/40 rounded-xl p-3 text-xs text-white outline-none font-mono transition-all duration-200 focus:bg-[#121212] focus:ring-1 focus:ring-emerald-500/20"
    />
  </div>
);
