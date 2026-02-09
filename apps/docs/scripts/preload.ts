export {};

try {
  const { createMdxPlugin } = await import('@hanzo/docs/mdx/bun');
  const { postInstall } = await import('@hanzo/docs/mdx/next');

  process.env.LINT = '1';
  const configPath = 'source.config.ts';
  await postInstall({ configPath });
  Bun.plugin(createMdxPlugin({ configPath }));
} catch {
  // MDX plugin not available (e.g. CI before packages are linked)
}
