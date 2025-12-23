import { type Page } from '@/lib/source';

export async function getLLMText(page: Page) {
  if (page.data.type === 'openapi') return '';

  const category =
    {
      ui: 'Hanzo Docs Framework',
      headless: 'Hanzo Docs Core (core library of framework)',
      mdx: 'Hanzo Docs MDX (the built-in content source)',
      cli: 'Hanzo Docs CLI (the CLI tool for automating Hanzo Docs apps)',
    }[page.slugs[0]] ?? page.slugs[0];

  const processed = await page.data.getText('processed');

  return `# ${category}: ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/hanzoai/docs/refs/heads/main/apps/docs/content/docs/${page.path}

${page.data.description ?? ''}
        
${processed}`;
}
