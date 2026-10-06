import os

with open("frontend/src/features/vault/components/SecretInspector/index.tsx", "r") as f:
    content = f.read()

content = content.replace("import type { DeveloperFields } from \"../../types\";\n", "")

with open("frontend/src/features/vault/components/SecretInspector/index.tsx", "w") as f:
    f.write(content)
