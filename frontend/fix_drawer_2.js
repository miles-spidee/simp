const fs = require('fs');
const file = '/Users/test/Documents/simp/frontend/components/admin/application/ReviewApplicationDrawer.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/<Drawer isOpen=\{isOpen\} onClose=\{onClose\} size="lg">/g, '<Drawer isOpen={isOpen} onClose={onClose} size="lg" title="Review Application">');
fs.writeFileSync(file, content);
console.log(`Updated ${file}`);
