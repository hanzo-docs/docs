import {
  type InferMetaType,
  type InferPageType,
  type LoaderPlugin,
  loader,
  multiple,
} from '@hanzo/docs-core/source';
import { openapiPlugin, openapiSource } from '@hanzo/docs-openapi/server';
import { blog as blogPosts, docs } from '@hanzo/docs-mdx:collections/server';
import { toFumadocsSource } from '@hanzo/docs-mdx/runtime/server';
import { lucideIconsPlugin } from '@hanzo/docs-core/source/lucide-icons';
import { openapi } from '@/lib/openapi';

export const source = loader(
  multiple({
    docs: docs.toFumadocsSource(),
    openapi: await openapiSource(openapi, {
      baseDir: 'openapi/(generated)',
    }),
  }),
  {
    baseUrl: '/docs',
    plugins: [pageTreeCodeTitles(), lucideIconsPlugin(), openapiPlugin()],
  },
);

function pageTreeCodeTitles(): LoaderPlugin {
  return {
    transformPageTree: {
      file(node) {
        if (
          typeof node.name === 'string' &&
          (node.name.endsWith('()') || node.name.match(/^<\w+ \/>$/))
        ) {
          return {
            ...node,
            name: <code className="text-[0.8125rem]">{node.name}</code>,
          };
        }
        return node;
      },
    },
  };
}

export const blog = loader(toFumadocsSource(blogPosts, []), {
  baseUrl: '/blog',
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
