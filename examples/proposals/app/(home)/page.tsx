import Link from 'next/link';
import { ArrowRight, FileText, Users, GitPullRequest } from 'lucide-react';
import { brand } from '../../lib/config';
import { source } from '../../lib/instance';

export default function HomePage() {
  const stats = source.getStats();
  const categories = source.getCategorizedPages();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            {brand.name}
          </h1>
          <p className="text-xl text-fd-muted-foreground mb-8 max-w-2xl mx-auto">
            {brand.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Browse {brand.shortName}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {brand.githubRepo && (
              <a
                href={brand.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-fd-border font-medium hover:bg-fd-muted transition-colors"
              >
                <GitPullRequest className="h-4 w-4" />
                Contribute
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-fd-border bg-fd-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold">{stats.total}</div>
              <div className="text-fd-muted-foreground">Total {brand.shortName}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500">{stats.byStatus['Final'] || 0}</div>
              <div className="text-fd-muted-foreground">Final</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500">{stats.byStatus['Review'] || 0}</div>
              <div className="text-fd-muted-foreground">In Review</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-500">{stats.byStatus['Draft'] || 0}</div>
              <div className="text-fd-muted-foreground">Draft</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Categories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.name}
                href={`/docs#${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group rounded-xl border border-fd-border p-6 hover:border-fd-primary/50 hover:bg-fd-muted/30 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2 group-hover:text-fd-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-fd-muted-foreground mb-4">{category.shortDesc}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-fd-muted-foreground">
                    {category.proposals.length} {brand.shortName}
                  </span>
                  <span className="text-fd-primary font-medium inline-flex items-center gap-1">
                    Explore
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-fd-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Want to contribute?</h2>
          <p className="text-fd-muted-foreground mb-6">
            {brand.shortName} are open to everyone. Have an idea for improvement?
            Start by discussing it with the community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {brand.forumUrl && (
              <a
                href={brand.forumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-fd-border hover:bg-fd-muted transition-colors"
              >
                <Users className="h-4 w-4" />
                Join Discussion
              </a>
            )}
            {brand.githubRepo && (
              <a
                href={`${brand.githubRepo}/blob/main/CONTRIBUTING.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-fd-border hover:bg-fd-muted transition-colors"
              >
                <FileText className="h-4 w-4" />
                Read Guidelines
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
