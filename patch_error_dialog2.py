import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/components/common/ErrorDialog.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "export type ActionType = 'RETRY' | 'LOGIN' | 'CONTACT_SUPPORT' | 'HOME' | 'RELOAD';",
    "export type ActionType = 'RETRY' | 'LOGIN' | 'CONTACT_SUPPORT' | 'HOME' | 'RELOAD' | 'close';"
)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/components/common/ErrorDialog.tsx', 'w') as f:
    f.write(content)

print("Done")
