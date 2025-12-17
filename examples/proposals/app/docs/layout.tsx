import { DocsLayout } from '@hanzo/docs/ui/layouts/docs';
import type { ReactNode } from 'react';
import { FileText, GitPullRequest, Users, BookOpen } from 'lucide-react';
import { source } from '../../lib/instance';
import { brand } from '../../lib/config';

export default function Layout({ children }: { children: ReactNode }) {
  const pageTree = source.getPageTree();
  const stats = source.getStats();

  return (
    <DocsLayout
      tree={pageTree}
      nav={{
        title: (
          <div className="flex items-center gap-2 font-bold">
            <span>{brand.shortName}</span>
          </div>
        ),
        transparentMode: 'top',
      }}
      sidebar={{
        defaultOpenLevel: 1,
        banner: (
          <div className="rounded-lg border border-fd-border bg-fd-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="size-4" />
              <span className="text-sm font-semibold">{brand.shortName} Statistics</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-fd-muted-foreground">Total:</span>
                <span className="ml-1 font-medium">{stats.total}</span>
              </div>
              <div>
                <span className="text-fd-muted-foreground">Final:</span>
                <span className="ml-1 font-medium text-green-500">{stats.byStatus['Final'] || 0}</span>
              </div>
              <div>
                <span className="text-fd-muted-foreground">Draft:</span>
                <span className="ml-1 font-medium text-yellow-500">{stats.byStatus['Draft'] || 0}</span>
              </div>
              <div>
                <span className="text-fd-muted-foreground">Review:</span>
                <span className="ml-1 font-medium text-blue-500">{stats.byStatus['Review'] || 0}</span>
              </div>
            </div>
          </div>
        ),
        footer: (
          <div className="flex flex-col gap-3 p-4 text-xs border-t border-fd-border">
            {brand.githubRepo && (
              <a
                href={brand.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
              >
                <GitPullRequest className="size-4" />
                Contribute on GitHub
              </a>
            )}
            {brand.forumUrl && (
              <a
                href={brand.forumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
              >
                <Users className="size-4" />
                Discussion Forum
              </a>
            )}
            {brand.docsUrl && (
              <a
                href={brand.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-fd-muted-foreground hover:text-fd-foreground transition-colors"
              >
                <BookOpen className="size-4" />
                Network Docs
              </a>
            )}
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
