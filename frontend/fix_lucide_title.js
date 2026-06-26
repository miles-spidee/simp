const fs = require('fs');

const file = '/Users/test/Documents/simp/frontend/components/admin/certificate/CertificateTable.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace title="View QR Code"
content = content.replace(/ title="View QR Code"/g, '');

fs.writeFileSync(file, content);
console.log(`Updated ${file}`);
