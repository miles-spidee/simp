import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/student/page.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'batchId: batchForm.name,\n      batchName: realBatchName', 'batch: { id: batchForm.name, name: realBatchName } as any', content)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/student/page.tsx', 'w') as f:
    f.write(content)

print("Done")
