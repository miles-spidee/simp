import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/components/common/ErrorDialog.tsx', 'r') as f:
    content = f.read()

# Replace the missing import with an inline type definition
content = re.sub(r"import { ActionType } from '../../lib/errorUtils';", "export type ActionType = 'RETRY' | 'LOGIN' | 'CONTACT_SUPPORT' | 'HOME' | 'RELOAD';", content)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/components/common/ErrorDialog.tsx', 'w') as f:
    f.write(content)

print("Done")
