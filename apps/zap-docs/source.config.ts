import {
  applyMdxPreset,
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from '@hanzo/docs-mdx/config';
import { z } from 'zod';
import type { ElementContent } from 'hast';
import jsonSchema from '@hanzo/docs-mdx/plugins/json-schema';
import lastModified from '@hanzo/docs-mdx/plugins/last-modified';
import type { ShikiTransformer } from 'shiki';

export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema.extend({
      index: z.boolean().default(false),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
    },
    async: true,
    async mdxOptions(environment) {
      const { rehypeCodeDefaultOptions } = await import('@hanzo/docs-core/mdx-plugins/rehype-code');
      const { remarkStructureDefaultOptions } =
        await import('@hanzo/docs-core/mdx-plugins/remark-structure');
      const { remarkSteps } = await import('@hanzo/docs-core/mdx-plugins/remark-steps');

      return applyMdxPreset({
        remarkStructureOptions: {
          types: [...remarkStructureDefaultOptions.types, 'code'],
        },
        rehypeCodeOptions: {
          langs: ['ts', 'js', 'go', 'rust', 'python', 'cpp', 'c', 'java', 'csharp', 'erlang', 'ocaml', 'haskell', 'capnp', 'bash', 'json', 'yaml'],
          inline: 'tailing-curly-colon',
          themes: {
            light: 'github-light',
            dark: 'github-dark',
          },
          transformers: [
            ...(rehypeCodeDefaultOptions.transformers ?? []),
            transformerCapnp(),
          ],
        },
        remarkCodeTabOptions: {
          parseMdx: true,
        },
        remarkNpmOptions: {
          persist: {
            id: 'package-manager',
          },
        },
        remarkPlugins: [remarkSteps],
      })(environment);
    },
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
});

function transformerCapnp(): ShikiTransformer {
  return {
    name: 'zap:capnp-highlighter',
    code(hast) {
      // Cap'n Proto schema highlighting enhancement
      return hast;
    },
  };
}

export default defineConfig({
  plugins: [
    jsonSchema({
      insert: true,
    }),
    lastModified(),
  ],
});
