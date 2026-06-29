import os
import re

files_to_fix = [
    '/Users/test/Documents/simp/frontend/app/feature/super-admin/page.tsx',
    '/Users/test/Documents/simp/frontend/components/feature/activity/ActivityDashboard.tsx',
    '/Users/test/Documents/simp/frontend/components/feature/escalation/EscalationDashboard.tsx',
    '/Users/test/Documents/simp/frontend/components/feature/leave/LeaveDashboard.tsx',
    '/Users/test/Documents/simp/frontend/components/feature/notification/NotificationDashboard.tsx',
    '/Users/test/Documents/simp/frontend/components/feature/reporting-manager/ReportingManagerDashboard.tsx'
]

for file_path in files_to_fix:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find </div> followed by <Pagination ... />
    # We want to swap their order.
    # Pattern: </div>\s*(<Pagination[\s\S]*?\/>)
    
    new_content = re.sub(r'<\/div>\s*(<Pagination[\s\S]*?\/>)', r'\1\n          </div>', content)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {file_path}")
    else:
        print(f"No match found in {file_path}")
