export function getSection(path: string | undefined) {
  if (!path) return 'framework';
  const [dir] = path.split('/', 1);
  if (!dir) return 'framework';
  return (
    {
      ui: 'ui',
      mdx: 'mdx',
      cli: 'cli',
      headless: 'headless',
      llm: 'llm',
      mcp: 'mcp',
      dev: 'dev',
      zap: 'zap',
      services: 'services',
    }[dir] ?? 'framework'
  );
}
