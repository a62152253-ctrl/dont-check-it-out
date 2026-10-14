import type { DeveloperFields } from "../types";

export const handleCopyAWSExports = (fields: DeveloperFields | undefined, setSuccessMsg: (msg: string | null) => void) => {
  if (!fields) return;
  const format = `export AWS_ACCESS_KEY_ID=${fields.awsAccessKeyId || ""}\nexport AWS_SECRET_ACCESS_KEY=${fields.awsSecretAccessKey || ""}\nexport AWS_DEFAULT_REGION=${fields.region || "us-east-1"}`;
  navigator.clipboard.writeText(format).then(() => {
    setSuccessMsg("Skopiowano eksport AWS (Shell Environment variables)!");
    setTimeout(() => setSuccessMsg(null), 3000);
  }).catch(() => {});
};

export const handleCopyDbUri = (fields: DeveloperFields | undefined, setSuccessMsg: (msg: string | null) => void) => {
  if (!fields) return;
  const engine = (fields.dbEngine || "postgresql").toLowerCase();
  const uri = `${engine}://${fields.dbUser || ""}:${fields.dbPassword || ""}@${fields.dbHost || "localhost"}:${fields.dbPort || "5432"}/${fields.dbName || ""}`;
  navigator.clipboard.writeText(uri).then(() => {
    setSuccessMsg("Skopiowano URI połączenia bazy danych!");
    setTimeout(() => setSuccessMsg(null), 3000);
  }).catch(() => {});
};

export const handleDownloadDotenv = (name: string, content: string | undefined, setSuccessMsg: (msg: string | null) => void) => {
  if (!content) return;
  const element = document.createElement("a");
  const file = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.env`;

  element.click();

  setSuccessMsg("Plik .env wygenerowany i pobrany pomyślnie!");
  setTimeout(() => setSuccessMsg(null), 3000);
};
