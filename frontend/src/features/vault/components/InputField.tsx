
import React from 'react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

export function InputField({ label, value, onChange, type = "text", placeholder = "" }: InputFieldProps) {
  return (
    <div>
      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#121212] border border-white/5 focus:border-white/20 rounded p-2 text-xs text-white outline-none font-mono"
      />
    </div>
  );
}
