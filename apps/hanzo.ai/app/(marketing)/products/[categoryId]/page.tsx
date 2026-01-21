import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Database,
  Cpu,
  Clock,
  Brain,
  Activity,
  Layers,
  LayoutGrid,
  TrendingUp,
  Headphones,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

type ProductCategory =
  | 'data'
  | 'compute'
  | 'async'
  | 'ml'
  | 'observability'
  | 'platform'
  | 'apps'
  | 'growth'
  | 'cx';

interface CategoryInfo {
  id: ProductCategory;
  name: string;
  tagline: string;
  description: string;
  icon: string;
}

interface Product {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  subcategory?: string;
  icon: string;
  href: string;
  features: string[];
  status: 'ga' | 'beta' | 'alpha' | 'coming';
}

// =============================================================================
// DATA
// =============================================================================

const categories: CategoryInfo[] = [
  {
    id: 'data',
    name: 'Data',
    tagline: 'Core persistence & retrieval primitives',
    description: 'Storage, databases, and search engines for every workload. From relational to vector, key-value to document stores.',
    icon: 'Database',
  },
  {
    id: 'compute',
    name: 'Compute',
    tagline: 'Run code and host apps',
    description: 'Serverless functions, containers, and isolated execution environments. Deploy anywhere, scale automatically.',
    icon: 'Cpu',
  },
  {
    id: 'async',
    name: 'Async',
    tagline: 'Background execution & messaging',
    description: 'Durable tasks, scheduled jobs, queues, and pub/sub. Build reliable distributed systems.',
    icon: 'Clock',
  },
  {
    id: 'ml',
    name: 'ML',
    tagline: 'End-to-end MLOps',
    description: 'From notebooks to production. Train, tune, serve, and manage models at scale.',
    icon: 'Brain',
  },
  {
    id: 'observability',
    name: 'Observability',
    tagline: 'Signals & instrumentation',
    description: 'Metrics, logs, traces, and product analytics. Full visibility into your systems.',
    icon: 'Activity',
  },
  {
    id: 'platform',
    name: 'Platform',
    tagline: 'Infrastructure & security',
    description: 'Routing, authentication, secrets, and deployment. Everything for multi-tenant hosting.',
    icon: 'Layers',
  },
  {
    id: 'apps',
    name: 'Apps',
    tagline: 'End-user applications',
    description: 'Production-ready applications built on Hanzo primitives. BaaS, analytics, commerce, and more.',
    icon: 'LayoutGrid',
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'Analytics, experiments & engagement',
    description: 'Product analytics, web analytics, feature flags, A/B testing, and lifecycle messaging.',
    icon: 'TrendingUp',
  },
  {
    id: 'cx',
    name: 'CX & Ops',
    tagline: 'Customer experience & operations',
    description: 'Support inbox, CRM, and ERP. Everything for customer success and business operations.',
    icon: 'Headphones',
  },
];

