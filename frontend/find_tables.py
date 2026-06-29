import os
import glob
import re

directories = [
    '/Users/test/Documents/simp/frontend/app/feature',
    '/Users/test/Documents/simp/frontend/components/feature'
]

files_with_map = []

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if '.map(' in content and '<tr' in content:
                        files_with_map.append(path)

print(f"Total files with table mapping: {len(files_with_map)}")
for f in files_with_map:
    print(f"- {f}")
