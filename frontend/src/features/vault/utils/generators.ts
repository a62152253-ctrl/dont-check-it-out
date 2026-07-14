export const WORDLIST = [
  "server", "client", "cloud", "vault", "cyber", "access", "deploy", "docker", 
  "github", "lambda", "router", "kernel", "binary", "system", "matrix", "shield", 
  "crypto", "cipher", "secret", "socket", "subnet", "packet", "signal", "backup", 
  "vector", "stream", "buffer", "sensor", "carbon", "silicon", "quantum", "beacon", 
  "tunnel", "proxy", "portal", "vertex", "thread", "daemon", "process", "cluster", 
  "engine", "syntax", "source", "module", "commit", "branch", "merged", "status", 
  "online", "active", "secure", "bypass", "uplink", "packet", "cookie", "token", 
  "script", "remote", "safety", "verify", "compile", "buffer", "stack", "prompt",
  "engine", "index", "syntax", "static", "stream", "cipher", "crypto", "uptime"
];

export function generateSecurePassword(
  preset: "PASSWORD" | "PASSPHRASE" | "API_KEY" | "TOKEN" | "SSH_KEY",
  length: number,
  uppercase: boolean,
  lowercase: boolean,
  numbers: boolean,
  symbols: boolean,
  excludeAmbiguous: boolean,
  passphraseWords: number,
  passphraseSeparator: string
): string {
  if (preset === "PASSPHRASE") {
    const words: string[] = [];
    const randomArray = new Uint32Array(passphraseWords);
    window.crypto.getRandomValues(randomArray);
    for (let i = 0; i < passphraseWords; i++) {
      words.push(WORDLIST[randomArray[i] % WORDLIST.length]);
    }
    return words.join(passphraseSeparator);
  }

  if (preset === "API_KEY") {
    let result = "sk_live_";
    let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    if (excludeAmbiguous) {
      charset = charset.replace(/[oO0iIl1]/g, "");
    }
    const randomArray = new Uint32Array(length);
    window.crypto.getRandomValues(randomArray);
    for (let i = 0; i < length; i++) {
      result += charset[randomArray[i] % charset.length];
    }
    return result;
  }

  if (preset === "TOKEN") {
    let charset = "abcdef0123456789";
    if (excludeAmbiguous) {
      charset = charset.replace(/[oO0iIl1]/g, "");
    }
    let result = "tkn_";
    const randomArray = new Uint32Array(length);
    window.crypto.getRandomValues(randomArray);
    for (let i = 0; i < length; i++) {
      result += charset[randomArray[i] % charset.length];
    }
    return result;
  }

  if (preset === "SSH_KEY") {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let keyBody = "";
    const randomArray = new Uint32Array(128);
    window.crypto.getRandomValues(randomArray);
    for (let i = 0; i < 128; i++) {
      keyBody += charset[randomArray[i] % charset.length];
      if (i > 0 && i % 64 === 0) keyBody += "\n";
    }
    return `-----BEGIN OPENSSH PRIVATE KEY-----\n${keyBody}\n-----END OPENSSH PRIVATE KEY-----`;
  }

  // DEFAULT: PASSWORD
  let charset = "";
  if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (numbers) charset += "0123456789";
  if (symbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (excludeAmbiguous) {
    charset = charset.replace(/[oO0iIl1]/g, "");
  }

  if (charset === "") {
    return "";
  }

  let result = "";
  const randomArray = new Uint32Array(length);
  window.crypto.getRandomValues(randomArray);
  for (let i = 0; i < length; i++) {
    result += charset[randomArray[i] % charset.length];
  }
  return result;
}
