const fs = require('fs');
const file = '/Users/test/Documents/simp/frontend/components/admin/alumni/AlumniDirectory.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace Linkedin with Link
content = content.replace(/Linkedin/g, 'Link');

fs.writeFileSync(file, content);
console.log('Fixed AlumniDirectory.tsx');
