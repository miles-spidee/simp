import re

# Fix mentor batch-mappings
with open('/mnt/stuffs/PROJECTS/pine/simp/erp-backend/app/modules/mentor/router.py', 'r') as f:
    content = f.read()

if 'from app.core.dependencies import require_permission' in content:
    content = content.replace(
        'from app.core.dependencies import require_permission',
        'from app.core.dependencies import require_permission, get_current_user'
    )

content = content.replace(
    'current_user: User = Depends(require_permission("mentor", "read")),',
    'current_user: User = Depends(get_current_user),'
)

with open('/mnt/stuffs/PROJECTS/pine/simp/erp-backend/app/modules/mentor/router.py', 'w') as f:
    f.write(content)

print("Fixed mentor router")
