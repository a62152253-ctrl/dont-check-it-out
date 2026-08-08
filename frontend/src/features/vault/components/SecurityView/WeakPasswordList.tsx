import React, { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { useVaultContext } from "../../context/useVaultContext";
import { getPasswordStrength } from "../../utils/passwordStrength";
import { generateSecurePassword } from "../../utils/generators";

export function WeakPasswordList() {
  const { decryptedEntries, saveSecret, setSuccessMsg, addActivityLog } = useVaultContext();

  const weakSecrets = useMemo(() => {
    return decryptedEntries.filter(e => {
      if (e.isTrash) return false;
      const checkPassword = e.password || e.developerFields?.awsSecretAccessKey || "";
      const strength = getPasswordStrength(checkPassword);
      return strength.score <= 2 && checkPassword.length > 0;
    });
  }, [decryptedEntries]);

  const handleAutoRotate = async (secret: any) => {
    try {
      const newPass = generateSecurePassword("PASSWORD", 32, true, true, true, true, false, 4, "-");
      const developerFields = secret.developerFields ? { ...secret.developerFields } : {};
      
      let updatedPass = secret.password;
      if (secret.category === "AWS Credentials") {
        developerFields.awsSecretAccessKey = newPass;
      } else if (secret.category === "Database Connection") {
        developerFields.dbPassword = newPass;
      } else if (secret.category === "SSH Key") {
        developerFields.sshPrivateKey = newPass;
      } else {
        updatedPass = newPass;
      }

      const payload = {
        name: secret.name,
        username: secret.username,
        password: updatedPass,
        url: secret.url,
        notes: secret.notes,
        project: secret.project,
        environment: secret.environment,
        developerFields: Object.keys(developerFields).length > 0 ? developerFields : undefined
      };

      await saveSecret(secret.id, secret.name, secret.category, payload);
      
      navigator.clipboard.writeText(newPass);
      addActivityLog("Auto-Rotated Password", `Zrotowano słabe hasło dla: ${secret.name}`);
      setSuccessMsg(`Pomyślnie zrotowano hasło dla ${secret.name}! Nowy klucz skopiowano do schowka.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#0c0c0c] border border-white/5 rounded-lg p-5 space-y-4">
      <h4 className="text-xs font-semibold uppercase text-slate-300 font-mono border-b border-white/5 pb-2 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-rose-400" />
        Analiza Słabych Haseł / Weak Credentials
      </h4>
      <p className="text-[11px] font-mono text-slate-500 leading-normal">
        Poniższe pozycje mają słabe wskaźniki siły hasła (krótkie, brak znaków specjalnych). Użyj generatora rotacyjnego.
      </p>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {weakSecrets.length === 0 ? (
          <p className="text-[11px] font-mono text-emerald-400 py-2">✓ Brak słabych haseł w Twoim aktywnym sejfie.</p>
        ) : (
          weakSecrets.map((e) => {
            const val = e.password || e.developerFields?.awsSecretAccessKey || "";
            return (
              <div key={e.id} className="p-3 bg-[#121212] border border-rose-500/10 rounded flex items-center justify-between gap-3 text-xs font-mono">
                <div className="min-w-0">
                  <span className="text-white font-bold block truncate">{e.name}</span>
                  <span className="text-[10px] text-slate-500 block truncate mt-0.5">{e.category} • Długość: {val.length}</span>
                </div>
                <button
         onClick={() => handleAutoRotate(e)}
                  className="px-2 py-1.5 bg-[#121212] hover:bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:text-rose-300 rounded text-[10px] cursor-pointer transition-all shrink-0 font-bold"
                >
                  Auto-Rotuj i Kopiuj
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
export default WeakPasswordList;
