const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('/Users/test/Documents/simp/frontend/components');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace title="anything" if it's likely on an icon 
  // It's safer to just replace it everywhere in components as they're mock components.
  let newContent = content.replace(/ title="[^"]*"/g, '');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});
