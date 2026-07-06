import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/allocation/page.tsx', 'r') as f:
    content = f.read()

# 1. Update TabKey
content = content.replace(
    "type TabKey = 'overview' | 'student' | 'mentor' | 'program' | 'report_manager' | 'finance_manager' | 'user';",
    "type TabKey = 'overview' | 'student' | 'mentor' | 'program' | 'report_manager' | 'finance_manager' | 'user' | 'college_coordinator';"
)

# 2. Add to loadSourceOptions
load_source_options = """        case 'college_coordinator': endpoint = '/api/v1/users/by-role/COLLEGE_COORDINATOR'; type = 'user'; break;
        case 'user':"""
content = content.replace("case 'user':", load_source_options)

# 3. Add to loadTargetOptions
load_target_options = """        case 'BATCH': endpoint = '/api/v1/batch/'; type = 'batch'; break;
        case 'COLLEGE': endpoint = '/api/v1/student/colleges'; type = 'college'; break;
        case 'USER':"""
content = content.replace("case 'USER':", load_target_options)

# 4. Add to TABS array
tabs_addition = """    { id: 'finance_manager', label: 'Finance Manager Mapping', icon: Building },
    { id: 'college_coordinator', label: 'College Coordinator Mapping', icon: Building },
"""
content = content.replace("{ id: 'finance_manager', label: 'Finance Manager Mapping', icon: Building },\n", tabs_addition)

# 5. Add COLLEGE to target options
target_dropdown = """                      <option value="PROGRAM">PROGRAM</option>
                      <option value="BATCH">BATCH</option>
                      <option value="COLLEGE">COLLEGE</option>
"""
content = content.replace('<option value="PROGRAM">PROGRAM</option>\n                      <option value="BATCH">BATCH</option>\n', target_dropdown)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/allocation/page.tsx', 'w') as f:
    f.write(content)

print("Done")
