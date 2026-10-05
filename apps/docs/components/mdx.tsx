import type { MDXComponents } from 'mdx/types';
import * as Prose from '@/components/mdx/prose';
import { Code, CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger } from '@/components/mdx/code';
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/mdx/tabs';
import { Accordion, Accordions, Callout, Card, Cards, File, Files, Folder, Step, Steps } from '@/components/mdx/blocks';
import { ModelsCatalog, ConnectorsCatalog, InstallCatalog } from '@/components/catalogs';
import { Hero } from '@/components/hero';
import { ProductSection, ProductSections } from '@/components/product-section';
import { ProviderStrip } from '@/components/provider-strip';
import { Example } from '@/components/example';

/**
 * Everything a docs page's MDX can render, by the name it is written with.
 * Markdown's own elements are the gui set in components/mdx/prose.tsx; the
 * named parts are the gui set beside it. A blockquote is a callout, the way the
 * content has always used it.
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    p: Prose.P,
    h1: Prose.H1,
    h2: Prose.H2,
    h3: Prose.H3,
    h4: Prose.H4,
    h5: Prose.H5,
    h6: Prose.H6,
    a: Prose.A,
    strong: Prose.Strong,
    em: Prose.Em,
    code: Prose.Code,
    ul: Prose.Ul,
    ol: Prose.Ol,
    li: Prose.Li,
    hr: Prose.Hr,
    table: Prose.Table,
    thead: Prose.Thead,
    tbody: Prose.Tbody,
    tr: Prose.Tr,
    th: Prose.Th,
    td: Prose.Td,
    img: Prose.Img,
    blockquote: Callout,
    pre: Code,
    CodeBlockTabs,
    CodeBlockTabsList,
    CodeBlockTabsTrigger,
    CodeBlockTab,
    Tabs,
    Tab,
    TabsList,
    TabsTrigger,
    TabsContent,
    Callout,
    Card,
    Cards,
    Steps,
    Step,
    Accordion,
    Accordions,
    Files,
    File,
    Folder,
    // The docs masthead and the domain sections under it.
    DocsHero: Hero,
    ProductSection,
    ProductSections,
    ProviderStrip,
    // Live catalogs, fetched at runtime.
    ModelsCatalog,
    ConnectorsCatalog,
    InstallCatalog,
    // The API reference's examples, highlighted at render (lib/rehype-example).
    Example,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
