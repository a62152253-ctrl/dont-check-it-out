import os
import re

def remove_cursor_pointer(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()

                # Simple replacement for "cursor-pointer" in class names
                # Technically it should only be removed from native interactive elements like button, a
                # Let's do a regex replacement on buttons and anchor tags specifically

                # A bit complicated with regex, let's just do a naive regex to find cursor-pointer inside className of <button and <a
                # Actually, the rule says "omitting redundant 'cursor-pointer' classes on native interactive elements like buttons"
                # It's easier to just find all cursor-pointer and remove them since buttons/links already have cursor pointer by default in most resets,
                # but to be safe we should target <button... and <a ...

                def replace_func(match):
                    return match.group(0).replace('cursor-pointer', '').replace('  ', ' ')

                # Replace cursor-pointer in <button ... > tags
                content = re.sub(r'<button[^>]*>', replace_func, content)
                # Replace cursor-pointer in <a ... > tags
                content = re.sub(r'<a[^>]*>', replace_func, content)

                with open(filepath, 'w') as f:
                    f.write(content)

remove_cursor_pointer('frontend/src')
print("Removed cursor-pointer from buttons and links")
