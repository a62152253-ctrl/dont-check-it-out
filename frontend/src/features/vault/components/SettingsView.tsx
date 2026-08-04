import React from "react";
import { Settings, RefreshCw } from "lucide-react";
import { useVaultContext } from '../context/useVaultContext';
import { triggerBackupDownload } from '../services/backup.service';
import { AccentThemeName } from '../hooks/useVaultTheme';

export function SettingsView() {
  const {
    autoLockMinutes,
    setAutoLockMinutes,
    accentTheme,
    changeAccentTheme,
    language,
    setLanguage,
    decryptedEntries,
    resetVault,
    isSandbox
  } = useVaultContext();

  const importInputRef = React.useRef<HTMLInputElement>(null);

  const handleExportBackup = () => {
    triggerBackupDownload(decryptedEntries);
  };

  return (
    <div className="lg:col-span-9 space-y-6">
      <div className="bg-[#0c0c0c] border border-white/5 rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Settings className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-semibold uppercase text-slate-300 font-mono">Ustawienia Sejfu / Security Settings</h3>
        </div>

        {/* Autoblokada */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase text-slate-400 font-bold">Czas bezczynności do blokady sejfu (Auto-lock)</label>
          <p className="text-[10px] font-mono text-slate-500 leading-normal">
            Dla bezpieczeństwa, jeśli nie wykażesz aktywności w oknie, klucze sesji zostaną usunięte z lokalnej pamięci RAM.
          </p>
          <select
            value={autoLockMinutes}
            onChange={(e) => setAutoLockMinutes(parseInt(e.target.value))}
            className="bg-[#121212] border border-white/10 hover:border-white/20 text-white rounded p-2 text-xs font-mono outline-none cursor-pointer"
          >
            <option value={1}>1 Minuta</option>
            <option value={5}>5 Minut</option>
            <option value={10}>10 Minut</option>
            <option value={30}>30 Minut</option>
            <option value={0}>Nigdy (Niebezpieczne)</option>
          </select>
        </div>

        {/* Kastomizacja Interfejsu (Personalizacja) */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <label className="block text-xs font-mono uppercase text-slate-400 font-bold">
            {language === "PL" ? "Personalizacja Wyglądu" : "Appearance Customization"}
          </label>
          <p className="text-[10px] font-mono text-slate-500 leading-normal">
            {language === "PL" 
              ? "Wybierz główny neonowy kolor akcentu dla deweloperskiego kokpitu:" 
              : "Choose the primary neon accent color for your developer dashboard:"}
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1">
            {(["emerald", "amber", "indigo", "mint", "rose", "cyan", "violet"] as AccentThemeName[]).map((themeName) => {
              const themeObj = {
                emerald: { name: "Emerald", color: "bg-emerald-500" },
                amber: { name: "Amber", color: "bg-amber-500" },
                indigo: { name: "Indigo", color: "bg-indigo-500" },
                mint: { name: "Mint", color: "bg-teal-500" },
                rose: { name: "Rose", color: "bg-rose-500" },
                cyan: { name: "Cyan", color: "bg-cyan-500" },
                violet: { name: "Violet", color: "bg-violet-500" }
              }[themeName];
              const isSelected = accentTheme === themeName;
              return (
                <button
                  key={themeName}
                  type="button"
                  onClick={() => changeAccentTheme(themeName)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-white/[0.04] text-white border-white/40 shadow-md font-bold" 
                      : "bg-white/5 text-slate-400 border-transparent hover:text-white"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${themeObj.color}`} />
                  <span>{themeObj.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Język (Language) Selection */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <label className="block text-xs font-mono uppercase text-slate-400 font-bold">
            {language === "PL" ? "Język Aplikacji" : "Application Language"}
          </label>
          <div className="flex gap-2">
            {(["PL", "EN"] as const).map((lang) => {
              const isSelected = language === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-white text-black border-white font-bold" 
                      : "bg-white/5 text-slate-400 border-transparent hover:text-white"
                  }`}
                >
                  {lang === "PL" ? "Polski" : "English"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Backup & Data Controls */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <label className="block text-xs font-mono uppercase text-slate-400 font-bold">Kopie zapasowe i dane</label>
          <div className="p-4 bg-[#121212] border border-white/5 rounded-lg space-y-3 max-w-md">
            <h5 className="text-xs font-semibold text-white">Eksportuj Sejf (Zaszyfrowany JSON)</h5>
            <p className="text-[10px] font-mono text-slate-500">Pobierz kopię zapasową wszystkich wpisów w bezpiecznym formacie.</p>
            <button
              onClick={handleExportBackup}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded border border-white/5 text-[10px] font-mono transition-all cursor-pointer"
            >
              Pobierz kopie JSON
            </button>
          </div>
        </div>

        {/* Status połączenia z chmurą */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <label className="block text-xs font-mono uppercase text-slate-400 font-bold">Status połączenia chmurowego</label>
          <div className="p-3 bg-[#121212] border border-white/5 rounded-lg flex items-center justify-between text-xs font-mono">
            <div className="space-y-1">
              <span className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                {isSandbox ? "Lokalny Sejf Sandbox (Offline)" : "Wszędzie bezpieczny (Synchronizowany)"}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {isSandbox ? "Lokalny magazyn LocalStorage" : "Durable Cloud Provider: Firebase Firestore (Active)"}
              </span>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded">
              {isSandbox ? "Offline" : "Connected"}
            </span>
          </div>
        </div>

        {/* Reset sejfu */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <label className="block text-xs font-mono uppercase text-rose-500 font-bold">Strefa Niebezpieczna (Danger Zone)</label>
          <p className="text-[10px] font-mono text-slate-500 leading-normal">
            Chcesz całkowicie skasować swoje hasła, klucze oraz konfigurację PBKDF2 sejfu, aby zacząć od nowa? Tej akcji nie można cofnąć.
          </p>
          <button
            onClick={resetVault}
            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded border border-rose-500/20 text-[10px] font-mono transition-all cursor-pointer"
          >
            Skasuj i zresetuj sejf
          </button>
        </div>
      </div>
    </div>
  );
}
export default SettingsView;
