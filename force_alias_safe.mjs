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
    } else if (file.endsWith('.ts') && !file.endsWith('.spec.ts')) { 
      results.push(file);
    }
  });
  return results;
}

const allTsFiles = walk(srcDir);

allTsFiles.forEach(file => {
  if (file.endsWith('index.ts')) return; // Skip index files

  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace internal relative imports with alias imports safely
  content = content.replace(/(from|import)\s+['"](\.[^'"]+)['"]/g, (match, p1, p2) => {
    const absoluteTarget = path.resolve(path.dirname(file), p2);
    const relativeToSrc = path.relative(srcDir, absoluteTarget).replace(/\\/g, '/');
    
    if (relativeToSrc.startsWith('modules/')) {
      const moduleName = relativeToSrc.split('/')[1];
      return `${p1} '@modules/${moduleName}'`;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('Safe aggressive alias replacement done.');
