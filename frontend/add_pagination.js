const { Project, SyntaxKind } = require('ts-morph');
const path = require('path');
const fs = require('fs');

const project = new Project({
  tsConfigFilePath: path.join(__dirname, 'tsconfig.json'),
});

const files = project.getSourceFiles(['app/feature/**/*.tsx', 'components/feature/**/*.tsx']);

let updatedCount = 0;

for (const file of files) {
  const filePath = file.getFilePath();
  // We only care about files with tables
  const text = file.getFullText();
  if (!text.includes('</tbody>') || !text.includes('.map(')) continue;
  if (text.includes('<Pagination') || text.includes('PaginationProps')) continue; // Already has pagination

  console.log('Processing:', filePath);

  // Add import if needed
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
      if (named.includes('useState')) {
        hasUseState = true;
      }
    }
    if (!hasUseState && reactImports[0].getNamedImports().length > 0) {
      reactImports[0].addNamedImport('useState');
      hasUseState = true;
    }
  }

  // Find the primary function component
  let component = file.getFunctions().find(f => f.hasExportKeyword() && f.isDefaultExport());
  if (!component) {
    const defaultExport = file.getExportAssignment(a => !a.isExportEquals());
    if (defaultExport) {
        const expr = defaultExport.getExpression();
        if (expr.getKind() === SyntaxKind.Identifier) {
            component = file.getFunction(expr.getText()) || file.getVariableDeclaration(expr.getText())?.getInitializerIfKind(SyntaxKind.ArrowFunction);
        }
    }
  }
  if (!component) {
      component = file.getFunctions().find(f => f.hasExportKeyword());
  }

  if (component && component.getBody) {
    const body = component.getBody();
    if (body) {
        // Find .map calls inside JSX that return <tr>
        const jsxExprs = file.getDescendantsOfKind(SyntaxKind.JsxExpression);
        let replaced = false;

        for (const expr of jsxExprs) {
            const callExpr = expr.getExpressionIfKind(SyntaxKind.CallExpression);
            if (!callExpr) continue;

            const propAccess = callExpr.getExpressionIfKind(SyntaxKind.PropertyAccessExpression);
            if (!propAccess || propAccess.getName() !== 'map') continue;

            const arrayExpr = propAccess.getExpression();
            const arrayText = arrayExpr.getText();
            
            // Check if it's returning a <tr> (either implicit or explicit)
            const mapArgs = callExpr.getArguments();
            if (mapArgs.length === 0) continue;
            const arrowFunc = mapArgs[0];
            let isTr = false;
            
            if (arrowFunc.getKind() === SyntaxKind.ArrowFunction) {
                const funcBody = arrowFunc.getBody();
                if (funcBody.getKind() === SyntaxKind.JsxElement || funcBody.getKind() === SyntaxKind.JsxSelfClosedElement || funcBody.getKind() === SyntaxKind.ParenthesizedExpression) {
                    const text = funcBody.getText();
                    if (text.includes('<tr') || text.includes('<TableRow')) {
                        isTr = true;
                    }
                } else if (funcBody.getKind() === SyntaxKind.Block) {
                    const text = funcBody.getText();
                    if (text.includes('<tr') || text.includes('<TableRow')) {
                        isTr = true;
                    }
                }
            }

            if (isTr) {
                // Modify the array expression to slice it
                const newArrayText = `${arrayText}.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)`;
                arrayExpr.replaceWithText(newArrayText);
                
                // Find where to insert Pagination
                // We go up to the table or its wrapper
                let current = expr;
                while (current && current.getKind() !== SyntaxKind.JsxElement) {
                    current = current.getParent();
                }
                
                // Keep going up until we find the div that wraps the table
                let tableElement = current;
                while (tableElement && tableElement.getParent() && tableElement.getParent().getKind() === SyntaxKind.JsxElement) {
                    const tagName = tableElement.compilerNode.openingElement ? tableElement.compilerNode.openingElement.tagName.text : '';
                    if (tagName === 'table') break;
                    tableElement = tableElement.getParent();
                }
                
                // Let's just find </table> and insert after its wrapper div
                replaced = true;
                break;
            }
        }

        if (replaced) {
            // Add state
            body.insertStatements(0, `
  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
`);

            // Find </table> and insert Pagination
            // Easiest is string replacement for the insertion since TS Morph JSX manipulation is tricky
            file.saveSync();
            let fileContent = fs.readFileSync(filePath, 'utf-8');
            const arrayTextMatch = fileContent.match(/([a-zA-Z0-9_\.]+(?:\(.*?\))?)\.slice\(\(currentPage - 1\)/);
            if (arrayTextMatch) {
                const arrayName = arrayTextMatch[1];
                const paginationJsx = `
        <Pagination 
          currentPage={currentPage} 
          totalPages={Math.ceil((${arrayName}?.length || 0) / itemsPerPage)} 
          onPageChange={setCurrentPage} 
        />`;
                
                // Find </table></div> or similar
                // We'll replace </table>\n          </div> with </table>\n          </div>\n          {paginationJsx}
                fileContent = fileContent.replace(/(<\/table>\s*<\/div>)/, `$1${paginationJsx}`);
                fs.writeFileSync(filePath, fileContent);
            }
            console.log('Successfully added to', filePath);
            updatedCount++;
        }
    }
  }
}
console.log('Total files updated:', updatedCount);
