import { source } from '../../lib/instance';
import { brand } from '../../lib/config';
import Link from 'next/link';
import { FileText, ArrowRight, CheckCircle, Clock, Edit } from 'lucide-react';

export default function DocsIndexPage() {
  const categories = source.getAllCategories();
  const stats = source.getStats();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {brand.fullName}
        </h1>
        <p className="text-lg text-fd-muted-foreground">
          {brand.description}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="rounded-lg border border-fd-border bg-fd-card p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-fd-muted-foreground">Total {brand.shortName}</div>
        </div>
        <div className="rounded-lg border border-fd-border bg-fd-card p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-bold">{stats.byStatus['Final'] || 0}</span>
          </div>
          <div className="text-sm text-fd-muted-foreground">Final</div>
        </div>
        <div className="rounded-lg border border-fd-border bg-fd-card p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="text-2xl font-bold">{stats.byStatus['Review'] || 0}</span>
          </div>
          <div className="text-sm text-fd-muted-foreground">In Review</div>
        </div>
        <div className="rounded-lg border border-fd-border bg-fd-card p-4">
          <div className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold">{stats.byStatus['Draft'] || 0}</span>
          </div>
          <div className="text-sm text-fd-muted-foreground">Draft</div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Browse by Category</h2>
        {categories.map((category) => (
          <section key={category.name} id={category.name.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-24">
            <div className="rounded-xl border border-fd-border bg-fd-card overflow-hidden">
              <div className="p-6 border-b border-fd-border">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-fd-muted-foreground">{category.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {category.keyTopics.map((topic) => (
                    <span
                      key={topic}
                      className="text-xs px-2 py-1 rounded-full bg-fd-muted text-fd-muted-foreground"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {category.proposals.length > 0 ? (
                <div className="divide-y divide-fd-border">
                  {category.proposals.slice(0, 10).map((proposal) => (
                    <Link
                      key={proposal.slug.join('/')}
                      href={`/docs/${proposal.slug.join('/')}`}
                      className="flex items-center gap-4 p-4 hover:bg-fd-muted/50 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-fd-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          <span className="text-fd-primary">
                            {brand.proposalPrefix}-{proposal.data.frontmatter.proposal}:
                          </span>{' '}
                          {proposal.data.title}
                        </div>
                        {proposal.data.description && (
                          <div className="text-sm text-fd-muted-foreground truncate">
                            {proposal.data.description}
                          </div>
                        )}
                      </div>
                      {proposal.data.frontmatter.status && (
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            proposal.data.frontmatter.status === 'Final'
                              ? 'bg-green-500/10 text-green-500'
                              : proposal.data.frontmatter.status === 'Draft'
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : proposal.data.frontmatter.status === 'Review'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-fd-muted text-fd-muted-foreground'
                          }`}
                        >
                          {proposal.data.frontmatter.status}
                        </span>
                      )}
                      <ArrowRight className="h-4 w-4 text-fd-muted-foreground flex-shrink-0" />
                    </Link>
                  ))}
                  {category.proposals.length > 10 && (
                    <div className="p-4 text-center text-sm text-fd-muted-foreground">
                      +{category.proposals.length - 10} more proposals
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-fd-muted-foreground">
                  <p>No proposals in this category yet.</p>
                  <p className="text-sm mt-1">{category.learnMore}</p>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
