const fs = require('fs');
const path = require('path');

const primaryRegex = /\btext-(slate|gray|sky)-(950|900|800|700)\b/g;
const secondaryRegex = /\btext-(slate|gray|sky)-(650|600|550|500|450|400)\b/g;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  newContent = newContent.replace(primaryRegex, 'text-text-primary');
  newContent = newContent.replace(secondaryRegex, 'text-text-secondary');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        processDirectory(fullPath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

processDirectory('./app');
processDirectory('./components');
console.log("Done updating text colors.");
