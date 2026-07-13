import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, 'src');

// Function to generate index.ts for a given directory
function generateIndexForDir(dirPath) {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) return;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.ts') && f !== 'index.ts' && !f.endsWith('.spec.ts'));
  if (files.length > 0) {
    let subIndexContent = '';
    files.forEach(file => {
      const basename = file.replace('.ts', '.js');
      subIndexContent += `export * from './${basename}';\n`;
    });
    fs.writeFileSync(path.join(dirPath, 'index.ts'), subIndexContent, 'utf8');
  }
}

// 1. Generate index.ts for all subfolders in common and infrastructure
['common', 'infrastructure'].forEach(base => {
  const baseDir = path.join(srcDir, base);
  if (fs.existsSync(baseDir)) {
    const subDirs = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());
    subDirs.forEach(subDir => generateIndexForDir(path.join(baseDir, subDir)));
  }
});

// 2. Rewrite imports everywhere to remove the trailing filename.js
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts')) { 
      results.push(file);
    }
  });
  return results;
}

const allTsFiles = walk(srcDir);

allTsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace @alias/folder/file.js with @alias/folder
  // Example: @common/entities/base.entity.js -> @common/entities
  // Example: @modules/user/dto/create-user.dto.js -> @modules/user/dto
  
  content = content.replace(/(from|import)\s+['"](@[a-zA-Z0-9_-]+)(?:\/[a-zA-Z0-9_-]+)+(\/[a-zA-Z0-9_.-]+\.js)['"]/g, (match, p1, p2, p3) => {
    // We want to remove p3 (the trailing file part)
    // Wait, regex might match the whole path. Let's do a simpler regex:
    // Match any @alias/... string ending with .js
    return match; // We won't use this regex
  });
  
  // Let's use a simpler, more robust replacement
  content = content.replace(/(from|import)\s+['"](@[a-zA-Z0-9_\-\/]+)\/[a-zA-Z0-9_\-\.]+\.js['"]/g, "$1 '$2'");

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('Extensions removed and barrel files updated.');
