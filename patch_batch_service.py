import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/services/batch.service.ts', 'r') as f:
    content = f.read()

# Replace getBatchMappings calls to cast the result to any[]
content = re.sub(r'mappings = await mentorApi.getBatchMappings\(\);', 'mappings = (await mentorApi.getBatchMappings()) as any[];', content)
content = re.sub(r'const mappings = await mentorApi.getBatchMappings\(\);', 'const mappings = (await mentorApi.getBatchMappings()) as any[];', content)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/services/batch.service.ts', 'w') as f:
    f.write(content)

print("Done")
