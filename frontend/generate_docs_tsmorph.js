const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');
const path = require('path');

const project = new Project({
  tsConfigFilePath: path.join(__dirname, 'tsconfig.json'),
});

const apiDir = path.join(__dirname, 'src', 'api');
const serviceDir = path.join(__dirname, 'src', 'services');

const apiFiles = project.getSourceFiles(path.join(apiDir, '*.api.ts'));
const serviceFiles = project.getSourceFiles(path.join(serviceDir, '*.service.ts'));

let markdown = `# SIMP ERP System - API & Variables Documentation\n\n`;
markdown += `This document outlines all variables, functions, API requests (GET, POST, PUT, DELETE, PATCH), payload schemas, response structures, and state management destinations across all modules of the SIMP application.\n\n`;

markdown += `## Table of Contents\n`;
let i = 1;
for (const apiFile of apiFiles) {
  const name = apiFile.getBaseNameWithoutExtension().replace('.api', '');
  const title = name.charAt(0).toUpperCase() + name.slice(1);
  markdown += `${i}. [${title} Module](#${name}-module)\n`;
  i++;
}
markdown += `\n---\n\n`;

for (const apiFile of apiFiles) {
  const name = apiFile.getBaseNameWithoutExtension().replace('.api', '');
  const title = name.charAt(0).toUpperCase() + name.slice(1);
  markdown += `## ${title} Module\n\n`;
  
  // Find the exported object (e.g., const roleApi = { ... })
  const variableDecls = apiFile.getVariableDeclarations();
  for (const vDecl of variableDecls) {
    if (vDecl.getName().endsWith('Api')) {
      const initializer = vDecl.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
      if (initializer) {
        const properties = initializer.getProperties();
        for (const prop of properties) {
           if (prop.getKind() === SyntaxKind.PropertyAssignment) {
               const propName = prop.getName();
               const func = prop.getInitializerIfKind(SyntaxKind.ArrowFunction) || prop.getInitializerIfKind(SyntaxKind.FunctionExpression);
               if (func) {
                   // Parse arguments
                   const params = func.getParameters().map(p => ({
                       name: p.getName(),
                       type: p.getTypeNode() ? p.getTypeNode().getText() : 'any'
                   }));
                   
                   // Parse return type
                   let returnType = func.getReturnTypeNode() ? func.getReturnTypeNode().getText() : 'any';
                   
                   // Try to find apiClient calls inside body
                   const body = func.getBody();
                   const callExprs = body.getDescendantsOfKind(SyntaxKind.CallExpression);
                   
                   let httpMethod = 'UNKNOWN';
                   let endpoint = 'UNKNOWN';
                   let payload = 'None';
                   
                   for (const call of callExprs) {
                       const expr = call.getExpression();
                       if (expr.getKind() === SyntaxKind.PropertyAccessExpression) {
                           const propAccess = expr;
                           const objName = propAccess.getExpression().getText();
                           if (objName === 'apiClient') {
                               httpMethod = propAccess.getName().toUpperCase();
                               const args = call.getArguments();
                               if (args.length > 0) endpoint = args[0].getText();
                               if (args.length > 1) payload = args[1].getText();
                           }
                       }
                   }
                   
                   if (httpMethod !== 'UNKNOWN') {
                       markdown += `### \`${propName}\`\n\n`;
                       markdown += `* **API Endpoints Call**:\n`;
                       markdown += `  * **Endpoint**: \`${endpoint}\`\n`;
                       markdown += `  * **HTTP Method**: \`${httpMethod}\`\n`;
                       if (params.length > 0) {
                           markdown += `  * **Parameters Sent**: \n`;
                           params.forEach(p => markdown += `    * \`${p.name}\`: \`${p.type}\`\n`);
                       } else {
                           markdown += `  * **Parameters Sent**: None\n`;
                       }
                       if (payload !== 'None') {
                           markdown += `  * **Payload Data Format Sent**: \`${payload}\`\n`;
                       }
                       
                       markdown += `* **Response Received**:\n`;
                       markdown += `  * **Variables & Types**: \`${returnType}\`\n\n`;
                   }
               }
           }
        }
      }
    }
  }
  
  // Find matching service file to see if there's frontend state management or local storage
  const serviceFile = serviceFiles.find(f => f.getBaseNameWithoutExtension() === `${name}.service`);
  if (serviceFile) {
     markdown += `* **Frontend Storage State (Service)**:\n`;
     // check if localStorage is used
     const ls = serviceFile.getText().match(/localStorage\.setItem\((['"`])(.*?)\1/g);
     if (ls) {
        markdown += `  * Uses \`localStorage\`: ${Array.from(new Set(ls.map(l => l.split(',')[0].replace('localStorage.setItem(', '')))).join(', ')}\n`;
     } else {
        // check mock data usage
        const mockImports = serviceFile.getImportDeclarations().filter(i => i.getModuleSpecifierValue().includes('mock'));
        if (mockImports.length > 0) {
           markdown += `  * Uses Mock Data source: \`${mockImports.map(m => m.getModuleSpecifierValue()).join(', ')}\` (fallback/development)\n`;
        } else {
           markdown += `  * Relies purely on remote API (No offline cache found in service).\n`;
        }
     }
  }
  
  markdown += `---\n\n`;
}

// output to artifacts dir
const artifactDir = '/Users/test/.gemini/antigravity-ide/brain/68e038b4-53ec-448a-9e50-089c83cbaafe';
if (!fs.existsSync(artifactDir)){
    fs.mkdirSync(artifactDir, { recursive: true });
}
const outPath = path.join(artifactDir, 'API_VARIABLES_DOCUMENTATION.md');
fs.writeFileSync(outPath, markdown);
console.log(`Documentation generated at ${outPath}`);

// Also update the user's downloaded version if it exists
const userPath = '/Users/test/Downloads/API_VARIABLES_DOCUMENTATION_GENERATED.md';
fs.writeFileSync(userPath, markdown);

