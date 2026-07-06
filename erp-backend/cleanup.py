import re

with open('app/modules/report/utils.py', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'rows.append(["' in line:
        continue
    new_lines.append(line)

with open('app/modules/report/utils.py', 'w') as f:
    f.writelines(new_lines)
