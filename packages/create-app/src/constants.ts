import { fileURLToPath } from 'node:url';
import versionPkg from '../../create-app-versions/package.json';
import { version as coreVersion } from '../../core/package.json';
import { version as uiVersion } from '../../ui/package.json';

// MDX version from create-app-versions dependencies
const mdxVersion = '14.1.1';

export const sourceDir = fileURLToPath(new URL(`../`, import.meta.url).href);

export const isCI = Boolean(process.env.CI);

export interface TemplateInfo {
  value:
    | '+next+fuma-docs-mdx'
    | 'waku'
    | 'react-router'
    | 'react-router-spa'
    | 'tanstack-start'
    | 'tanstack-start-spa';
  label: string;
  appDir: string;
  /**
   * path to root provider, relative to `appDir``
   */
  rootProviderPath: string;
  hint?: string;
  /**
   * rename files when copying from template
   */
  rename?: (name: string) => string;
}

export const templates: TemplateInfo[] = [
  {
    value: '+next+fuma-docs-mdx',
    label: 'Next.js: Hanzo MDX',
    hint: 'recommended',
    appDir: '',
    rootProviderPath: 'app/layout.tsx',
  },
  {
    value: 'waku',
    label: 'Waku: Hanzo MDX',
    appDir: 'src',
    rootProviderPath: 'components/provider.tsx',
  },
  {
    value: 'react-router',
    label: 'React Router: Hanzo MDX (not RSC)',
    appDir: 'app',
    rootProviderPath: 'root.tsx',
  },
  {
    value: 'react-router-spa',
    label: 'React Router SPA: Hanzo MDX (not RSC)',
    hint: 'SPA mode allows you to host the site statically, compatible with a CDN.',
    appDir: 'app',
    rootProviderPath: 'root.tsx',
  },
  {
    value: 'tanstack-start',
    label: 'Tanstack Start: Hanzo MDX (not RSC)',
    appDir: 'src',
    rootProviderPath: 'routes/__root.tsx',
  },
  {
    value: 'tanstack-start-spa',
    label: 'Tanstack Start SPA: Hanzo MDX (not RSC)',
    hint: 'SPA mode allows you to host the site statically, compatible with a CDN.',
    appDir: 'src',
    rootProviderPath: 'routes/__root.tsx',
  },
];

export const depVersions = {
  ...versionPkg.dependencies,
  '@hanzo/docs/core': coreVersion,
  '@hanzo/docs/ui': uiVersion,
  '@hanzo/docs/mdx': mdxVersion,
};
