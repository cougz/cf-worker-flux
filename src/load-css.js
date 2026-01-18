import fs from 'fs';
import path from 'path';

const cssPath = path.join(process.cwd(), 'src', 'styles', 'global.css');
export const globalCSS = fs.readFileSync(cssPath, 'utf-8');
