import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modulesDir = path.resolve(__dirname, 'src/modules');

const modules = fs.readdirSync(modulesDir).filter(f => fs.statSync(path.join(modulesDir, f)).isDirectory());

modules.forEach(mod => {
  const modPath = path.join(modulesDir, mod);
  
  // Find all .ts files in the module that might import things
  function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.resolve(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) { 
        results = results.concat(walk(file));
      } else if (file.endsWith('.ts') && !file.endsWith('index.ts')) { 
        results.push(file);
      }
    });
    return results;
  }
  
  const files = walk(modPath);
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Replace: import { ... } from './controllers/xyz.controller.js' 
    // with: import { ... } from '@modules/MOD/controllers'
    // It works for ../ as well if we are inside a subfolder, but let's be careful.
    
    // We just want to replace any internal relative import to controllers/services/repositories with the alias.
    content = content.replace(/(from|import)\s+['"]([\.\/]+)(controllers|services|repositories)(?:\/[^'"]+)?['"]/g, (match, p1, p2, p3) => {
      return `${p1} '@modules/${mod}/${p3}'`;
    });

    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
    }
  });
});

console.log('Internal imports rewritten to use @ alias.');
