import os
import re

files_with_react = [
    '/Users/test/Documents/simp/frontend/components/feature/announcement/AnnouncementTable.tsx',
    '/Users/test/Documents/simp/frontend/components/feature/notification/NotificationDashboard.tsx',
    '/Users/test/Documents/simp/frontend/components/feature/notification/NotificationTable.tsx'
]

for fpath in files_with_react:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = content.replace('React.useState(1)', 'useState(1)')
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_content)

files_with_active_profile = [
    '/Users/test/Documents/simp/frontend/app/feature/batch/page.tsx',
    '/Users/test/Documents/simp/frontend/app/feature/program/page.tsx'
]

for fpath in files_with_active_profile:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Find activeProfile.id and replace with activeProfile?.id
    new_content = content.replace('activeProfile.id', 'activeProfile?.id')
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Fixed TS errors")
