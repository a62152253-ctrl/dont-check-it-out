import { useState, useMemo } from "react";
import * as vaultStorage from "../services/vaultStorage.service";

export type AccentThemeName = "emerald" | "amber" | "indigo" | "mint" | "rose" | "cyan" | "violet";

export interface VaultThemeClasses {
  text: string;
  textHover: string;
  border: string;
  borderActive: string;
  bg: string;
  bgHover: string;
  primary: string;
  glow: string;
  ring: string;
  accent: string;
  indicator: string;
  badge: string;
}

export function useVaultTheme() {
  const [accentTheme, setAccentThemeState] = useState<AccentThemeName>(() => {
    const saved = vaultStorage.getAccentTheme();
    return (saved as AccentThemeName) || "emerald";
  });

  const changeAccentTheme = (themeName: AccentThemeName, logActivityCallback?: (theme: string) => void) => {
    setAccentThemeState(themeName);
    vaultStorage.saveAccentTheme(themeName);
    if (logActivityCallback) {
      logActivityCallback(themeName);
    }
  };

  const theme = useMemo<VaultThemeClasses>(() => {
    const maps: Record<AccentThemeName, VaultThemeClasses> = {
      emerald: {
        text: "text-emerald-400",
        textHover: "hover:text-emerald-300",
        border: "border-emerald-500/20",
        borderActive: "border-emerald-500/50",
        bg: "bg-emerald-500/10",
        bgHover: "hover:bg-emerald-500/20",
        primary: "bg-emerald-500 hover:bg-emerald-600 text-black",
        glow: "shadow-emerald-500/10",
        ring: "focus:ring-emerald-500/30",
        accent: "emerald",
        indicator: "bg-emerald-500",
        badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
      },
      amber: {
        text: "text-amber-400",
        textHover: "hover:text-amber-300",
        border: "border-amber-500/20",
        borderActive: "border-amber-500/50",
        bg: "bg-amber-500/10",
        bgHover: "hover:bg-amber-500/20",
        primary: "bg-amber-500 hover:bg-amber-600 text-black",
        glow: "shadow-amber-500/10",
        ring: "focus:ring-amber-500/30",
        accent: "amber",
        indicator: "bg-amber-500",
        badge: "bg-amber-500/10 text-amber-400 border border-amber-500/10"
      },
      indigo: {
        text: "text-indigo-400",
        textHover: "hover:text-indigo-300",
        border: "border-indigo-500/20",
        borderActive: "border-indigo-500/50",
        bg: "bg-indigo-500/10",
        bgHover: "hover:bg-indigo-500/20",
        primary: "bg-indigo-500 hover:bg-indigo-600 text-white",
        glow: "shadow-indigo-500/10",
        ring: "focus:ring-indigo-500/30",
        accent: "indigo",
        indicator: "bg-indigo-500",
        badge: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
      },
      mint: {
        text: "text-teal-400",
        textHover: "hover:text-teal-300",
        border: "border-teal-500/20",
        borderActive: "border-teal-500/50",
        bg: "bg-teal-500/10",
        bgHover: "hover:bg-teal-500/20",
        primary: "bg-teal-500 hover:bg-teal-600 text-black",
        glow: "shadow-teal-500/10",
        ring: "focus:ring-teal-500/30",
        accent: "teal",
        indicator: "bg-teal-500",
        badge: "bg-teal-500/10 text-teal-400 border border-teal-500/10"
      },
      rose: {
        text: "text-rose-400",
        textHover: "hover:text-rose-300",
        border: "border-rose-500/20",
        borderActive: "border-rose-500/50",
        bg: "bg-rose-500/10",
        bgHover: "hover:bg-rose-500/20",
        primary: "bg-rose-500 hover:bg-rose-600 text-white",
        glow: "shadow-rose-500/10",
        ring: "focus:ring-rose-500/30",
        accent: "rose",
        indicator: "bg-rose-500",
        badge: "bg-rose-500/10 text-rose-400 border border-rose-500/10"
      },
      cyan: {
        text: "text-cyan-400",
        textHover: "hover:text-cyan-300",
        border: "border-cyan-500/20",
        borderActive: "border-cyan-500/50",
        bg: "bg-cyan-500/10",
        bgHover: "hover:bg-cyan-500/20",
        primary: "bg-cyan-500 hover:bg-cyan-600 text-black",
        glow: "shadow-cyan-500/10",
        ring: "focus:ring-cyan-500/30",
        accent: "cyan",
        indicator: "bg-cyan-500",
        badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/10"
      },
      violet: {
        text: "text-violet-400",
        textHover: "hover:text-violet-300",
        border: "border-violet-500/20",
        borderActive: "border-violet-500/50",
        bg: "bg-violet-500/10",
        bgHover: "hover:bg-violet-500/20",
        primary: "bg-violet-500 hover:bg-violet-600 text-white",
        glow: "shadow-violet-500/10",
        ring: "focus:ring-violet-500/30",
        accent: "violet",
        indicator: "bg-violet-500",
        badge: "bg-violet-500/10 text-violet-400 border border-violet-500/10"
      }
    };
    return maps[accentTheme] || maps.emerald;
  }, [accentTheme]);

  return {
    accentTheme,
    changeAccentTheme,
    theme
  };
}
