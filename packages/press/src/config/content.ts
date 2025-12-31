import type { DefaultMDXOptions } from '@hanzo/docs-mdx/config';
import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from '@hanzo/docs-mdx/config';
import { z } from 'zod';
import type { PressConfig } from './global';
import type { ProcessorOptions } from '@mdx-js/mdx';

export interface ContentConfig {
  mdx?:
    | ({
        preset?: 'hanzo-docs';
      } & DefaultMDXOptions)
    | ({
        preset: 'minimal';
      } & ProcessorOptions);
}

export async function createContentConfig(config: PressConfig) {
  return {
    docs: defineDocs({
      dir: 'content',
      docs: {
        schema: frontmatterSchema
          .extend({
            layout: z.string().default('docs'),
          })
          .loose(),
      },
      meta: {
        schema: metaSchema.loose(),
      },
    }),
    default: defineConfig({
      mdxOptions: config.content?.mdx,
    }),
  };
}

export type DocsMDXConfig = Awaited<ReturnType<typeof createContentConfig>>;
