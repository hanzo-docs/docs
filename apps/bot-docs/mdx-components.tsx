import type { MDXComponents } from 'mdx/types';
import type { FC, ReactNode } from 'react';
import defaultMdxComponents from '@hanzo/docs-base-ui/mdx';
import { Tab, Tabs } from '@hanzo/docs-base-ui/components/tabs';
import { Callout } from '@hanzo/docs-base-ui/components/callout';
import { Step, Steps } from '@hanzo/docs-base-ui/components/steps';
import { Card, Cards } from '@hanzo/docs-base-ui/components/card';
import { File, Folder, Files } from '@hanzo/docs-base-ui/components/files';
import { Accordion, Accordions } from '@hanzo/docs-base-ui/components/accordion';

// Mintlify compatibility wrappers
const CardGroup: FC<{ cols?: number; children?: ReactNode }> = ({ children }) => (
  <Cards>{children}</Cards>
);
const Columns: FC<{ cols?: number; children?: ReactNode }> = ({ children }) => (
  <Cards>{children}</Cards>
);
const AccordionGroup: FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="my-4 space-y-2">{children}</div>
);
const StandaloneAccordion: FC<{ title?: string; children?: ReactNode }> = ({ title, children }) => (
  <details className="my-3 rounded-lg border border-fd-border bg-fd-card px-4 py-2">
    <summary className="cursor-pointer font-medium select-none py-1">{title}</summary>
    <div className="pt-2">{children}</div>
  </details>
);
const Info: FC<{ children?: ReactNode }> = ({ children }) => (
  <Callout type="info">{children}</Callout>
);
const Tip: FC<{ children?: ReactNode }> = ({ children }) => (
  <Callout type="info">{children}</Callout>
);
const Check: FC<{ children?: ReactNode }> = ({ children }) => (
  <Callout type="info">{children}</Callout>
);
const Warning: FC<{ children?: ReactNode }> = ({ children }) => (
  <Callout type="warn">{children}</Callout>
);
const Note: FC<{ children?: ReactNode }> = ({ children }) => (
  <Callout>{children}</Callout>
);

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tab,
    Tabs,
    Callout,
    Step,
    Steps,
    Card,
    Cards,
    CardGroup,
    Columns,
    Info,
    Tip,
    Check,
    Warning,
    Note,
    File,
    Folder,
    Files,
    Accordion: StandaloneAccordion,
    Accordions,
    AccordionGroup,
    ...components,
  };
}
