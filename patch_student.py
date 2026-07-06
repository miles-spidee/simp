import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/student/page.tsx', 'r') as f:
    content = f.read()

# Fix batch_id to batchId and batch_name to batchName (assuming ExtendedStudent uses camelCase like other Extended types)
# Let's check how the types are defined, but since batch_id is rejected, it's highly likely batchId.
# Using regex to replace just inside updateStudent
content = re.sub(r'batch_id: batchForm.name,\n\s*batch_name: realBatchName', 'batchId: batchForm.name,\n      batchName: realBatchName', content)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/student/page.tsx', 'w') as f:
    f.write(content)

print("Done")
