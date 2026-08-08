import os
import re

directory = 'frontend/src/features/vault/components'

def fix_imports(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # In GeneratorView and SecurityView, the relative path was ../../../ instead of ../../
    if 'GeneratorView' in filepath or 'SecurityView' in filepath:
        content = re.sub(r'from "\.\.\/\.\.\/\.\.\/', 'from "../../', content)
        content = re.sub(r'from \'\.\.\/\.\.\/\.\.\/', 'from \'../../', content)
    else:
        # For direct files in components, the relative path was ../../ instead of ../
        # but only for paths starting with context, utils, types, hooks, services inside features/vault.
        # It's easier to just replace ../../ with ../ for the known internal paths
        for p in ['context', 'utils', 'types', 'hooks', 'services']:
            content = re.sub(f'from "\\.\\./\\.\\./{p}', f'from "../{p}', content)
            content = re.sub(f'from \'\\.\\./\\.\\./{p}', f'from \'../{p}', content)

    # VaultSetup and VaultUnlock have ../../../../lib/translations, should be ../../../lib/translations
    content = re.sub(r'from "\.\.\/\.\.\/\.\.\/\.\.\/lib\/translations', 'from "../../../lib/translations', content)
    content = re.sub(r'from \'\.\.\/\.\.\/\.\.\/\.\.\/lib\/translations', 'from \'../../../lib/translations', content)

    with open(filepath, 'w') as f:
        f.write(content)

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_imports(os.path.join(root, file))

print("Done fixing imports in components.")
