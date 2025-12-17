import { cpSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Copy CSS files from @hanzo/docs-ui
const uiCssSource = join(root, 'node_modules/@hanzo/docs-ui/css');
const uiCssDest = join(root, 'dist/ui/css');

// Copy style.css from dist
const uiDistSource = join(root, 'node_modules/@hanzo/docs-ui/dist');
const uiDistDest = join(root, 'dist/ui');

// Copy twoslash.css from @hanzo/docs-twoslash (styles folder)
const twoslashStylesSource = join(root, 'node_modules/@hanzo/docs-twoslash/styles');
const twoslashDistDest = join(root, 'dist/twoslash');

// Copy openapi CSS from @hanzo/docs-openapi
const openapiCssSource = join(root, 'node_modules/@hanzo/docs-openapi/css');
const openapiCssDest = join(root, 'dist/openapi/css');

try {
  mkdirSync(uiCssDest, { recursive: true });
  cpSync(uiCssSource, uiCssDest, { recursive: true });
  cpSync(join(uiDistSource, 'style.css'), join(uiDistDest, 'style.css'));
  // image-zoom.css is in dist/components/
  cpSync(join(uiDistSource, 'components/image-zoom.css'), join(uiDistDest, 'image-zoom.css'));

  // Copy theme directory for CSS relative references (preset.css references ../dist/theme/typography)
  // From dist/ui/css/, ../dist/theme/ resolves to dist/ui/dist/theme/
  const themeSource = join(uiDistSource, 'theme');
  const themeDest = join(root, 'dist/ui/dist/theme');
  if (existsSync(themeSource)) {
    mkdirSync(themeDest, { recursive: true });
    cpSync(themeSource, themeDest, { recursive: true });
  }

  // Copy twoslash.css if it exists
  mkdirSync(twoslashDistDest, { recursive: true });
  const twoslashCssSrc = join(twoslashStylesSource, 'twoslash.css');
  if (existsSync(twoslashCssSrc)) {
    cpSync(twoslashCssSrc, join(twoslashDistDest, 'twoslash.css'));
  }

  // Copy openapi CSS if it exists
  if (existsSync(openapiCssSource)) {
    mkdirSync(openapiCssDest, { recursive: true });
    cpSync(openapiCssSource, openapiCssDest, { recursive: true });
  }

  console.log('CSS files copied successfully');
} catch (error) {
  console.error('Error copying CSS files:', error);
  process.exit(1);
}
