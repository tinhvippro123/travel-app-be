const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allTsFiles = getAllFiles(srcDir);

allTsFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // We want to replace import { ... } from '../../something/entities/some.entity.js'
  // to import { ... } from '@modules/something/entities/index.js'
  
  // And also import { ... } from '../entities/some.entity.js' 
  // to import { ... } from '@modules/current_module/entities/index.js'

  // Let's just do a regex replace for any import starting with '.' or '..' that points to a module subfolder
  // Actually, since we want to enforce @modules across the board:

  const importRegex = /import\s+({[^}]+}|\w+)\s+from\s+['"](\.+[^'"]+)['"]/g;
  
  content = content.replace(importRegex, (match, imports, relPath) => {
    // Determine the absolute path of the imported file/folder
    const absoluteImportPath = path.resolve(path.dirname(filePath), relPath);
    
    // Check if it's inside src/modules
    const modulesPath = path.join(srcDir, 'modules');
    if (absoluteImportPath.startsWith(modulesPath)) {
      // It's a module import
      // Find which module and which folder (dto, entities, services, etc)
      const relativeToModules = path.relative(modulesPath, absoluteImportPath);
      // relativeToModules might be "user\entities\user.entity.js" or "user\entities"
      
      const parts = relativeToModules.split(path.sep);
      if (parts.length >= 2) {
        const moduleName = parts[0];
        const folderName = parts[1]; // entities, dto, etc
        
        // We want to map this to @modules/moduleName/folderName/index.js
        const aliasPath = @modules///index.js;
        changed = true;
        return \import \ from '\'\;
      }
    }
    
    // If it's a common or infrastructure import, we could also convert it, but let's stick to @modules for now
    return match;
  });

  if (changed) {
    // Combine duplicate imports from the same path
    // e.g. import { User } from '@modules/user/entities/index.js'
    //      import { Role } from '@modules/user/entities/index.js'
    
    const importMap = new Map();
    const cleanLines = [];
    const importLineRegex = /^import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"];?$/;
    
    const lines = content.split('\n');
    lines.forEach(line => {
      const match = line.match(importLineRegex);
      if (match) {
        const namedImports = match[1].split(',').map(s => s.trim()).filter(s => s);
        const source = match[2];
        if (!importMap.has(source)) {
          importMap.set(source, new Set());
        }
        namedImports.forEach(imp => importMap.get(source).add(imp));
      } else {
        cleanLines.push(line);
      }
    });

    let newImports = '';
    importMap.forEach((importsSet, source) => {
      newImports += \import { \ } from '\';\n\;
    });
    
    // Naively prepend new imports (this is a bit messy because it might place them after other imports, 
    // but eslint --fix will sort them out later if configured, or it's just fine)
    // Actually, it's better to just replace the old imports with nothing and put new at the top
    
    const finalContent = newImports + cleanLines.join('\n');
    fs.writeFileSync(filePath, finalContent, 'utf-8');
    console.log(\Refactored \\);
  }
});
