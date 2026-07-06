import re

# Patch student.service.ts
with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/services/student.service.ts', 'r') as f:
    content = f.read()

update_logic = """      if (updates.status) {
        payload.status = updates.status;
        payload.student_status = updates.status as any;
      }
      
      if (updates.college_id) {
        (payload as any).college_id = updates.college_id;
      }
      
      if (updates.batch && (updates.batch as any).name) {
        payload.batch_name = (updates.batch as any).name;
      }"""

content = content.replace("""      if (updates.status) {
        payload.status = updates.status;
        payload.student_status = updates.status;
      }""", update_logic)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/src/services/student.service.ts', 'w') as f:
    f.write(content)

# Patch page.tsx
with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/student/page.tsx', 'r') as f:
    content = f.read()

# Fix handleUpdateBatch so it uses both batch and internshipInfo
old_batch = """    const updated = await studentService.updateStudent(studentId, {
      batch: { id: batchForm.name, name: realBatchName } as any
    });"""

new_batch = """    const updated = await studentService.updateStudent(studentId, {
      batch: { id: batchForm.name, name: realBatchName } as any,
      internshipInfo: {
        ...activeProfile.internshipInfo,
        batchName: realBatchName
      }
    });"""

content = content.replace(old_batch, new_batch)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/student/page.tsx', 'w') as f:
    f.write(content)

print("Done")
