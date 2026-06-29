const { Project, SyntaxKind } = require('ts-morph');
const path = require('path');
const fs = require('fs');

const project = new Project({
  tsConfigFilePath: path.join(__dirname, 'tsconfig.json'),
});

const targetFiles = {
    'app/feature/organization/page.tsx': 'filteredOrganizations',
    'app/feature/insights/page.tsx': 'filteredRisks',
    'app/feature/employee/page.tsx': 'filteredEmployees',
    'app/feature/modules/page.tsx': 'filteredModules',
    'app/feature/my-tasks/page.tsx': 'combinedTasks',
    'app/feature/task/page.tsx': 'tasks',
    'app/feature/task-management/page.tsx': 'taskSubs',
    'app/feature/referrals/page.tsx': 'referrals',
    'app/feature/roles/page.tsx': 'roles',
    'app/feature/kpi/page.tsx': 'kpis',
    'app/feature/lms/page.tsx': 'courses',
    'app/feature/attendance/page.tsx': 'schedules',
    'app/feature/analytics/page.tsx': 'combined'
};

let updatedCount = 0;

for (const [relPath, arrayName] of Object.entries(targetFiles)) {
    const fullPath = path.join(__dirname, relPath);
    if (!fs.existsSync(fullPath)) continue;

    const file = project.getSourceFile(fullPath) || project.addSourceFileAtPath(fullPath);
    const text = file.getFullText();
    
    if (text.includes('<Pagination') || text.includes('PaginationProps')) {
        console.log(`Skipping ${relPath} (already has pagination)`);
        continue;
    }

    console.log('Processing:', relPath);

    // Add Pagination import
    if (!file.getImportDeclaration(decl => decl.getModuleSpecifierValue() === '@/components/common/Pagination')) {
        file.addImportDeclaration({
            namedImports: ['Pagination'],
            moduleSpecifier: '@/components/common/Pagination'
        });
    }

    // Ensure useState is imported
    let hasUseState = false;
    const reactImports = file.getImportDeclarations().filter(decl => decl.getModuleSpecifierValue() === 'react');
    if (reactImports.length > 0) {
        for (const imp of reactImports) {
            const named = imp.getNamedImports().map(n => n.getName());
            if (named.includes('useState')) hasUseState = true;
        }
        if (!hasUseState && reactImports[0].getNamedImports().length > 0) {
            reactImports[0].addNamedImport('useState');
            hasUseState = true;
        }
    } else {
        file.addImportDeclaration({
            namedImports: ['useState'],
            moduleSpecifier: 'react'
        });
    }

    // Find the main component
    let component = file.getFunctions().find(f => f.hasExportKeyword() && f.isDefaultExport());
    if (!component) {
        component = file.getFunctions().find(f => f.hasExportKeyword());
    }

    if (component && component.getBody) {
        const body = component.getBody();
        if (body) {
            const jsxExprs = file.getDescendantsOfKind(SyntaxKind.JsxExpression);
            let replaced = false;

            for (const expr of jsxExprs) {
                const callExpr = expr.getExpressionIfKind(SyntaxKind.CallExpression);
                if (!callExpr) continue;

                const propAccess = callExpr.getExpressionIfKind(SyntaxKind.PropertyAccessExpression);
                if (!propAccess || propAccess.getName() !== 'map') continue;

                const arrayExpr = propAccess.getExpression();
                if (arrayExpr.getText() !== arrayName) continue;

                // Found the map! Replace the array
                const newArrayText = `${arrayName}.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)`;
                arrayExpr.replaceWithText(newArrayText);
                
                // Find parent container to insert <Pagination />
                // Usually the parent of JsxExpression is a JsxElement (e.g., <tbody> or <div className="grid">)
                let parentJsx = expr.getParentIfKind(SyntaxKind.JsxElement);
                if (!parentJsx) continue;

                // Let's just do a string replacement for the insertion to avoid AST parent node issues
                // We'll save the file and then do string manipulation
                replaced = true;
                break;
            }

            if (replaced) {
                body.insertStatements(0, `
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
`);
                file.saveSync();
                
                // Now insert the Pagination component via string replacement to avoid JSX fragment errors
                let content = fs.readFileSync(fullPath, 'utf-8');
                
                // We will look for the closing tag of the parent container of the mapped array
                // But honestly, the safest way is just appending it before the final closing </div> of the main return block.
                // Or looking for the end of the </tbody> or grid div.
                
                const paginationJsx = `\n          {${arrayName}?.length > itemsPerPage && (\n            <div className="mt-4">\n              <Pagination currentPage={currentPage} totalPages={Math.ceil((${arrayName}?.length || 0) / itemsPerPage)} onPageChange={setCurrentPage} />\n            </div>\n          )}\n`;
                
                // Let's find `</tbody>` first, or if not, `</div>` before the final `);`
                if (content.includes('</tbody>')) {
                    // Replace the FIRST </tbody> after the slice with </tbody> + pagination
                    // Actually, just replacing the last </tbody> in the file might work if there's only one main table.
                    const lastTbodyIdx = content.lastIndexOf('</tbody>');
                    if (lastTbodyIdx !== -1) {
                        content = content.slice(0, lastTbodyIdx + 8) + paginationJsx + content.slice(lastTbodyIdx + 8);
                    }
                } else {
                    // If it's a grid/cards, find the closing `</div>` of the main container.
                    // A simple heuristic: insert it right before the final `</div>\n    </div>\n  );`
                    // Let's just look for `  );\n}` and put it before the closing tags.
                    const retIdx = content.lastIndexOf('  );\n}');
                    if (retIdx !== -1) {
                        // find the </div> right before it
                        const divIdx = content.lastIndexOf('</div>', retIdx);
                        if (divIdx !== -1) {
                            content = content.slice(0, divIdx + 6) + paginationJsx + content.slice(divIdx + 6);
                        }
                    }
                }
                
                fs.writeFileSync(fullPath, content);
                console.log('Successfully updated', relPath);
                updatedCount++;
            }
        }
    }
}
console.log('Total files updated:', updatedCount);
