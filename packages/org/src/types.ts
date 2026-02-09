import type { ReactNode } from 'react';

export interface OrgConfig {
  /** Display name, e.g. 'Hanzo AI' */
  name: string;
  /** URL slug, e.g. 'hanzo' */
  slug: string;
  /** Primary domain, e.g. 'hanzo.ai' */
  domain: string;
  /** Pattern for project subdomains, e.g. '{project}.hanzo.ai' */
  docsPattern: string;
  /** GitHub org URL, e.g. 'https://github.com/hanzoai' */
  github: string;
  /** Logo component or Lucide icon name */
  logo: ReactNode | string;
  /** Brand colors */
  brand: {
    /** HSL primary color */
    primary: string;
    /** HSL secondary color */
    secondary?: string;
  };
  /** Projects in this org */
  projects: ProjectEntry[];
}

export interface ProjectEntry {
  /** URL slug, e.g. 'dev' */
  slug: string;
  /** Display name, e.g. 'Hanzo Dev' */
  name: string;
  /** Short description */
  description: string;
  /** Lucide icon name */
  icon: string;
  /** Category for grouping in switcher, e.g. 'Tools', 'Infrastructure' */
  category?: string;
  /** If true, links to an external URL instead of docs subdomain */
  external?: boolean;
  /** Override URL (for external links) */
  url?: string;
}

export interface ProjectConfig {
  /** Organization this project belongs to */
  org: OrgConfig;
  /** This project's identity */
  project: {
    slug: string;
    name: string;
    description: string;
    icon: string;
    /** GitHub repo URL override */
    github?: string;
  };
}
