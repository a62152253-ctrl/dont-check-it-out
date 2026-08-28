import React from "react";

export default function LanguageSwitcher({
  language,
  setLanguage
}: {
  language: "PL" | "EN";
  setLanguage: (lang: "PL" | "EN") => void
}) {
  return (
    <div className="flex gap-1 bg-white/5 border border-white/5 rounded-lg p-0.5 text-[10px]">
      <button
        type="button"
        onClick={() => setLanguage("PL")}
        className={`px-2.5 py-1 rounded-md font-mono transition-all duration-200 cursor-pointer ${
          language === "PL"
            ? "bg-white/10 text-white font-bold shadow-sm"
            : "text-slate-500 hover:text-white"
        }`}
      >
        PL
      </button>
      <button
        type="button"
        onClick={() => setLanguage("EN")}
        className={`px-2.5 py-1 rounded-md font-mono transition-all duration-200 cursor-pointer ${
          language === "EN"
            ? "bg-white/10 text-white font-bold shadow-sm"
            : "text-slate-500 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}