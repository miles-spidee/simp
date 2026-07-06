import re

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/allocation/page.tsx', 'r') as f:
    content = f.read()

# Add handling for college inside fetchOptions
fetch_options_replacement = """          } else if (type === 'program' || type === 'batch') {
             name = item.name || item.batch_name || item.program_name;
          } else if (type === 'college') {
             name = item.name || item.college_name || item.id;
          }"""

content = content.replace("          } else if (type === 'program' || type === 'batch') {\n             name = item.name || item.batch_name || item.program_name;\n          }", fetch_options_replacement)

with open('/mnt/stuffs/PROJECTS/pine/simp/frontend/app/feature/allocation/page.tsx', 'w') as f:
    f.write(content)

print("Done")
