import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Github,
  BookOpen,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Database,
  Cpu,
  Brain,
  Sparkles,
  Zap,
  Bot,
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
  github: string;
  docs?: string;
  install?: {
    cli?: string;
    docker?: string;
    npm?: string;
    pip?: string;
  };
  features: string[];
  status: 'ga' | 'beta' | 'alpha' | 'coming';
  openSource: boolean;
  pricing?: 'free' | 'freemium' | 'paid';
}

// =============================================================================
// DATA
// =============================================================================

const allProducts: Product[] = [
  // Data
  {
    id: 'sql',
    name: 'Hanzo SQL',
    shortName: 'SQL',
    tagline: 'Managed PostgreSQL',
    description: 'Production-ready PostgreSQL with automatic backups, scaling, and high availability. The database developers trust.',
    category: 'data',
    icon: 'Database',
    href: '/products/data/sql',
    github: 'https://github.com/hanzoai/postgres',
    docs: 'https://docs.hanzo.ai/sql',
    install: { cli: 'hanzo db create --type postgres', docker: 'docker run -d hanzo/postgres' },
    features: ['Automatic backups', 'Point-in-time recovery', 'Read replicas', 'Connection pooling', 'Extensions support'],
    status: 'ga',
    openSource: true,
    pricing: 'freemium',
  },
  {
    id: 'vector',
    name: 'Hanzo Vector',
    shortName: 'Vector',
    tagline: 'High-performance vector database',
    description: 'Purpose-built vector database optimized for AI embeddings. Lightning-fast similarity search at any scale.',
    category: 'data',
    icon: 'Sparkles',
    href: '/products/data/vector',
    github: 'https://github.com/hanzoai/vector',
    docs: 'https://docs.hanzo.ai/vector',
    install: { cli: 'hanzo db create --type vector', docker: 'docker run -d hanzo/vector' },
    features: ['HNSW indexing', 'Filtered search', 'Payload storage', 'Quantization', 'Distributed mode'],
    status: 'ga',
    openSource: true,
    pricing: 'freemium',
  },
  {
    id: 'kv',
    name: 'Hanzo KV',
    shortName: 'KV',
    tagline: 'Redis-compatible key-value',
    description: 'Ultra-fast key-value store with Redis compatibility. Sub-millisecond latency for caching and session storage.',
    category: 'data',
    icon: 'Key',
    href: '/products/data/kv',
    github: 'https://github.com/hanzoai/kv',
    docs: 'https://docs.hanzo.ai/kv',
    install: { cli: 'hanzo db create --type kv', docker: 'docker run -d hanzo/kv' },
    features: ['Redis compatible', 'Sub-ms latency', 'Pub/sub', 'Lua scripting', 'Cluster mode'],
    status: 'ga',
    openSource: true,
    pricing: 'freemium',
  },
  {
    id: 'storage',
    name: 'Hanzo Storage',
    shortName: 'Storage',
    tagline: 'S3-compatible object storage',
    description: 'Store files, models, and assets with S3-compatible APIs. Infinite scale, pay for what you use.',
    category: 'data',
    icon: 'HardDrive',
    href: '/products/data/storage',
    github: 'https://github.com/hanzoai/storage',
    docs: 'https://docs.hanzo.ai/storage',
    install: { cli: 'hanzo storage create mybucket' },
    features: ['S3 compatible', 'Versioning', 'Lifecycle policies', 'CDN integration', 'Presigned URLs'],
    status: 'ga',
    openSource: true,
    pricing: 'freemium',
  },
  {
    id: 'search',
    name: 'Hanzo Search',
    shortName: 'Search',
    tagline: 'Lightning-fast full-text search',
    description: 'Instant search experiences with typo tolerance. Relevant results in milliseconds with minimal configuration.',
    category: 'data',
    icon: 'Search',
    href: '/products/data/search',
    github: 'https://github.com/hanzoai/search',
    docs: 'https://docs.hanzo.ai/search',
    install: { cli: 'hanzo search create myindex', docker: 'docker run -d hanzo/search' },
    features: ['Typo tolerance', 'Faceted search', 'Filters', 'Synonyms', 'Instant results'],
    status: 'ga',
    openSource: true,
    pricing: 'freemium',
  },
  // Compute
  {
    id: 'functions',
    name: 'Hanzo Functions',
    shortName: 'Functions',
    tagline: 'Serverless compute platform',
    description: 'Deploy functions in any language. Auto-scaling, pay-per-execution, zero cold starts with edge deployment.',
    category: 'compute',
    icon: 'Zap',
    href: '/products/compute/functions',
    github: 'https://github.com/hanzoai/functions',
    docs: 'https://docs.hanzo.ai/functions',
    install: { cli: 'hanzo functions deploy ./my-function' },
    features: ['Any language', 'Auto-scaling', 'Edge deployment', 'Event triggers', 'Zero cold starts'],
    status: 'ga',
    openSource: true,
    pricing: 'freemium',
  },
  {
    id: 'machines',
    name: 'Hanzo Machines',
    shortName: 'Machines',
    tagline: 'Dedicated AI compute',
    description: 'GPU instances for training and inference. From A10G to H100, with spot pricing and preemption.',
    category: 'compute',
    icon: 'Cpu',
    href: '/products/compute/machines',
    github: 'https://github.com/hanzoai/machines',
    docs: 'https://docs.hanzo.ai/machines',
    features: ['GPU instances', 'Spot pricing', 'Auto-scaling', 'Persistent storage', 'SSH access'],
    status: 'ga',
    openSource: false,
    pricing: 'paid',
  },
  {
    id: 'gateway',
    name: 'Hanzo Gateway',
    shortName: 'Gateway',
    tagline: 'Unified AI inference proxy',
    description: 'Route to 100+ LLM providers through a single API. Load balancing, fallbacks, caching, and cost optimization.',
    category: 'compute',
    icon: 'Zap',
    href: '/products/compute/gateway',
    github: 'https://github.com/hanzoai/gateway',
    docs: 'https://docs.hanzo.ai/gateway',
    features: ['100+ providers', 'Load balancing', 'Fallbacks', 'Response caching', 'Cost tracking'],
    status: 'ga',
    openSource: true,
    pricing: 'freemium',
  },
  // ML
  {
    id: 'zen',
    name: 'Zen Models',
    shortName: 'Zen',
    tagline: 'Hypermodal AI model family',
    description: 'Complete foundation model ecosystem from edge to cloud. Language, vision, 3D, video, and audio generation in a unified family.',
    category: 'ml',
    subcategory: 'Models',
    icon: 'Sparkles',
    href: '/products/ml/zen',
    github: 'https://github.com/zenlm',
    docs: 'https://docs.hanzo.ai/zen',
    features: ['Language (0.6B-30B)', 'Vision-Language', '3D Generation', 'Video Generation', 'Audio/Music', 'Edge Optimized', 'MCP Support', 'Apache 2.0'],
    status: 'ga',
    openSource: true,
    pricing: 'free',
  },
  {
    id: 'notebooks',
    name: 'Hanzo Notebooks',
    shortName: 'Notebooks',
    tagline: 'Managed Jupyter workspaces',
    description: 'Interactive development environments with GPU support. Collaborate in real-time, version everything.',
    category: 'ml',
    subcategory: 'Develop',
    icon: 'BookOpen',
    href: '/products/ml/notebooks',
    github: 'https://github.com/hanzoai/notebooks',
    docs: 'https://docs.hanzo.ai/notebooks',
    features: ['JupyterLab', 'GPU support', 'Real-time collaboration', 'Git integration', 'Custom environments'],
    status: 'ga',
    openSource: true,
    pricing: 'freemium',
  },
  {
    id: 'serving',
    name: 'Hanzo Serving',
    shortName: 'Serving',
    tagline: 'Production model inference',
    description: 'Deploy models to production with KServe. Auto-scaling, canary deployments, A/B testing.',
    category: 'ml',
    subcategory: 'Serve',
    icon: 'Rocket',
    href: '/products/ml/serving',
    github: 'https://github.com/hanzoai/serving',
    docs: 'https://docs.hanzo.ai/serving',
    features: ['Auto-scaling', 'Canary deployments', 'A/B testing', 'GPU inference', 'Batching'],
    status: 'ga',
    openSource: true,
    pricing: 'freemium',
  },
  // Apps
  {
    id: 'base',
    name: 'Hanzo Base',
    shortName: 'Base',
    tagline: 'Backend-as-a-Service',
    description: 'Build apps without backend code. Database, auth, storage, and realtime out of the box.',
    category: 'apps',
    icon: 'Boxes',
    href: '/products/apps/base',
    github: 'https://github.com/hanzoai/base',
    docs: 'https://docs.hanzo.ai/base',
    features: ['Database', 'Auth', 'Storage', 'Realtime', 'Edge functions'],
    status: 'ga',
    openSource: true,
    pricing: 'freemium',
  },
  {
    id: 'agent',
    name: 'Hanzo Agent',
    shortName: 'Agent',
    tagline: 'Multi-agent orchestration SDK',
    description: 'Build and orchestrate AI agents with built-in tools, memory, and planning. OpenAI Agents SDK compatible.',
    category: 'apps',
    icon: 'Bot',
    href: '/products/apps/agent',
    github: 'https://github.com/hanzoai/agent',
    docs: 'https://docs.hanzo.ai/agent',
    install: { pip: 'pip install hanzo-agent', cli: 'hanzo agent create myagent' },
    features: ['Multi-agent', 'Tool use', 'Memory systems', 'Planning', 'Handoffs', 'Tracing', 'OpenAI compatible', 'MCP support'],
    status: 'ga',
    openSource: true,
    pricing: 'freemium',
  },
  {
    id: 'mcp',
    name: 'Hanzo MCP',
    shortName: 'MCP',
    tagline: 'Model Context Protocol tools',
    description: 'Unified MCP server with 260+ tools for AI development. Browser automation, file operations, code analysis, and more.',
    category: 'apps',
    icon: 'Sparkles',
    href: '/products/apps/mcp',
    github: 'https://github.com/hanzoai/mcp',
    docs: 'https://docs.hanzo.ai/mcp',
    install: { npm: 'npm install -g @hanzo/mcp', pip: 'pip install hanzo-mcp' },
    features: ['260+ tools', 'Browser automation', 'File operations', 'Code analysis', 'Memory', 'Computer use', 'Extensible', 'Multi-runtime'],
    status: 'ga',
    openSource: true,
    pricing: 'free',
  },
];

