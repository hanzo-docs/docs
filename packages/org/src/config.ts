import type { OrgConfig, ProjectConfig, ProjectEntry } from './types';

/**
 * Define an organization configuration.
 */
export function defineOrg(config: OrgConfig): OrgConfig {
  return config;
}

/**
 * Define a project within an organization.
 * Looks up the project entry from the org config by slug.
 */
export function defineProject(
  org: OrgConfig,
  projectSlug: string,
  overrides?: Partial<ProjectConfig['project']>,
): ProjectConfig {
  const entry = org.projects.find((p) => p.slug === projectSlug);
  if (!entry) {
    throw new Error(
      `Project "${projectSlug}" not found in org "${org.slug}". Available: ${org.projects.map((p) => p.slug).join(', ')}`,
    );
  }

  return {
    org,
    project: {
      slug: entry.slug,
      name: entry.name,
      description: entry.description,
      icon: entry.icon,
      ...overrides,
    },
  };
}

/**
 * Resolve the docs URL for a project within an org.
 */
export function resolveProjectUrl(
  org: OrgConfig,
  project: ProjectEntry,
): string {
  if (project.url) return project.url;
  return `https://${org.docsPattern.replace('{project}', project.slug)}`;
}
