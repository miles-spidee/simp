import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/store/errorStore.ts', 'r') as f:
    content = f.read()

new_import = """export type ActionType = 'refresh' | 'login' | 'forgot_password' | 'retry' | 'close';

export interface ApiErrorData {
  status?: number;
  title: string;
  explanation: string;
  primaryAction?: ActionType;
  secondaryAction?: ActionType;
}
"""

content = content.replace("import { ApiErrorData } from '../lib/errorUtils';", new_import)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/store/errorStore.ts', 'w') as f:
    f.write(content)

print("Done")
