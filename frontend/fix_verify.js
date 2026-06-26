const fs = require('fs');

const file = '/Users/test/Documents/simp/frontend/app/verify/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace ../../../components/ with @/components/
let newContent = content.replace(/\.\.\/\.\.\/\.\.\/components\//g, '@/components/');

if (content !== newContent) {
  fs.writeFileSync(file, newContent);
  console.log(`Updated ${file}`);
}
