import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/services/batch.service.ts', 'r') as f:
    content = f.read()

content = content.replace("batchId: id", "batchId: id\n             } as any")
# We already had "})" below it, so now it will be "} as any\n             });" which is wrong, it should be "} as any);"
# Let's use regex
content = re.sub(
    r'await mentorApi\.createBatchMapping\(\{\n\s*mentorProfileId: updates\.mentor\.id,\n\s*batchId: id\n\s*\}\);',
    'await mentorApi.createBatchMapping({\n                 mentorProfileId: updates.mentor.id,\n                 batchId: id\n             } as any);',
    content
)


with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/services/batch.service.ts', 'w') as f:
    f.write(content)

print("Done")
