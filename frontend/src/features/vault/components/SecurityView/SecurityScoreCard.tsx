import React, { useMemo } from "react";
import { Shield } from "lucide-react";
import { useVaultContext } from "@/features/vault/context/useVaultContext";
import { getPasswordStrength } from "@/features/vault/utils/passwordStrength";
import { mapLegacyCategory } from "@/features/vault/hooks/useVault";

export function SecurityScoreCard() {
  const { decryptedEntries } = useVaultContext();

  const stats = useMemo(() => {
    let strongCount = 0;
    let weakCount = 0;
    let legacyCount = 0;
    const activeEntries = decryptedEntries.filter(e => !e.isTrash);

    activeEntries.forEach(entry => {
      if (entry.isLegacy) legacyCount++;
      const checkPassword = entry.password || (entry.developerFields?.awsSecretAccessKey) || "";
      const strength = getPasswordStrength(checkPassword);
      if (strength.score >= 5) strongCount++;
      if (strength.score <= 2) weakCount++;
    });

    return {
      total: activeEntries.length,
      strong: strongCount,
      weak: weakCount,
      legacy: legacyCount
    };
  }, [decryptedEntries]);

  const duplicatedCount = useMemo(() => {
    const active = decryptedEntries.filter(e => !e.isTrash);
    const passwords = active.map(e => e.password || e.developerFields?.awsSecretAccessKey || "").filter(Boolean);
    const counts: Record<string, number> = {};
    passwords.forEach(p => counts[p] = (counts[p] || 0) + 1);
    return Object.values(counts).filter(count => count > 1).reduce((acc, c) => acc + c, 0);
  }, [decryptedEntries]);

  const securityScore = useMemo(() => {
    if (decryptedEntries.length === 0) return 100;
    let score = 100;
    
    // Deduct points for weak passwords
    const weakPct = stats.weak / decryptedEntries.length;
    score -= Math.round(weakPct * 40);
    
    // Deduct points for legacy plain-text secrets
    const legacyPct = stats.legacy / decryptedEntries.length;
    score -= Math.round(legacyPct * 30);
    
    // Deduct points for duplicates
    if (decryptedEntries.length > 0) {
      const dupPct = duplicatedCount / decryptedEntries.length;
      score -= Math.round(dupPct * 20);
    }
    
    return Math.max(25, Math.min(100, score));
  }, [decryptedEntries, stats, duplicatedCount]);

  return (
    <div className="bg-[#0c0c0c] border border-white/5 rounded-lg p-6 space-y-4 shadow-xl">
      <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
        <Shield className="w-5 h-5 text-emerald-400" />
        <h3 className="text-sm font-semibold uppercase text-slate-300 font-mono">Centrum Bezpieczeństwa Sejfu / Vault Security Center</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-4 text-center p-4 bg-[#121212] border border-white/5 rounded-lg">
          <span className="block text-[10px] font-mono font-bold text-slate-500 uppercase">Wskaźnik Bezpieczeństwa</span>
          <div className="text-4xl font-light text-white my-2">{securityScore}%</div>
          
          {/* Visual Progress Bar */}
          <div className="flex justify-center gap-0.5 font-mono text-[9px] mb-2">
            {Array.from({ length: 10 }).map((_, i) => {
              const isActive = i < Math.round(securityScore / 10);
              return (
                <span key={i} className={isActive ? "text-emerald-400" : "text-slate-800"}>█</span>
              );
            })}
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
            securityScore >= 80 ? "text-emerald-400 bg-emerald-500/10" : securityScore >= 50 ? "text-amber-400 bg-amber-500/10" : "text-rose-400 bg-rose-500/10"
          }`}>
            {securityScore >= 80 ? "Bardzo Silny" : securityScore >= 50 ? "Umiarkowany" : "Krytyczny"}
          </span>
        </div>

        <div className="md:col-span-8 space-y-3 font-mono text-xs text-slate-400">
          <p className="leading-relaxed">
            Centrum Bezpieczeństwa przeprowadza w locie (zero-knowledge) analizę podatności Twoich haseł, kluczy API, tokenów oraz certyfikatów deweloperskich.
          </p>
          <p className="leading-relaxed">
            Wszystkie analizy wykonywane są w 100% lokalnie w przeglądarce za pomocą interfejsu WebCrypto API. Klucz szyfrowania nigdy nie opuszcza Twojej pamięci RAM.
          </p>
        </div>
      </div>
    </div>
  );
}
export default SecurityScoreCard;
