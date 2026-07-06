import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/api/mentor.api.ts', 'r') as f:
    content = f.read()

new_create_mapping = """  createBatchMapping: async (data: MentorBatchMappingCreate): Promise<MentorBatchMapping> => {
    const payload = {
      mentor_id: data.mentorProfileId || (data as any).mentor_id,
      batch_id: data.batchId || (data as any).batch_id
    };
    const res = await apiClient.post<MentorBatchMapping>('/api/v1/mentor/batch-mappings/', payload);
    return (res as any).data?.data || res.data;
  },"""

content = re.sub(r'  createBatchMapping: async \(data: MentorBatchMappingCreate\): Promise<MentorBatchMapping> => \{.*?\n  \},', new_create_mapping, content, flags=re.DOTALL)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/api/mentor.api.ts', 'w') as f:
    f.write(content)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/services/batch.service.ts', 'r') as f:
    content = f.read()

content = content.replace("mentor_id: updates.mentor.id,", "mentorProfileId: updates.mentor.id,")
content = content.replace("batch_id: id", "batchId: id")

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/services/batch.service.ts', 'w') as f:
    f.write(content)

print("Done")
