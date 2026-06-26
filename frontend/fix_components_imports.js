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
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('/Users/test/Documents/simp/frontend/components');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace relative paths to services, types, data
  let newContent = content.replace(/['"](\.\.\/)+services\//g, "'@/src/services/");
  newContent = newContent.replace(/['"](\.\.\/)+types\//g, "'@/src/types/");
  newContent = newContent.replace(/['"](\.\.\/)+data\//g, "'@/src/data/");
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});
