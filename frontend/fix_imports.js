const fs = require('fs');
const files = [
  'app/feature/insights/page.tsx',
  'app/feature/referrals/page.tsx',
  'app/feature/marketplace/page.tsx',
  'app/feature/self-service/page.tsx',
  'app/feature/id-card/page.tsx',
  'app/feature/kpi/page.tsx',
  'app/feature/export/page.tsx',
  'app/feature/helpdesk/page.tsx',
  'app/feature/analytics/page.tsx',
  'app/feature/reports/page.tsx',
  'app/feature/productivity/page.tsx',
  'app/feature/executive/page.tsx'
];

files.forEach(file => {
  const filePath = `/Users/test/Documents/simp/frontend/${file}`;
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replacements
  content = content.replace(/@\/src\/context\/PermissionContext/g, '@/src/hooks/usePermissions');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
