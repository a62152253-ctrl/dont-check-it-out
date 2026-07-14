import { WORDLIST } from "./generators";

export interface PasswordStrengthInfo {
  score: number;
  label: string;
  color: string;
}

export function getPasswordStrength(pass: string): PasswordStrengthInfo {
  let score = 0;
  if (!pass) return { score, label: "Puste", color: "text-slate-500 bg-slate-500/10" };
  if (pass.length >= 8) score++;
  if (pass.length >= 14) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  if (score <= 2) return { score, label: "Słabe", color: "text-rose-400 bg-rose-500/10" };
  if (score <= 4) return { score, label: "Średnie", color: "text-amber-400 bg-amber-500/10" };
  return { score, label: "Silne (Enterprise)", color: "text-emerald-400 bg-emerald-500/10" };
}

export interface EntropyDetails {
  bits: number;
  rating: string;
  color: string;
  time: string;
}

export function getEntropyDetails(
  genPreset: "PASSWORD" | "PASSPHRASE" | "API_KEY" | "TOKEN" | "SSH_KEY",
  genLength: number,
  genUppercase: boolean,
  genLowercase: boolean,
  genNumbers: boolean,
  genSymbols: boolean,
  genExcludeAmbiguous: boolean,
  genPassphraseWords: number
): EntropyDetails {
  let charsetSize = 0;
  let length = genLength;
  
  if (genPreset === "PASSPHRASE") {
    charsetSize = WORDLIST.length;
    length = genPassphraseWords;
  } else if (genPreset === "API_KEY") {
    charsetSize = genExcludeAmbiguous ? 54 : 62;
  } else if (genPreset === "TOKEN") {
    charsetSize = genExcludeAmbiguous ? 11 : 16;
  } else if (genPreset === "SSH_KEY") {
    charsetSize = 64;
    length = 128;
  } else {
    if (genUppercase) charsetSize += 26;
    if (genLowercase) charsetSize += 26;
    if (genNumbers) charsetSize += 10;
    if (genSymbols) charsetSize += 26;
    if (genExcludeAmbiguous && charsetSize > 8) {
      charsetSize -= 8;
    }
  }

  if (charsetSize === 0 || length === 0) {
    return { bits: 0, rating: "Puste", color: "text-slate-500", time: "Brak" };
  }

  const bits = Math.round(length * Math.log2(charsetSize));
  
  let rating = "Słaba (Weak)";
  let color = "text-rose-400";
  let time = "Natychmiast (Instant)";

  if (bits >= 100) {
    rating = "Bulletproof Enterprise-Grade";
    color = "text-violet-400";
    time = "Biliony wieków (Trillions of years)";
  } else if (bits >= 75) {
    rating = "Bardzo Silna (Ultra-Secure)";
    color = "text-emerald-400";
    time = "Miliony lat (Millions of years)";
  } else if (bits >= 50) {
    rating = "Średnia (Moderate)";
    color = "text-amber-400";
    time = "Wiele lat / wieki (Many years)";
  } else {
    rating = "Słaba (Weak)";
    color = "text-rose-400";
    time = "Parę godzin / dni (Hours or days)";
  }

  return { bits, rating, color, time };
}
