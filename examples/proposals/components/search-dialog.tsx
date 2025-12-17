'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  FileText,
  Github,
  MessageSquare,
  ArrowRight,
  Hash,
  BookOpen,
  Layers,
  Lock,
  Coins,
  Vote,
  Rocket,
  FlaskConical,
  X,
  Command,
  ExternalLink,
  Brain,
  Network,
  Bot,
} from 'lucide-react';
import type { BrandConfig, ProposalCategory } from '../lib/brand';

interface SearchResult {
  id: string;
  url: string;
  title: string;
  description: string;
  structuredData?: {
    proposal?: number;
    status?: string;
    type?: string;
    category?: string;
  };
}

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

// Icon mapping for categories
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  layers: Layers,
  lock: Lock,
  token: Coins,
  vote: Vote,
  upgrade: Rocket,
  research: FlaskConical,
  brain: Brain,
  network: Network,
  bot: Bot,
  flask: FlaskConical,
  code: FileText,
  users: Vote,
  consensus: Layers,
  chart: Rocket,
  platform: Layers,
  contract: FileText,
  exchange: Coins,
};

interface SearchDialogProps {
  brand: BrandConfig;
}

export function SearchDialog({ brand }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const prefix = brand.proposalPrefix.toLowerCase();
  const isProposalPage = pathname.startsWith(`/docs/${prefix}-`);
  const currentProposal = isProposalPage ? pathname.split('/').pop()?.replace(`${prefix}-`, '') : null;

  // Generate quick actions from brand categories
  const getQuickActions = useCallback((): QuickAction[] => {
    const categoryActions: QuickAction[] = brand.categories.map(cat => {
      const IconComponent = categoryIcons[cat.icon] || FileText;
      return {
        id: `category-${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
        label: cat.name,
        description: `${brand.proposalPrefix}-${cat.range[0]} to ${brand.proposalPrefix}-${cat.range[1]}`,
        icon: <IconComponent className="h-4 w-4" />,
        action: () => router.push(`/docs#${cat.name.toLowerCase().replace(/\s+/g, '-')}`),
        keywords: cat.keyTopics.map(t => t.toLowerCase()),
      };
    });

    const baseActions: QuickAction[] = [
      {
        id: 'browse-all',
        label: `Browse All ${brand.shortName}`,
        description: `View all ${brand.fullName}`,
        icon: <FileText className="h-4 w-4" />,
        action: () => router.push('/docs'),
        keywords: ['all', 'proposals', 'list', 'browse'],
      },
      ...categoryActions,
    ];

    // Add external links if available
    if (brand.githubRepo) {
      baseActions.push({
        id: 'github',
        label: 'View on GitHub',
        description: 'Browse source repository',
        icon: <Github className="h-4 w-4" />,
        action: () => window.open(brand.githubRepo, '_blank'),
        keywords: ['github', 'source', 'repo', 'repository'],
      });
    }

    if (brand.forumUrl) {
      baseActions.push({
        id: 'forum',
        label: 'Discussion Forum',
        description: 'Join community discussions',
        icon: <MessageSquare className="h-4 w-4" />,
        action: () => window.open(brand.forumUrl, '_blank'),
        keywords: ['forum', 'discuss', 'community', 'chat'],
      });
    }

    if (brand.docsUrl) {
      baseActions.push({
        id: 'docs',
        label: 'Network Documentation',
        description: 'Read full documentation',
        icon: <BookOpen className="h-4 w-4" />,
        action: () => window.open(brand.docsUrl, '_blank'),
        keywords: ['docs', 'documentation', 'guide', 'learn'],
      });
    }

    // Add proposal-specific actions if on a proposal page
    if (isProposalPage && currentProposal) {
      const proposalActions: QuickAction[] = [
        {
          id: 'edit-github',
          label: 'Edit on GitHub',
          description: `Edit ${brand.proposalPrefix}-${currentProposal} source`,
          icon: <Github className="h-4 w-4" />,
          action: () => {
            const repoPath = brand.githubRepo.replace('https://github.com/', '');
            window.open(`https://github.com/${repoPath}/edit/main/${brand.shortName}/${prefix}-${currentProposal}.md`, '_blank');
          },
          keywords: ['edit', 'github', 'source', 'modify'],
        },
        {
          id: 'view-raw',
          label: 'View Raw Markdown',
          description: 'See the raw markdown file',
          icon: <FileText className="h-4 w-4" />,
          action: () => {
            const repoPath = brand.githubRepo.replace('https://github.com/', '');
            window.open(`https://raw.githubusercontent.com/${repoPath}/main/${brand.shortName}/${prefix}-${currentProposal}.md`, '_blank');
          },
          keywords: ['raw', 'markdown', 'source'],
        },
      ];

      if (brand.forumUrl) {
        proposalActions.push({
          id: 'discuss',
          label: 'Join Discussion',
          description: `Discuss ${brand.proposalPrefix}-${currentProposal}`,
          icon: <MessageSquare className="h-4 w-4" />,
          action: () => window.open(`${brand.forumUrl}/c/${brand.shortName.toLowerCase()}/${currentProposal}`, '_blank'),
          keywords: ['discuss', 'forum', 'comment', 'feedback'],
        });
      }

      return [...proposalActions, ...baseActions];
    }

    return baseActions;
  }, [brand, isProposalPage, currentProposal, router, prefix]);

  const quickActions = getQuickActions();

  // Search functionality
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      }
      setLoading(false);
    }, 200);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  // Filter quick actions based on query
  const filteredActions = query
    ? quickActions.filter(
        (action) =>
          action.label.toLowerCase().includes(query.toLowerCase()) ||
          action.description.toLowerCase().includes(query.toLowerCase()) ||
          action.keywords?.some((k) => k.toLowerCase().includes(query.toLowerCase()))
      )
    : quickActions;

  // Combined items for navigation
  const allItems = [...filteredActions.map((a) => ({ type: 'action' as const, ...a })), ...results.map((r) => ({ type: 'result' as const, ...r }))];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Navigation within dialog
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, allItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && allItems[selectedIndex]) {
        e.preventDefault();
        const item = allItems[selectedIndex];
        if (item.type === 'action') {
          item.action();
        } else {
          router.push(item.url);
        }
        setOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, allItems, router]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Reset selection when items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, results]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-fd-border bg-fd-muted/50 px-3 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="ml-2 hidden rounded bg-fd-muted px-1.5 py-0.5 text-xs font-medium sm:inline-block">
          <Command className="inline h-3 w-3" />K
        </kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Dialog */}
      <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-2xl -translate-x-1/2 animate-in fade-in-0 zoom-in-95">
        <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-background shadow-2xl">
          {/* Search Input */}
          <div className="flex items-center border-b border-fd-border px-4">
            <Search className="h-5 w-5 text-fd-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder={isProposalPage ? `Search ${brand.shortName} or actions for ${brand.proposalPrefix}-${currentProposal}...` : `Search ${brand.shortName}, categories, or actions...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent px-3 py-4 text-base outline-none placeholder:text-fd-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 hover:bg-fd-muted rounded">
                <X className="h-4 w-4 text-fd-muted-foreground" />
              </button>
            )}
            <kbd className="ml-2 rounded bg-fd-muted px-2 py-1 text-xs text-fd-muted-foreground">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {/* Quick Actions */}
            {filteredActions.length > 0 && (
              <div className="mb-2">
                <div className="px-2 py-1.5 text-xs font-medium text-fd-muted-foreground">
                  {isProposalPage ? `${brand.proposalPrefix} Actions` : 'Quick Actions'}
                </div>
                {filteredActions.map((action, index) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      action.action();
                      setOpen(false);
                      setQuery('');
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      selectedIndex === index ? 'bg-fd-primary/10 text-fd-primary' : 'hover:bg-fd-muted'
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-fd-muted">
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{action.label}</div>
                      <div className="text-sm text-fd-muted-foreground truncate">{action.description}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-fd-muted-foreground" />
                  </button>
                ))}
              </div>
            )}

            {/* Search Results */}
            {loading && (
              <div className="px-3 py-8 text-center text-fd-muted-foreground">
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <p className="mt-2 text-sm">Searching...</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div>
                <div className="px-2 py-1.5 text-xs font-medium text-fd-muted-foreground">
                  {brand.shortName} ({results.length})
                </div>
                {results.map((result, index) => {
                  const itemIndex = filteredActions.length + index;
                  return (
                    <button
                      key={result.id}
                      onClick={() => {
                        router.push(result.url);
                        setOpen(false);
                        setQuery('');
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        selectedIndex === itemIndex ? 'bg-fd-primary/10 text-fd-primary' : 'hover:bg-fd-muted'
                      }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-fd-muted">
                        <Hash className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {result.structuredData?.proposal && (
                            <span className="text-fd-primary">{brand.proposalPrefix}-{result.structuredData.proposal}: </span>
                          )}
                          {result.title}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-fd-muted-foreground">
                          {result.structuredData?.status && (
                            <span className={`rounded px-1.5 py-0.5 text-xs ${
                              result.structuredData.status === 'Final' ? 'bg-green-500/10 text-green-500' :
                              result.structuredData.status === 'Draft' ? 'bg-yellow-500/10 text-yellow-500' :
                              result.structuredData.status === 'Review' ? 'bg-blue-500/10 text-blue-500' :
                              'bg-fd-muted text-fd-muted-foreground'
                            }`}>
                              {result.structuredData.status}
                            </span>
                          )}
                          {result.structuredData?.category && (
                            <span className="text-xs">{result.structuredData.category}</span>
                          )}
                          <span className="truncate">{result.description}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-fd-muted-foreground flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && filteredActions.length === 0 && (
              <div className="px-3 py-8 text-center text-fd-muted-foreground">
                <BookOpen className="mx-auto h-8 w-8 opacity-50" />
                <p className="mt-2">No results found for "{query}"</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            )}

            {!query && (
              <div className="px-3 py-2 text-xs text-fd-muted-foreground border-t border-fd-border mt-2 pt-2">
                <div className="flex items-center justify-between">
                  <span>
                    <kbd className="rounded bg-fd-muted px-1.5 py-0.5 mr-1">↑</kbd>
                    <kbd className="rounded bg-fd-muted px-1.5 py-0.5 mr-1">↓</kbd>
                    to navigate
                  </span>
                  <span>
                    <kbd className="rounded bg-fd-muted px-1.5 py-0.5 mr-1">Enter</kbd>
                    to select
                  </span>
                  <span>
                    <kbd className="rounded bg-fd-muted px-1.5 py-0.5">ESC</kbd>
                    to close
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
