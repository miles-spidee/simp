with open('/mnt/stuffs/PROJECTS/pine/simp/erp-backend/app/core/security_filters.py', 'r') as f:
    content = f.read()

content = content.replace(
    "Allocation.source_type == 'USER',",
    "Allocation.source_id == user_id,"
)

# And remove the duplicate Allocation.source_id == user_id, since the first one was replaced
content = content.replace(
    "            Allocation.source_id == user_id,\n            Allocation.source_id == user_id,",
    "            Allocation.source_id == user_id,"
)

# In case the replace didn't work perfectly, let's just use re
import re
new_content = re.sub(
    r"Allocation\.source_type\s*==\s*['\"]USER['\"],\s*Allocation\.source_id\s*==\s*user_id,",
    "Allocation.source_id == user_id,",
    content
)

with open('/mnt/stuffs/PROJECTS/pine/simp/erp-backend/app/core/security_filters.py', 'w') as f:
    f.write(new_content)

print("Fixed security filters")
