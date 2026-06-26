const fs = require('fs');

const file = '/Users/test/Documents/simp/frontend/app/feature/helpdesk/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace user.id with user.user_id in getMyTickets(user.id)
let newContent = content.replace(/user\.id/g, 'user.user_id');

if (content !== newContent) {
  fs.writeFileSync(file, newContent);
  console.log(`Updated ${file}`);
}
