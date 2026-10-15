const fs = require('fs');
const path = 'frontend/src/features/vault/repositories/LocalVaultRepository.ts';
let content = fs.readFileSync(path, 'utf8');

// A robust replacement strategy:
// Replace 'async saveEntry' with 'saveEntry' but we need to ensure the return type is explicitly Promise<...> to match the interface if there's any strictness, but wait, the interface VaultRepository explicitly defines them as Promise returning.
// So if we just remove `async` and make them return `Promise.resolve()`, TS will be happy.

content = content.replace(/async saveEntry\([\s\S]*?\): Promise<string> \{/, `saveEntry(
    uid: string,
    id: string | null,
    entry: Omit<EncryptedSecretEntry, "id" | "uid">
  ): Promise<string> {`);
content = content.replace(/return finalId;/, 'return Promise.resolve(finalId);');

content = content.replace(/async deleteEntry\(id: string\): Promise<void> \{/, 'deleteEntry(id: string): Promise<void> {');
content = content.replace(/vaultStorage.saveSandboxEntries\(filtered\);/, 'vaultStorage.saveSandboxEntries(filtered);\n    return Promise.resolve();');

content = content.replace(/async updateFavoriteStatus\(id: string, isFavorite: boolean\): Promise<void> \{/, 'updateFavoriteStatus(id: string, isFavorite: boolean): Promise<void> {');
content = content.replace(/vaultStorage.saveSandboxEntries\(entries\);\n    \}/, 'vaultStorage.saveSandboxEntries(entries);\n    }\n    return Promise.resolve();');

content = content.replace(/async updateTrashStatus\(id: string, isTrash: boolean\): Promise<void> \{/, 'updateTrashStatus(id: string, isTrash: boolean): Promise<void> {');
content = content.replace(/vaultStorage.saveSandboxEntries\(entries\);\n    \}(\n\n  async getVaultConfig)/, 'vaultStorage.saveSandboxEntries(entries);\n    }\n    return Promise.resolve();$1');

content = content.replace(/async getVaultConfig\(uid: string\): Promise<VaultConfig \| null> \{/, 'getVaultConfig(uid: string): Promise<VaultConfig | null> {');
content = content.replace(/return vaultStorage.getVaultConfig\(uid\);/, 'return Promise.resolve(vaultStorage.getVaultConfig(uid));');

content = content.replace(/async saveVaultConfig\(uid: string, config: VaultConfig \| null\): Promise<void> \{/, 'saveVaultConfig(uid: string, config: VaultConfig | null): Promise<void> {');
content = content.replace(/vaultStorage.clearVaultConfig\(uid\);\n    \}/, 'vaultStorage.clearVaultConfig(uid);\n    }\n    return Promise.resolve();');

content = content.replace(/async resetVault\(uid: string, entries: EncryptedSecretEntry\[\]\): Promise<void> \{/, 'resetVault(uid: string, entries: EncryptedSecretEntry[]): Promise<void> {');
content = content.replace(/vaultStorage.clearVaultConfig\(uid\);/, 'vaultStorage.clearVaultConfig(uid);\n    return Promise.resolve();');

fs.writeFileSync(path, content, 'utf8');
