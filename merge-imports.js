import fs from 'fs';
import path from 'path';

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    var filePath = path.join(currentDirPath, name);
    var stat = fs.statSync(filePath);
    if (stat.isFile() && filePath.endsWith('.ts')) {
      callback(filePath);
    } else if (stat.isDirectory() && name !== 'node_modules' && name !== 'dist') {
      walkSync(filePath, callback);
    }
  });
}

walkSync('src', function(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?/g;
  const importsBySource = {};
  
  let match;
  while ((match = importRegex.exec(original)) !== null) {
    const symbols = match[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
    const source = match[2];
    
    if (!importsBySource[source]) {
      importsBySource[source] = { symbols: new Set(), blocks: [] };
    }
    symbols.forEach(s => importsBySource[source].symbols.add(s));
    importsBySource[source].blocks.push(match[0]);
  }
  
  for (const source in importsBySource) {
    const data = importsBySource[source];
    if (data.blocks.length > 1) {
      data.blocks.forEach(block => {
        content = content.replace(block + '\r\n', '');
        content = content.replace(block + '\n', '');
        content = content.replace(block, '');
      });
      
      const mergedSymbols = Array.from(data.symbols).join(', ');
      const newImport = `import { ${mergedSymbols} } from '${source}';\n`;
      content = newImport + content;
    }
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Merged imports in ${filePath}`);
  }
});
