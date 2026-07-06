import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/services/batch.service.ts', 'r') as f:
    content = f.read()

# Fix the syntax error: remove the extra "});"
content = content.replace("} as any\n             });", "} as any);")

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/services/batch.service.ts', 'w') as f:
    f.write(content)

print("Done")
