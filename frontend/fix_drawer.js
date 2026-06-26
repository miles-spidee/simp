const fs = require('fs');

const files = [
  '/Users/test/Documents/simp/frontend/components/admin/application/AddCandidateDrawer.tsx',
  '/Users/test/Documents/simp/frontend/components/admin/application/ReviewApplicationDrawer.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Re-add title="Add Candidate" / "Review Application" respectively
  if (file.includes('AddCandidateDrawer')) {
    content = content.replace(/<Drawer isOpen=\{isOpen\} onClose=\{onClose\}>/g, '<Drawer isOpen={isOpen} onClose={onClose} title="Add Candidate">');
  } else if (file.includes('ReviewApplicationDrawer')) {
    content = content.replace(/<Drawer isOpen=\{isOpen\} onClose=\{onClose\}>/g, '<Drawer isOpen={isOpen} onClose={onClose} title="Review Application">');
  }
  
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
