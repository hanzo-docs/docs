import type { TemplatePlugin } from '@/index';
import { writeFile } from '@/utils';
import path from 'node:path';

const orgPresets = ['hanzo', 'lux', 'zoo', 'zen'] as const;
type OrgPreset = (typeof orgPresets)[number];

interface OrgDocsOptions {
  org?: OrgPreset;
  projectSlug?: string;
}

export function orgDocs(options: OrgDocsOptions = {}): TemplatePlugin {
  const org = options.org ?? 'hanzo';
  const projectSlug = options.projectSlug ?? 'dev';

  return {
    packageJson(packageJson) {
      return {
        ...packageJson,
        dependencies: {
          ...packageJson.dependencies,
          '@hanzo/docs-org': 'workspace:*',
        },
      };
    },
    async afterWrite() {
      const { dest } = this;

      await writeFile(
        path.join(dest, 'docs.config.ts'),
        `import { defineProject } from '@hanzo/docs-org/config';
import { ${org} } from '@hanzo/docs-org/presets/${org}';

const config = defineProject(${org}, '${projectSlug}');

export default config;
`,
      );
    },
  };
}
