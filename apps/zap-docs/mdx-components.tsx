import type { MDXComponents } from 'mdx/types';
import defaultMdxComponents from '@hanzo/docs-ui/mdx';
import { Tab, Tabs } from '@hanzo/docs-ui/components/tabs';
import { Callout } from '@hanzo/docs-ui/components/callout';
import { Step, Steps } from '@hanzo/docs-ui/components/steps';
import { File, Folder, Files } from '@hanzo/docs-ui/components/files';
import { Accordion, Accordions } from '@hanzo/docs-ui/components/accordion';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tab,
    Tabs,
    Callout,
    Step,
    Steps,
    File,
    Folder,
    Files,
    Accordion,
    Accordions,
    ...components,
  };
}
