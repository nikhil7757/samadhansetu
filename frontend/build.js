import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');
const indexHtml = path.join(__dirname, 'index.html');

fs.mkdirSync(distDir, { recursive: true });
fs.copyFileSync(indexHtml, path.join(distDir, 'index.html'));
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, distDir, { recursive: true });
}
console.log('Build succeeded: static Ironforge distribution generated in dist/');
