import defaultMdxComponents from '@hanzo/radix/mdx';
import type { MDXComponents } from 'mdx/types';
import * as Python from 'hanzo-docs-python/components';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...Python,
    ...components,
  };
}