// =============================================================================
// STATIC PARAMS
// =============================================================================

export async function generateStaticParams() {
  return allProducts.map((product) => ({
    categoryId: product.category,
    productId: product.id,
  }));
}

// =============================================================================
// METADATA
// =============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string; productId: string }>;
}): Promise<Metadata> {
  const { productId } = await params;
  const product = allProducts.find((p) => p.id === productId);

  if (!product) {
    return { title: 'Not Found | Hanzo AI' };
  }

  return {
    title: product.name,
    description: product.description,
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

function PricingBadge({ pricing }: { pricing?: Product['pricing'] }) {
  if (!pricing) return null;

  const variants = {
    free: 'bg-green-500/20 text-green-400 border-green-500/30',
    freemium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    paid: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };
  const labels = { free: 'Free', freemium: 'Free Tier', paid: 'Paid' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${variants[pricing]}`}>
      {labels[pricing]}
    </span>
  );
}

function InstallTabs({ install }: { install: Product['install'] }) {
  if (!install) return null;

  const methods = Object.entries(install).filter(([, value]) => value);
  if (methods.length === 0) return null;

  return (
    <div className="bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden">
      {methods.map(([method, command], index) => (
        <div
          key={method}
          className={`p-4 font-mono text-sm ${index > 0 ? 'border-t border-neutral-800' : ''}`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-neutral-500 uppercase">{method}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">$</span>
            <code className="text-green-400">{command}</code>
          </div>
        </div>
      ))}
    </div>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  return (
    <Link href={product.href}>
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:border-[#fd4444]/50 transition-all duration-300 h-full group cursor-pointer hover:bg-neutral-900/80">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#fd4444]/30 transition-colors">
            <Database className="h-5 w-5 text-white" />
          </div>
          <StatusBadge status={product.status} />
        </div>

        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-white transition-colors flex items-center gap-2">
          {product.shortName}
          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#fd4444]" />
        </h3>

        <p className="text-neutral-400 text-sm">{product.tagline}</p>
      </div>
    </Link>
  );
}

// =============================================================================
// PAGE
// =============================================================================

export default async function ProductPage({
  params,
}: {
  params: Promise<{ categoryId: string; productId: string }>;
}) {
  const { categoryId, productId } = await params;
  const product = allProducts.find((p) => p.id === productId && p.category === categoryId);

  if (!product) {
    notFound();
  }

  // Get related products from same category
  const relatedProducts = allProducts
    .filter((p) => p.category === categoryId && p.id !== productId)
    .slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 600px 300px at 50% 0%, rgba(253, 68, 68, 0.15) 0%, transparent 70%)',
          }}
        />

        <div className="container mx-auto relative z-10 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Product Info */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <StatusBadge status={product.status} />
                {product.openSource && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Open Source
                  </span>
                )}
                <PricingBadge pricing={product.pricing} />
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                {product.name}
              </h1>

              {/* Tagline */}
              <p className="text-xl md:text-2xl text-[#fd4444] mb-4 font-medium">{product.tagline}</p>

              {/* Description */}
              <p className="text-lg text-neutral-400 mb-8 leading-relaxed">{product.description}</p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {product.docs && (
                  <a
                    href={product.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-[#fd4444] rounded-full hover:bg-[#fd4444]/90 transition-colors"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Documentation
                  </a>
                )}
                <a
                  href={product.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white border border-neutral-700 rounded-full hover:bg-neutral-900 transition-colors"
                >
                  <Github className="mr-2 h-5 w-5" />
                  View on GitHub
                </a>
              </div>
            </div>

            {/* Right: Install Commands */}
            <div className="hidden lg:block">
              {product.install && <InstallTabs install={product.install} />}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Install Commands */}
      {product.install && (
        <section className="lg:hidden px-6 pb-8">
          <div className="container mx-auto max-w-lg">
            <InstallTabs install={product.install} />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 px-6 border-t border-neutral-800 bg-gradient-to-b from-neutral-900/30 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Features</h2>
          <p className="text-neutral-500 text-center mb-10">Everything you need to get started</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.features.map((feature) => (
              <div
                key={feature}
                className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-4 hover:border-[#fd4444]/30 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <CheckCircle className="h-5 w-5 text-[#fd4444]" />
                  </div>
                  <span className="text-neutral-300 group-hover:text-white transition-colors">{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 px-6 border-t border-neutral-800">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Resources</h2>
          <p className="text-neutral-500 text-center mb-10">Learn more about {product.shortName}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href={product.github} target="_blank" rel="noopener noreferrer" className="group">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-[#fd4444]/50 transition-all duration-300 h-full">
                <div className="flex items-center gap-2 text-lg font-semibold mb-2">
                  <Github className="h-5 w-5" />
                  GitHub
                  <ExternalLink className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#fd4444]" />
                </div>
                <p className="text-neutral-400 text-sm">Source code, issues, and contributions</p>
              </div>
            </a>

            {product.docs && (
              <a href={product.docs} target="_blank" rel="noopener noreferrer" className="group">
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-[#fd4444]/50 transition-all duration-300 h-full">
                  <div className="flex items-center gap-2 text-lg font-semibold mb-2">
                    <BookOpen className="h-5 w-5" />
                    Documentation
                    <ExternalLink className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#fd4444]" />
                  </div>
                  <p className="text-neutral-400 text-sm">Guides, API reference, and examples</p>
                </div>
              </a>
            )}

            <Link href="/pricing" className="group">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-[#fd4444]/50 transition-all duration-300 h-full">
                <div className="flex items-center gap-2 text-lg font-semibold mb-2">
                  <Sparkles className="h-5 w-5" />
                  Pricing
                  <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#fd4444]" />
                </div>
                <p className="text-neutral-400 text-sm">
                  {product.pricing === 'free' ? 'Completely free to use' : 'Free tier available, scale as you grow'}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="py-16 px-6 border-t border-neutral-800 bg-gradient-to-t from-neutral-900/30 to-transparent">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Related Products</h2>
                <p className="text-neutral-500">More from Hanzo {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
              </div>
              <Link
                href={`/products/${product.category}`}
                className="text-[#fd4444] hover:text-[#fd4444]/80 text-sm font-medium flex items-center gap-1 group"
              >
                View all
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <RelatedProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-neutral-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#fd4444]/5 to-transparent" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to get started with <span className="text-[#fd4444]">{product.shortName}</span>?
          </h2>
          <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
            Deploy in minutes with Hanzo Cloud or self-host with our open-source release.
            {product.pricing === 'free' && " It's completely free."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://app.hanzo.ai"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-[#fd4444] rounded-full hover:bg-[#fd4444]/90 transition-colors"
            >
              Start Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white border border-neutral-700 rounded-full hover:bg-neutral-900 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
