import os

with open("frontend/src/features/vault/components/SecretInspector/index.tsx", "r") as f:
    content = f.read()

content = content.replace("import { mapLegacyCategory } from \"../../hooks/useVault\";\n", "import { mapLegacyCategory } from \"../../hooks/useVault\";\nimport type { DeveloperFields } from \"../../types\";\n")
content = content.replace("migrateLegacyEntry,\n  } = useVaultContext();", "migrateLegacyEntry,\n    successMsg,\n    setSuccessMsg\n  } = useVaultContext();")

with open("frontend/src/features/vault/components/SecretInspector/index.tsx", "w") as f:
    f.write(content)
