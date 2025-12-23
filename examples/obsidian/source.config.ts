import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from '@hanzo/docs-mdx/config';
import { remarkObsidian, RemarkObsidianOptions } from 'hanzo-docs-obsidian/mdx';
import { readVaultFiles } from 'hanzo-docs-obsidian';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.partial(),
  },
});

export default defineConfig({
  mdxOptions: async () => {
    const files = await readVaultFiles({
      dir: 'content/docs/Obsidian Vault',
    });

    return {
      remarkPlugins: (plugins) => [
        [
          remarkObsidian,
          {
            files,
          } satisfies RemarkObsidianOptions,
        ],
        ...plugins,
      ],
    };
  },
});
