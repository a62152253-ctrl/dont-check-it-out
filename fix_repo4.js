const fs = require('fs');
const path = 'frontend/src/features/vault/repositories/LocalVaultRepository.ts';
let content = fs.readFileSync(path, 'utf8');

// The original file had the signatures returning Promise.
// SonarCloud was complaining about `async` modifier with no `await` inside.
// So we just need to keep the function signatures as returning Promise, remove the async keyword, and wrap the return values in Promise.resolve()
// AND change the method signature return type explicit definition if needed (wait, they didn't have explicit return types defined, they were inferred).
// Let's just do it directly.

content = content.replace(/async saveEntry\([\s\S]*?\) \{/g, 'saveEntry(uid: string, id: string | null, entry: Omit<EncryptedSecretEntry, "id" | "uid">): Promise<string> {');
content = content.replace(/return finalId;/g, 'return Promise.resolve(finalId);');

content = content.replace(/async deleteEntry\(id: string\) \{/g, 'deleteEntry(id: string): Promise<void> {');
content = content.replace(/vaultStorage.saveSandboxEntries\(filtered\);\n  \}/g, 'vaultStorage.saveSandboxEntries(filtered);\n    return Promise.resolve();\n  }');

content = content.replace(/async updateFavoriteStatus\(id: string, isFavorite: boolean\) \{/g, 'updateFavoriteStatus(id: string, isFavorite: boolean): Promise<void> {');
content = content.replace(/vaultStorage.saveSandboxEntries\(entries\);\n    \}\n  \}/g, 'vaultStorage.saveSandboxEntries(entries);\n    }\n    return Promise.resolve();\n  }');

content = content.replace(/async updateTrashStatus\(id: string, isTrash: boolean\) \{/g, 'updateTrashStatus(id: string, isTrash: boolean): Promise<void> {');
// updateTrashStatus has the exact same ending, so it got handled above or needs to be handled exactly. We'll use a safer approach for these voids:
