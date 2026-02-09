import { org } from '@/docs.config';
import { resolveProjectUrl } from '@hanzo/docs-org/config';

export default function HubPage() {
  const grouped = groupByCategory(org.projects);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">{org.name} Documentation</h1>
        <p className="text-lg text-fd-muted-foreground">
          Explore documentation for all {org.name} projects
        </p>
      </div>

      {Object.entries(grouped).map(([category, projects]) => (
        <section key={category} className="mb-10">
          {category !== '_ungrouped' && (
            <h2 className="mb-4 text-xl font-semibold">{category}</h2>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const url = resolveProjectUrl(org, project);
              return (
                <a
                  key={project.slug}
                  href={url}
                  className="rounded-lg border border-fd-border p-4 transition-colors hover:bg-fd-accent"
                  {...(project.external ? { target: '_blank', rel: 'noopener' } : {})}
                >
                  <h3 className="font-medium mb-1">{project.name}</h3>
                  <p className="text-sm text-fd-muted-foreground">
                    {project.description}
                  </p>
                </a>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}

function groupByCategory(
  projects: typeof org.projects,
): Record<string, typeof org.projects> {
  const groups: Record<string, typeof org.projects> = {};
  for (const p of projects) {
    const key = p.category ?? '_ungrouped';
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }
  return groups;
}
