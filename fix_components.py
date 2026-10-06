import os

def check_props_length(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # check if component definition spans multiple lines
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if "export function" in line and "(" in line and ")" not in line:
            return True
    return False

def fix_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()

    new_lines = []
    in_component_def = False
    buffer = ""

    for line in lines:
        if "export function" in line and "(" in line and ")" not in line:
            in_component_def = True
            buffer += line.strip() + " "
        elif in_component_def:
            if "):" in line or ") {" in line:
                buffer += line.strip()
                new_lines.append(buffer + '\n')
                in_component_def = False
                buffer = ""
            else:
                buffer += line.strip() + " "
        else:
            new_lines.append(line)

    with open(filepath, 'w') as f:
        f.writelines(new_lines)


for root, dirs, files in os.walk("frontend/src/features/vault/components/SecretInspector"):
    for file in files:
        if file.endswith(".tsx"):
            filepath = os.path.join(root, file)
            if check_props_length(filepath):
                fix_file(filepath)
