'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ProjectConfig, ProjectEntry } from '../types';
import { resolveProjectUrl } from '../config';

interface ProjectSwitcherProps {
  config: ProjectConfig;
}

/**
 * Dropdown that shows all projects in the org, grouped by category.
 * Current project is highlighted. Clicking navigates to the project's docs.
 */
export function ProjectSwitcher({ config }: ProjectSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { org, project } = config;

  const grouped = groupByCategory(org.projects);

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-1 rounded-md px-2 py-1 text-sm hover:bg-fd-accent"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="font-medium">{org.name}</span>
        <ChevronDown className="size-3.5 opacity-60" />
      </button>
      {open && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-fd-border bg-fd-popover p-1.5 shadow-lg">
            {Object.entries(grouped).map(([category, projects]) => (
              <div key={category}>
                {category !== '_ungrouped' && (
                  <div className="px-2 py-1 text-xs font-medium text-fd-muted-foreground">
                    {category}
                  </div>
                )}
                {projects.map((p) => {
                  const isCurrent = p.slug === project.slug;
                  const url = resolveProjectUrl(org, p);
                  return (
                    <a
                      key={p.slug}
                      href={url}
                      className={`flex items-start gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                        isCurrent
                          ? 'bg-fd-primary/10 text-fd-primary'
                          : 'hover:bg-fd-accent'
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-fd-muted-foreground">
                          {p.description}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function groupByCategory(
  projects: ProjectEntry[],
): Record<string, ProjectEntry[]> {
  const groups: Record<string, ProjectEntry[]> = {};
  for (const p of projects) {
    const key = p.category ?? '_ungrouped';
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }
  return groups;
}
