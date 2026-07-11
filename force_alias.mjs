import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') && !file.endsWith('index.ts') && !file.endsWith('.spec.ts')) { 
      results.push(file);
    }
  });
  return results;
}

// 2. Rewrite ALL imports in src/**/*.ts to use absolute folder imports
const allTsFiles = [];
function walkAll(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      walkAll(file);
    } else if (file.endsWith('.ts') && !file.endsWith('index.ts')) { 
      allTsFiles.push(file);
    }
  });
}
walkAll(srcDir);

allTsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace internal relative imports with alias imports
  content = content.replace(/(from|import)\s+['"]([\.\/]+[^'"]+)['"]/g, (match, p1, p2) => {
    const absoluteTarget = path.resolve(path.dirname(file), p2);
    const relativeToSrc = path.relative(srcDir, absoluteTarget).replace(/\\/g, '/');
    
    if (relativeToSrc.startsWith('modules/')) {
      const moduleName = relativeToSrc.split('/')[1];
      return `${p1} '@modules/${moduleName}'`;
    } else if (relativeToSrc.startsWith('common/')) {
      return `${p1} '@common'`;
    } else if (relativeToSrc.startsWith('infrastructure/')) {
      return `${p1} '@infrastructure'`;
    }
    return match;
  });

  // Remove .js or /index.js or /index from alias imports to strictly point to the folder
  content = content.replace(/(from|import)\s+['"](@modules\/[^/]+|@common|@infrastructure)(?:\/[^'"]+)?['"]/g, "$1 '$2'");

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

// 1. Generate comprehensive index.ts for every module, common, and infra
const targetDirs = [
  ...fs.readdirSync(path.join(srcDir, 'modules')).map(d => path.join(srcDir, 'modules', d)),
  path.join(srcDir, 'common'),
  path.join(srcDir, 'infrastructure')
];

targetDirs.forEach(dir => {
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    const files = walk(dir);
    let exportsStr = '';
    files.forEach(f => {
      let relPath = path.relative(dir, f).replace(/\\/g, '/');
      relPath = relPath.replace(/\.ts$/, '.js');
      if (!relPath.startsWith('.')) relPath = './' + relPath;
      exportsStr += `export * from '${relPath}';\n`;
    });
    fs.writeFileSync(path.join(dir, 'index.ts'), exportsStr, 'utf8');
  }
});

console.log('Forceful refactoring to @ aliases done safely.');
