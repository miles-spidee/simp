const fs = require('fs');

function replaceUserId(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/user\.id/g, 'user.user_id');
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

replaceUserId('/Users/test/Documents/simp/frontend/app/feature/referrals/page.tsx');
replaceUserId('/Users/test/Documents/simp/frontend/app/feature/id-card/page.tsx');
