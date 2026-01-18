import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesPath = path.join(__dirname, '..', 'dist', '_routes.json');

try {
  if (fs.existsSync(routesPath)) {
    const routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
    // Explicitly include CSS files
    routes.include = [
      "/*",
      "/_astro/*",
      "/_astro/*.css"
    ];
    routes.exclude = []; // Remove all exclusions
    fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2));
    console.log('✓ Fixed _routes.json - included /_astro/*');
  }
} catch (error) {
  console.error('Error fixing routes:', error);
  process.exit(1);
}
