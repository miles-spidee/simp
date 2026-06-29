const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const API_DIR = path.join(ROOT_DIR, 'src', 'api');
const SERVICE_DIR = path.join(ROOT_DIR, 'src', 'services');
const TYPES_DIR = path.join(ROOT_DIR, 'src', 'types');
const APP_DIR = path.join(ROOT_DIR, 'app');
const OUTPUT_FILE = path.join(ROOT_DIR, 'SIMP_API_VARIABLES_DOCUMENTATION.md');
const IGNORED_DIRS = new Set(['node_modules', '.next', 'graphify-out', '.git']);

function walk(dir, matcher = () => true, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) {
        continue;
      }
      walk(fullPath, matcher, files);
    } else if (matcher(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function toPosix(filePath) {
  return filePath.replace(/\\/g, '/');
}

function relative(filePath) {
  return toPosix(path.relative(ROOT_DIR, filePath));
}

function normalizeName(value) {
  const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned.endsWith('s') && cleaned.length > 4 ? cleaned.slice(0, -1) : cleaned;
}

function titleCase(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function extractMockImports(content) {
  const matches = [...content.matchAll(/from\s+['"]([^'"]*mock[^'"]*)['"]/g)];
  return [...new Set(matches.map((match) => match[1]))];
}

function extractLocalStorageKeys(content) {
  const matches = [...content.matchAll(/localStorage\.(?:getItem|setItem|removeItem)\(\s*['"`]([^'"`]+)['"`]/g)];
  return [...new Set(matches.map((match) => match[1]))];
}

function extractApiCalls(content) {
  const calls = [];
  const regex = /apiClient\.(get|post|put|patch|delete)\s*(?:<([\s\S]*?)>)?\s*\(\s*([\s\S]*?)\)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const genericType = match[2] ? match[2].replace(/\s+/g, ' ').trim() : 'Unknown';
    const callBody = match[3];
    const lines = callBody.split('\n').map((line) => line.trim()).filter(Boolean);
    const endpointLine = lines[0] || '';
    const endpoint = endpointLine.replace(/,$/, '');
    const payload = method === 'GET' || method === 'DELETE'
      ? 'None'
      : (lines[1] ? lines[1].replace(/,$/, '') : 'None');

    calls.push({ method, endpoint, payload, responseType: genericType });
  }

  return calls;
}

function extractFunctionNames(content) {
  const matches = [...content.matchAll(/^\s*([A-Za-z0-9_]+)\s*:\s*async\s*\(/gm)];
  return matches.map((match) => match[1]);
}

function extractImportedFeatureFiles(content, group) {
  const regex = new RegExp(`from\\s+['"][^'"]*\\/${group}\\/([^'"\\n]+)['"]`, 'g');
  const matches = [...content.matchAll(regex)];
  return [...new Set(matches.map((match) => match[1]))];
}

function stripComments(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

function findMatchingTypeFiles(moduleName, typeFiles) {
  const normalizedModule = normalizeName(moduleName);
  return typeFiles.filter((filePath) => {
    const baseName = path.basename(filePath).replace(/\.types\.ts$/, '');
    const normalizedBase = normalizeName(baseName);
    return normalizedBase === normalizedModule;
  });
}

function describeFieldUse(fieldName, fieldType) {
  const lowerName = fieldName.toLowerCase();
  const readableName = fieldName.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();

  if (lowerName === 'id') return 'Unique identifier for this record.';
  if (lowerName.endsWith('id')) return `References the related ${readableName.slice(0, -3).trim()} record.`;
  if (lowerName.includes('name')) return `Stores the display name for ${readableName.replace(' name', '') || 'this item'}.`;
  if (lowerName.includes('email')) return 'Stores the email address used for communication or identification.';
  if (lowerName.includes('phone')) return 'Stores the contact phone number.';
  if (lowerName.includes('status')) return 'Tracks the current lifecycle or processing state.';
  if (lowerName.includes('role')) return 'Defines the assigned role or role label for access control.';
  if (lowerName.includes('permission')) return 'Defines access rights available to the user or role.';
  if (lowerName.includes('module')) return 'Maps the item to a product module or feature area.';
  if (lowerName.includes('route') || lowerName.includes('path')) return 'Defines the navigation target or URL path.';
  if (lowerName.includes('subject')) return 'Stores the subject line shown to the recipient.';
  if (lowerName.includes('body') || lowerName.includes('content') || lowerName.includes('message')) return 'Stores the main content rendered or sent to the user.';
  if (lowerName.includes('variable')) return 'Lists dynamic placeholders or values injected at runtime.';
  if (lowerName.includes('version')) return 'Tracks the revision number for change management.';
  if (lowerName.includes('count') || lowerName.startsWith('total')) return 'Stores an aggregated numeric total used in stats or summaries.';
  if (lowerName.includes('percent') || lowerName.includes('rate')) return 'Stores a calculated percentage or rate metric.';
  if (lowerName.includes('date') || lowerName.endsWith('at') || lowerName.includes('time') || lowerName.includes('timestamp')) return 'Stores the relevant date/time for sorting, auditing, or display.';
  if (lowerName.includes('active') || lowerName.startsWith('is') || lowerName.startsWith('has')) return 'Boolean flag used to control state, visibility, or validation.';
  if (lowerName.includes('html')) return 'Stores rendered HTML content from the backend or editor.';
  if (fieldType.includes('[]')) return `Collection of ${readableName} values used to render lists or related records.`;

  return `Used to store ${readableName} for this module.`;
}

function extractTypeDetails(content) {
  const cleanContent = stripComments(content);
  const interfaces = [...cleanContent.matchAll(/export\s+interface\s+(\w+)\s*\{([\s\S]*?)\}/g)].map((match) => {
    const fields = match[2]
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('}'))
      .map((line) => line.replace(/;$/, ''))
      .map((line) => {
        const fieldMatch = line.match(/^(['"`]?[A-Za-z0-9_]+['"`]?)\??:\s*(.+)$/);
        if (!fieldMatch) return null;
        return {
          name: fieldMatch[1].replace(/['"`]/g, ''),
          type: fieldMatch[2].trim(),
        };
      })
      .filter(Boolean);

    return {
      kind: 'interface',
      name: match[1],
      fields,
    };
  });

  const aliases = [...cleanContent.matchAll(/export\s+type\s+(\w+)\s*=\s*([^;]+);/g)].map((match) => ({
    kind: 'type',
    name: match[1],
    definition: match[2].trim(),
  }));

  return { interfaces, aliases };
}

function routeFromPage(filePath) {
  const rel = relative(filePath).replace(/^app\//, '').replace(/\/page\.tsx$/, '');
  return `/${rel === '' ? '' : rel}`.replace(/\/+/g, '/');
}

function collectPageInfo(pageFiles) {
  return pageFiles.map((filePath) => {
    const content = read(filePath);
    const route = routeFromPage(filePath);
    const routeKey = normalizeName(route.split('/').filter(Boolean).pop() || 'root');

    return {
      filePath,
      route,
      routeKey,
      serviceRefs: extractImportedFeatureFiles(content, 'services').map((name) => name.replace(/\.service$/, '')),
      apiRefs: extractImportedFeatureFiles(content, 'api').map((name) => name.replace(/\.api$/, '')),
      mockImports: extractMockImports(content),
    };
  });
}

function collectCodebaseMockUsage() {
  const codeFiles = walk(ROOT_DIR, (filePath) => /\.(ts|tsx|js|jsx)$/.test(filePath));
  return codeFiles
    .map((filePath) => {
      const content = read(filePath);
      const mockImports = extractMockImports(content);
      return mockImports.length > 0
        ? { filePath, mockImports }
        : null;
    })
    .filter(Boolean);
}

function buildModuleDocs() {
  const apiFiles = walk(API_DIR, (filePath) => filePath.endsWith('.api.ts')).sort();
  const serviceFiles = walk(SERVICE_DIR, (filePath) => filePath.endsWith('.service.ts')).sort();
  const typeFiles = walk(TYPES_DIR, (filePath) => filePath.endsWith('.types.ts')).sort();
  const pageFiles = walk(APP_DIR, (filePath) => filePath.endsWith('page.tsx')).sort();
  const pageInfo = collectPageInfo(pageFiles);
  const mockUsage = collectCodebaseMockUsage();

  const modules = [];

  for (const apiFile of apiFiles) {
    const moduleName = path.basename(apiFile, '.api.ts');
    const normalizedModule = normalizeName(moduleName);
    const apiContent = read(apiFile);
    const matchingService = serviceFiles.find((serviceFile) => path.basename(serviceFile, '.service.ts') === moduleName);
    const serviceContent = matchingService ? read(matchingService) : '';
    const matchingTypeFiles = findMatchingTypeFiles(moduleName, typeFiles);
    const typeDetails = matchingTypeFiles.map((typeFile) => ({
      path: relative(typeFile),
      ...extractTypeDetails(read(typeFile)),
    }));

    const routes = pageInfo.filter((page) => {
      if (page.serviceRefs.includes(moduleName) || page.apiRefs.includes(moduleName)) {
        return true;
      }

      return (
        page.routeKey === normalizedModule ||
        page.routeKey.includes(normalizedModule) ||
        normalizedModule.includes(page.routeKey)
      );
    });

    const mockFiles = mockUsage.filter((item) => {
      const relPath = relative(item.filePath);
      return relPath.includes(`/api/${moduleName}.api.ts`) ||
        relPath.includes(`/services/${moduleName}.service.ts`) ||
        routes.some((route) => route.filePath === item.filePath);
    });

    modules.push({
      name: moduleName,
      title: titleCase(moduleName),
      apiPath: relative(apiFile),
      servicePath: matchingService ? relative(matchingService) : 'Not found',
      apiFunctions: extractFunctionNames(apiContent),
      endpoints: extractApiCalls(apiContent),
      apiMockImports: extractMockImports(apiContent),
      serviceMockImports: extractMockImports(serviceContent),
      serviceStorageKeys: extractLocalStorageKeys(serviceContent),
      typeDetails,
      routes,
      mockFiles,
    });
  }

  return {
    modules,
    pageCount: pageFiles.length,
    apiCount: apiFiles.length,
    serviceCount: serviceFiles.length,
    mockUsage,
  };
}

function hasBackendCancelBlocker() {
  const apiClientPath = path.join(API_DIR, 'api.client.ts');
  return read(apiClientPath).includes('Backend connection disabled');
}

function hasHardcodedAuthBlocker() {
  const authApiPath = path.join(API_DIR, 'auth.api.ts');
  const authContent = read(authApiPath);
  return authContent.includes('mock-token-') || authContent.includes('const devUsers');
}

function buildMarkdown() {
  const { modules, pageCount, apiCount, serviceCount, mockUsage } = buildModuleDocs();
  const pagesWithDirectMocks = mockUsage.filter((item) => relative(item.filePath).startsWith('app/')).length;
  const servicesWithMocks = mockUsage.filter((item) => relative(item.filePath).startsWith('src/services/')).length;
  const apisWithMocks = mockUsage.filter((item) => relative(item.filePath).startsWith('src/api/')).length;

  let markdown = '# SIMP Frontend Backend Integration Audit\n\n';
  markdown += `Generated from source on ${new Date().toISOString()}.\n\n`;
  markdown += '## Executive Summary\n';
  markdown += `- Routes scanned: ${pageCount}\n`;
  markdown += `- API modules scanned: ${apiCount}\n`;
  markdown += `- Service modules scanned: ${serviceCount}\n`;
  markdown += `- Files still importing mock data: ${mockUsage.length}\n`;
  markdown += `- Page files with direct mock imports: ${pagesWithDirectMocks}\n`;
  markdown += `- Service files with mock fallbacks: ${servicesWithMocks}\n`;
  markdown += `- API files returning mock data: ${apisWithMocks}\n\n`;

  markdown += '## Production Blockers\n';
  markdown += `- Shared API client force-cancels requests: ${hasBackendCancelBlocker() ? 'Yes' : 'No'}\n`;
  markdown += `- Authentication API contains hardcoded dev credentials/tokens: ${hasHardcodedAuthBlocker() ? 'Yes' : 'No'}\n`;
  markdown += `- Mock imports remain in codebase: ${mockUsage.length > 0 ? 'Yes' : 'No'}\n\n`;

  markdown += '## Global Mock Usage\n';
  if (mockUsage.length === 0) {
    markdown += '- No mock imports detected.\n\n';
  } else {
    for (const item of mockUsage) {
      markdown += `- \`${relative(item.filePath)}\`: ${item.mockImports.join(', ')}\n`;
    }
    markdown += '\n';
  }

  markdown += '## Table of Contents\n';
  modules.forEach((module, index) => {
    markdown += `${index + 1}. [${module.title} Module](#${module.name.toLowerCase()}-module)\n`;
  });
  markdown += '\n---\n\n';

  for (const module of modules) {
    markdown += `## ${module.title} Module\n\n`;
    markdown += `- API file: \`${module.apiPath}\`\n`;
    markdown += `- Service file: \`${module.servicePath}\`\n`;
    markdown += `- Type files: ${module.typeDetails.length > 0 ? module.typeDetails.map((item) => `\`${item.path}\``).join(', ') : 'None matched automatically'}\n`;
    markdown += `- API functions: ${module.apiFunctions.length > 0 ? module.apiFunctions.map((name) => `\`${name}\``).join(', ') : 'None detected'}\n`;
    markdown += `- Service localStorage keys: ${module.serviceStorageKeys.length > 0 ? module.serviceStorageKeys.map((key) => `\`${key}\``).join(', ') : 'None'}\n`;

    markdown += '- Routes:\n';
    if (module.routes.length === 0) {
      markdown += '  - None mapped automatically\n';
    } else {
      for (const route of module.routes) {
        markdown += `  - \`${route.route}\` (${relative(route.filePath)})\n`;
      }
    }

    markdown += '- Mock dependencies:\n';
    const mockDependencyLines = [
      ...module.apiMockImports.map((item) => `API uses ${item}`),
      ...module.serviceMockImports.map((item) => `Service uses ${item}`),
      ...module.routes.flatMap((route) => route.mockImports.map((item) => `Route ${route.route} uses ${item}`)),
    ];

    if (mockDependencyLines.length === 0) {
      markdown += '  - None detected in API/service/routes\n';
    } else {
      for (const line of [...new Set(mockDependencyLines)]) {
        markdown += `  - ${line}\n`;
      }
    }

    markdown += '\n### Endpoints\n\n';
    if (module.endpoints.length === 0) {
      markdown += '*No apiClient endpoints extracted.*\n\n';
    } else {
      for (const endpoint of module.endpoints) {
        markdown += `#### ${endpoint.method} ${endpoint.endpoint}\n`;
        markdown += `- Response type: \`${endpoint.responseType}\`\n`;
        markdown += `- Payload: \`${endpoint.payload}\`\n\n`;
      }
    }

    markdown += '### Variables And Their Use\n\n';
    if (module.typeDetails.length === 0) {
      markdown += '*No matching type files detected for this module.*\n\n';
    } else {
      for (const typeFile of module.typeDetails) {
        markdown += `#### Types From \`${typeFile.path}\`\n\n`;

        if (typeFile.aliases.length > 0) {
          markdown += '- Type aliases:\n';
          for (const alias of typeFile.aliases) {
            markdown += `  - \`${alias.name}\`: \`${alias.definition}\`\n`;
          }
        }

        if (typeFile.interfaces.length === 0) {
          markdown += '\n*No interfaces detected in this type file.*\n\n';
          continue;
        }

        markdown += '\n';
        for (const typeInterface of typeFile.interfaces) {
          markdown += `#### Interface \`${typeInterface.name}\`\n\n`;

          if (typeInterface.fields.length === 0) {
            markdown += '*No fields detected.*\n\n';
            continue;
          }

          for (const field of typeInterface.fields) {
            markdown += `- \`${field.name}\` (\`${field.type}\`): ${describeFieldUse(field.name, field.type)}\n`;
          }
          markdown += '\n';
        }
      }
    }

    markdown += '---\n\n';
  }

  return markdown;
}

const markdown = buildMarkdown();
fs.writeFileSync(OUTPUT_FILE, markdown);
console.log(`Generated documentation to ${OUTPUT_FILE}`);
