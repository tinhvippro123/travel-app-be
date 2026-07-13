import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modulesDir = path.resolve(__dirname, 'src/modules');

const modules = fs.readdirSync(modulesDir).filter(f => fs.statSync(path.join(modulesDir, f)).isDirectory());

const INTERNAL_DIRS = ['controllers', 'services', 'repositories'];

modules.forEach(mod => {
  const modPath = path.join(modulesDir, mod);

  INTERNAL_DIRS.forEach(subDir => {
    const subDirPath = path.join(modPath, subDir);
    if (fs.existsSync(subDirPath) && fs.statSync(subDirPath).isDirectory()) {
      const files = fs.readdirSync(subDirPath).filter(f => f.endsWith('.ts') && f !== 'index.ts');
      if (files.length > 0) {
        let subIndexContent = '';
        files.forEach(file => {
          const basename = file.replace('.ts', '.js');
          subIndexContent += `export * from './${basename}';\n`;
        });
        fs.writeFileSync(path.join(subDirPath, 'index.ts'), subIndexContent, 'utf8');
      }
    }
  });
});

console.log('Internal index.ts generation completed.');
