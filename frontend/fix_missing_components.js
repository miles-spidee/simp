const fs = require('fs');

const missingComponentPages = [
  '/Users/test/Documents/simp/frontend/app/feature/billing/page.tsx',
  '/Users/test/Documents/simp/frontend/app/feature/fees/page.tsx',
  '/Users/test/Documents/simp/frontend/app/feature/finance-dashboard/page.tsx',
  '/Users/test/Documents/simp/frontend/app/feature/payments/page.tsx',
  '/Users/test/Documents/simp/frontend/app/feature/wallet/page.tsx'
];

missingComponentPages.forEach(file => {
  const compName = file.split('/').slice(-2)[0].replace(/-./g, x => x[1].toUpperCase());
  const content = `export default function ${compName.charAt(0).toUpperCase() + compName.slice(1)}Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 capitalize">${compName}</h1>
      <p>Under Construction</p>
    </div>
  );
}`;
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
