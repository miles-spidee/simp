import os
import re

files_to_check = [
    '/Users/test/Documents/simp/frontend/app/feature/attendance/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/organization/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/insights/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/settings/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/my-tasks/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/task-management/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/lms/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/referrals/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/lms-management/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/management/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/roles/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/id-builder/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/assessment/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/id-card/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/attendance-management/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/task/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/kpi/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/my-learning/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/export/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/my-assessments/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/modules/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/employee/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/assessment-management/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/analytics/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/productivity/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/executive/page.tsx'
]

# We will just print out the most likely array being mapped for each file so I can generate a precise replacement script.
for f in files_to_check:
    if not os.path.exists(f):
        continue
    with open(f, 'r') as file:
        content = file.read()
    
    if '<Pagination' in content:
        continue

    # Find the largest .map block or filtered*.map
    matches = re.findall(r'(\w+)\.map\s*\(\s*\(?\s*\w+', content)
    # Count occurrences or find 'filtered'
    if matches:
        filtered = [m for m in matches if 'filtered' in m.lower()]
        best_match = filtered[0] if filtered else matches[0]
        print(f"File: {os.path.basename(f)} -> Map: {best_match}")
    else:
        print(f"File: {os.path.basename(f)} -> No map found")
