import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/mentor/profile/BatchMappingView.tsx', 'r') as f:
    content = f.read()

# Fix b.id -> b.batch_id
content = re.sub(r'b\.id(?!_)', 'b.batch_id', content)
# Fix b.name -> b.batch_name
content = re.sub(r'b\.name', 'b.batch_name', content)
# Fix b.code -> b.batch_code
content = re.sub(r'b\.code', 'b.batch_code', content)
# Fix mapForm.batch_id -> mapForm.batch_id since the above sub might have affected it if we aren't careful? No, it's b.id.

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/mentor/profile/BatchMappingView.tsx', 'w') as f:
    f.write(content)

print("Done")
