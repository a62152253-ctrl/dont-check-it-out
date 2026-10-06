import os

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    if "lucide-react" in content and "Cpu" not in content and "index.tsx" in filepath:
        # replace the multiline import
        lines = content.split('\n')
        new_lines = []
        skip = False
        for line in lines:
            if "import {" in line and "Star" in lines[lines.index(line)+1]:
                skip = True
                new_lines.append('import { Cpu } from "lucide-react";')
            elif skip and "from \"lucide-react\";" in line:
                skip = False
            elif not skip:
                new_lines.append(line)
        content = '\n'.join(new_lines)

        with open(filepath, 'w') as f:
            f.write(content)

fix_file("frontend/src/features/vault/components/SecretInspector/index.tsx")
