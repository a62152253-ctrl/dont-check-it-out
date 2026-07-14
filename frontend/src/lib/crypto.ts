/**
 * Web Crypto API client-side cryptographic functions for the
 * Zero-Knowledge Developer Secrets Vault.
 */

// Encoding helpers
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Byte generation helpers
export function generateRandomBytes(length: number): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(length));
}

/**
 * Derives a Key Encryption Key (KEK) from a Master Password using PBKDF2.
 */
export async function deriveKeyEncryptionKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey", "deriveBits"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts the random 256-bit Vault Key with the password-derived KEK.
 */
export async function encryptVaultKey(
  vaultKey: Uint8Array,
  kek: CryptoKey
): Promise<{ ciphertext: string; iv: string }> {
  const iv = generateRandomBytes(12);
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    kek,
    vaultKey
  );

  return {
    ciphertext: arrayBufferToBase64(encryptedBuffer),
    iv: arrayBufferToBase64(iv.buffer)
  };
}

/**
 * Decrypts the Vault Key using the password-derived KEK.
 */
export async function decryptVaultKey(
  encryptedVaultKeyBase64: string,
  ivBase64: string,
  kek: CryptoKey
): Promise<Uint8Array> {
  const encryptedBuffer = base64ToArrayBuffer(encryptedVaultKeyBase64);
  const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    kek,
    encryptedBuffer
  );

  return new Uint8Array(decryptedBuffer);
}

/**
 * Encrypts arbitrary text data (the stringified credentials payload)
 * with the 256-bit Vault Key.
 */
export async function encryptData(
  text: string,
  vaultKeyBytes: Uint8Array
): Promise<{ ciphertext: string; iv: string }> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(text);
  const iv = generateRandomBytes(12);

  // Import Vault Key bytes as a CryptoKey
  const vaultKey = await window.crypto.subtle.importKey(
    "raw",
    vaultKeyBytes,
    "AES-GCM",
    false,
    ["encrypt", "decrypt"]
  );

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    vaultKey,
    dataBuffer
  );

  return {
    ciphertext: arrayBufferToBase64(encryptedBuffer),
    iv: arrayBufferToBase64(iv.buffer)
  };
}

/**
 * Decrypts text data using the 256-bit Vault Key.
 */
export async function decryptData(
  ciphertextBase64: string,
  ivBase64: string,
  vaultKeyBytes: Uint8Array
): Promise<string> {
  const ciphertextBuffer = base64ToArrayBuffer(ciphertextBase64);
  const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));

  const vaultKey = await window.crypto.subtle.importKey(
    "raw",
    vaultKeyBytes,
    "AES-GCM",
    false,
    ["encrypt", "decrypt"]
  );

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    vaultKey,
    ciphertextBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}
