import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/api/mentor.api.ts', 'r') as f:
    content = f.read()

# Fix getting data for getBatchMappings and createBatchMapping
content = content.replace("return res.data;", "return (res as any).data?.data || res.data;")

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/api/mentor.api.ts', 'w') as f:
    f.write(content)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/services/batch.service.ts', 'r') as f:
    content = f.read()

# Make updateBatch call mentorApi
imports = "import { mentorApi } from '../api/mentor.api';\n"
if "import { mentorApi" not in content:
    content = imports + content

new_updateBatch = """  async updateBatch(id: string, updates: Partial<ExtendedBatch>): Promise<ExtendedBatch | undefined> {
    try {
      const current = await batchApi.getBatch(id);
      const req: any = {
        program_id: current.program_id,
        batch_code: updates.code || current.batch_code,
        batch_name: updates.name || current.batch_name,
        max_capacity: updates.capacity || current.max_capacity,
        start_date: current.start_date,
        end_date: current.end_date,
        batch_status: updates.status || current.batch_status,
        internship_type: updates.internshipType || (updates as any).internship_type || (current as any).internship_type
      };
      
      const res = await batchApi.updateBatch(id, req);
      
      if (updates.mentor?.id) {
         try {
             await mentorApi.createBatchMapping({
                 mentor_id: updates.mentor.id,
                 batch_id: id
             });
         } catch(e) { console.error("Error mapping mentor to batch", e); }
      }
      
      return this.mapToExtended(res);
    } catch (e) {
      console.debug(e);
      return undefined;
    }
  },"""

content = re.sub(r'  async updateBatch\(id: string, updates: Partial<ExtendedBatch>\): Promise<ExtendedBatch \| undefined> \{.*?\n  \},', new_updateBatch, content, flags=re.DOTALL)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/services/batch.service.ts', 'w') as f:
    f.write(content)

print("Done")
