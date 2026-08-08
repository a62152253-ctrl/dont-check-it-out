import re

filepath = 'frontend/src/features/vault/types/index.ts'
with open(filepath, 'r') as f:
    content = f.read()

content = content.replace('import { DeveloperFields } from "shared";', 'import type { DeveloperFields } from "shared";\nexport type { DeveloperFields };')

with open(filepath, 'w') as f:
    f.write(content)

print("Done patching types/index.ts")
