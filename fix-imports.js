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

walkSync('src', function (filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace @modules/NAME/SUBFOLDER/index.js with @modules/NAME/index.js
  content = content.replace(/@modules\/([a-zA-Z0-9_-]+)\/(entities|dto|interfaces|guards)\/index\.js/g, '@modules/$1/index.js');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${filePath}`);
  }
});