// Sample products per category (subset for static generation)
const allProducts: Product[] = [
  // Data
  { id: 'sql', name: 'Hanzo SQL', shortName: 'SQL', tagline: 'Managed PostgreSQL', description: 'Production-ready PostgreSQL with automatic backups, scaling, and high availability.', category: 'data', icon: 'Database', href: '/products/data/sql', features: ['Automatic backups', 'Point-in-time recovery', 'Read replicas'], status: 'ga' },
  { id: 'vector', name: 'Hanzo Vector', shortName: 'Vector', tagline: 'High-performance vector database', description: 'Purpose-built vector database optimized for AI embeddings.', category: 'data', icon: 'Sparkles', href: '/products/data/vector', features: ['HNSW indexing', 'Filtered search', 'Payload storage'], status: 'ga' },
  { id: 'kv', name: 'Hanzo KV', shortName: 'KV', tagline: 'Redis-compatible key-value', description: 'Ultra-fast key-value store with Redis compatibility.', category: 'data', icon: 'Key', href: '/products/data/kv', features: ['Redis compatible', 'Sub-ms latency', 'Pub/sub'], status: 'ga' },
  { id: 'storage', name: 'Hanzo Storage', shortName: 'Storage', tagline: 'S3-compatible object storage', description: 'Store files, models, and assets with S3-compatible APIs.', category: 'data', icon: 'HardDrive', href: '/products/data/storage', features: ['S3 compatible', 'Versioning', 'CDN integration'], status: 'ga' },
  { id: 'search', name: 'Hanzo Search', shortName: 'Search', tagline: 'Lightning-fast full-text search', description: 'Instant search experiences with typo tolerance.', category: 'data', icon: 'Search', href: '/products/data/search', features: ['Typo tolerance', 'Faceted search', 'Instant results'], status: 'ga' },
  // Compute
  { id: 'functions', name: 'Hanzo Functions', shortName: 'Functions', tagline: 'Serverless compute platform', description: 'Deploy functions in any language. Auto-scaling, pay-per-execution.', category: 'compute', icon: 'Zap', href: '/products/compute/functions', features: ['Any language', 'Auto-scaling', 'Zero cold starts'], status: 'ga' },
  { id: 'machines', name: 'Hanzo Machines', shortName: 'Machines', tagline: 'Dedicated AI compute', description: 'GPU instances for training and inference.', category: 'compute', icon: 'Cpu', href: '/products/compute/machines', features: ['GPU instances', 'Spot pricing', 'Auto-scaling'], status: 'ga' },
  { id: 'gateway', name: 'Hanzo Gateway', shortName: 'Gateway', tagline: 'Unified AI inference proxy', description: 'Route to 100+ LLM providers through a single API.', category: 'compute', icon: 'Zap', href: '/products/compute/gateway', features: ['100+ providers', 'Load balancing', 'Cost tracking'], status: 'ga' },
  // Async
  { id: 'auto', name: 'Hanzo Auto', shortName: 'Auto', tagline: 'AI-powered workflow automation', description: 'All-in-one AI workflow automation platform.', category: 'async', icon: 'PlayCircle', href: '/products/async/auto', features: ['280+ integrations', 'Visual builder', 'AI-first design'], status: 'ga' },
  { id: 'flow', name: 'Hanzo Flow', shortName: 'Flow', tagline: 'Visual AI/LLM workflow builder', description: 'Build sophisticated AI/LLM pipelines visually.', category: 'async', icon: 'Workflow', href: '/products/async/flow', features: ['Visual builder', 'Multi-model support', 'RAG workflows'], status: 'beta' },
  { id: 'tasks', name: 'Hanzo Tasks', shortName: 'Tasks', tagline: 'Durable workflow execution', description: 'Run long-running tasks with guaranteed delivery.', category: 'async', icon: 'ListTodo', href: '/products/async/tasks', features: ['Guaranteed delivery', 'Retries', 'Exactly-once'], status: 'ga' },
  // ML
  { id: 'zen', name: 'Zen Models', shortName: 'Zen', tagline: 'Hypermodal AI model family', description: 'Complete foundation model ecosystem from edge to cloud.', category: 'ml', subcategory: 'Models', icon: 'Sparkles', href: '/products/ml/zen', features: ['Language', 'Vision', '3D Generation'], status: 'ga' },
  { id: 'notebooks', name: 'Hanzo Notebooks', shortName: 'Notebooks', tagline: 'Managed Jupyter workspaces', description: 'Interactive development environments with GPU support.', category: 'ml', subcategory: 'Develop', icon: 'BookOpen', href: '/products/ml/notebooks', features: ['JupyterLab', 'GPU support', 'Real-time collaboration'], status: 'ga' },
  { id: 'serving', name: 'Hanzo Serving', shortName: 'Serving', tagline: 'Production model inference', description: 'Deploy models to production with KServe.', category: 'ml', subcategory: 'Serve', icon: 'Rocket', href: '/products/ml/serving', features: ['Auto-scaling', 'Canary deployments', 'A/B testing'], status: 'ga' },
  // Observability
  { id: 'metrics', name: 'Hanzo Metrics', shortName: 'Metrics', tagline: 'Time-series metrics database', description: 'High-performance metrics storage and querying.', category: 'observability', icon: 'LineChart', href: '/products/observability/metrics', features: ['PromQL', 'High cardinality', 'Alerting'], status: 'ga' },
  { id: 'logs', name: 'Hanzo Logs', shortName: 'Logs', tagline: 'Scalable log aggregation', description: 'Collect, store, and query logs at scale.', category: 'observability', icon: 'ScrollText', href: '/products/observability/logs', features: ['Full-text search', 'Structured logs', 'Live tail'], status: 'ga' },
  { id: 'traces', name: 'Hanzo Traces', shortName: 'Traces', tagline: 'Distributed tracing', description: 'End-to-end request tracing for distributed systems.', category: 'observability', icon: 'Route', href: '/products/observability/traces', features: ['Distributed tracing', 'Service maps', 'AI-aware'], status: 'ga' },
  // Platform
  { id: 'platform', name: 'Hanzo Platform', shortName: 'Platform', tagline: 'PaaS framework & runtime', description: 'Deploy and manage applications with zero DevOps.', category: 'platform', icon: 'Layers', href: '/products/platform/platform', features: ['Git deploy', 'Auto TLS', 'Rollbacks'], status: 'ga' },
  { id: 'edge', name: 'Hanzo Edge', shortName: 'Edge', tagline: 'High-performance API edge', description: 'Ultra-high performance API gateway and edge proxy.', category: 'platform', icon: 'Zap', href: '/products/platform/edge', features: ['Sub-ms latency', 'Rate limiting', 'JWT validation'], status: 'ga' },
  { id: 'iam', name: 'Hanzo IAM', shortName: 'IAM', tagline: 'Identity & access management', description: 'Authentication and authorization for your apps.', category: 'platform', icon: 'UserCheck', href: '/products/platform/iam', features: ['SSO', 'MFA', 'RBAC'], status: 'ga' },
  // Apps
  { id: 'base', name: 'Hanzo Base', shortName: 'Base', tagline: 'Backend-as-a-Service', description: 'Build apps without backend code.', category: 'apps', icon: 'Boxes', href: '/products/apps/base', features: ['Database', 'Auth', 'Realtime'], status: 'ga' },
  { id: 'agent', name: 'Hanzo Agent', shortName: 'Agent', tagline: 'Multi-agent orchestration SDK', description: 'Build and orchestrate AI agents.', category: 'apps', icon: 'Bot', href: '/products/apps/agent', features: ['Multi-agent', 'Tool use', 'Memory systems'], status: 'ga' },
  { id: 'mcp', name: 'Hanzo MCP', shortName: 'MCP', tagline: 'Model Context Protocol tools', description: 'Unified MCP server with 260+ tools.', category: 'apps', icon: 'Sparkles', href: '/products/apps/mcp', features: ['260+ tools', 'Browser automation', 'Code analysis'], status: 'ga' },
  // Growth
  { id: 'insights', name: 'Hanzo Insights', shortName: 'Insights', tagline: 'Product analytics platform', description: 'Understand user behavior with product analytics.', category: 'growth', icon: 'PieChart', href: '/products/growth/insights', features: ['Event tracking', 'Funnels', 'Session replay'], status: 'ga' },
  { id: 'experiments', name: 'Hanzo Experiments', shortName: 'Experiments', tagline: 'Feature flags & A/B testing', description: 'Ship features safely with feature flags.', category: 'growth', icon: 'SlidersHorizontal', href: '/products/growth/experiments', features: ['Feature flags', 'A/B testing', 'Gradual rollouts'], status: 'ga' },
  // CX
  { id: 'cx-suite', name: 'Hanzo CX', shortName: 'CX', tagline: 'Complete customer experience suite', description: 'Your complete customer experience platform.', category: 'cx', icon: 'MessageSquare', href: '/products/cx/suite', features: ['Unified inbox', 'Omnichannel', 'AI responses'], status: 'ga' },
  { id: 'crm', name: 'Hanzo CRM', shortName: 'CRM', tagline: 'Modern customer relationship management', description: 'Open source CRM built for modern teams.', category: 'cx', icon: 'UserCheck', href: '/products/cx/crm', features: ['Contact management', 'Deal pipelines', 'Automation'], status: 'ga' },
];

