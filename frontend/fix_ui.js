const fs = require('fs');
let content = fs.readFileSync('app/admin/program/page.tsx', 'utf8');

// Replace mock imports with API imports
content = content.replace(
  "import { Program, CurriculumModule, ProgramEnrollment, ProgramMentor, ProgramTimelineEvent, ProgramMetadata } from '@/src/data/mock-programs';",
  "import { ExtendedProgram as Program } from '@/src/services/program.service';\nimport { CurriculumModule, ProgramEnrollment, ProgramMentor, ProgramTimelineEvent, ProgramMetadata } from '@/src/data/mock-programs';"
);

// Map Program fields
content = content.replace(/\.id/g, '.program_id');
content = content.replace(/\.title/g, '.program_name');
content = content.replace(/\.organizationId/g, '.organization_id');
content = content.replace(/\.code/g, '.program_code');

fs.writeFileSync('app/admin/program/page.tsx', content);

let studentContent = fs.readFileSync('app/admin/student/page.tsx', 'utf8');

studentContent = studentContent.replace(
  "import { Student, StudentDocument, StudentApplication, TimelineEvent } from '@/src/data/mock-students';",
  "import { ExtendedStudent as Student } from '@/src/services/student.service';\nimport { StudentDocument, StudentApplication, TimelineEvent } from '@/src/data/mock-students';"
);

// Map Student fields
studentContent = studentContent.replace(/\.userId/g, '.user_id');
studentContent = studentContent.replace(/\.internId/g, '.intern_id');

fs.writeFileSync('app/admin/student/page.tsx', studentContent);