// =============================================================================
// ICON MAP
// =============================================================================

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  Database,
  Cpu,
  Clock,
  Brain,
  Activity,
  Layers,
  LayoutGrid,
  TrendingUp,
  Headphones,
};

// =============================================================================
// STATIC PARAMS
// =============================================================================

export async function generateStaticParams() {
  return categories.map((category) => ({
    categoryId: category.id,
  }));
}

// =============================================================================
// METADATA
// =============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}): Promise<Metadata> {
  const { categoryId } = await params;
  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    return { title: 'Not Found | Hanzo AI' };
  }

  return {
    title: `${category.name} Products`,
    description: category.description,
  };
}

// =============================================================================
// COMPONENTS
// =============================================================================

function StatusBadge({ status }: { status: Product['status'] }) {
  const variants = {
    ga: 'bg-green-500/20 text-green-400 border-green-500/30',
    beta: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    alpha: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    coming: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
  };
  const labels = { ga: 'GA', beta: 'Beta', alpha: 'Alpha', coming: 'Coming Soon' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${variants[status]}`}>
      {labels[status]}
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={product.href}>
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-neutral-600 transition-all duration-300 h-full group cursor-pointer hover:bg-neutral-900/80">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
            <Database className="h-5 w-5 text-white" />
          </div>
          <StatusBadge status={product.status} />
        </div>

        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-white transition-colors flex items-center gap-2">
          {product.shortName}
          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>

        <p className="text-neutral-400 text-sm mb-3">{product.tagline}</p>

        <p className="text-sm text-neutral-500 line-clamp-2 mb-4">{product.description}</p>

        <div className="flex flex-wrap gap-2">
          {product.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-neutral-800/50 border border-neutral-700 text-neutral-400"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

// =============================================================================
// PAGE
// =============================================================================

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  const products = allProducts.filter((p) => p.category === categoryId);
  const CategoryIcon = iconComponents[category.icon] || Database;

  // Group by subcategory for ML
  const subcategories = categoryId === 'ml'
    ? [...new Set(products.map((p) => p.subcategory).filter(Boolean))] as string[]
    : null;

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 to-black" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 600px 300px at 50% 0%, rgba(253, 68, 68, 0.1) 0%, transparent 70%)',
          }}
        />

        <div className="container mx-auto relative z-10 max-w-6xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <CategoryIcon className="h-10 w-10 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4">Hanzo {category.name}</h1>

            <p className="text-xl md:text-2xl text-neutral-400 mb-6">{category.tagline}</p>

            <p className="text-lg text-neutral-500 max-w-3xl mx-auto mb-10">{category.description}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://app.hanzo.ai"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-black bg-white rounded-full hover:bg-neutral-200 transition-colors"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="https://docs.hanzo.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white border border-neutral-700 rounded-full hover:bg-neutral-900 transition-colors"
              >
                View Documentation
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-6 border-t border-neutral-800">
        <div className="container mx-auto max-w-6xl">
          {subcategories ? (
            subcategories.map((subcategory) => {
              const subProducts = products.filter((p) => p.subcategory === subcategory);
              if (subProducts.length === 0) return null;

              return (
                <div key={subcategory} className="mb-16 last:mb-0">
                  <h2 className="text-2xl font-bold mb-2">{subcategory}</h2>
                  <p className="text-neutral-500 mb-8">
                    {subcategory === 'Models' && 'Foundation models for language, vision, audio, video, and 3D generation'}
                    {subcategory === 'Develop' && 'Interactive environments for experimentation and iteration'}
                    {subcategory === 'Serve' && 'Production inference and rollout'}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-16 px-6 border-t border-neutral-800 bg-neutral-900/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
          <p className="text-neutral-400 mb-8">
            Install the Hanzo CLI to get started with any {category.name} product
          </p>

          <div className="bg-black rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between font-mono text-sm">
              <code className="text-green-400">curl -fsSL hanzo.sh/install.sh | sh</code>
              <button className="text-neutral-400 hover:text-white px-3 py-1 rounded transition-colors">
                Copy
              </button>
            </div>
          </div>

          <p className="text-neutral-500 mt-6 text-sm">
            Then run <code className="bg-neutral-800 px-2 py-1 rounded">hanzo --help</code> to see available commands
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-neutral-800">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Build with Hanzo {category.name}</h2>
          <p className="text-lg text-neutral-400 mb-10">
            Open source, self-hostable, and available on Hanzo Cloud.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://app.hanzo.ai"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-black bg-white rounded-full hover:bg-neutral-200 transition-colors"
            >
              Start Building
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white border border-neutral-700 rounded-full hover:bg-neutral-900 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
