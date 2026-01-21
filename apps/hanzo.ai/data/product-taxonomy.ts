// Product Taxonomy - defines product structure and categories

export type ProductCategory = 'data' | 'compute' | 'ml' | 'observability' | 'platform' | 'async' | 'apps';

export type ProductStatus = 'ga' | 'beta' | 'alpha' | 'coming';

export type ProductPricing = 'free' | 'freemium' | 'paid';

export interface Product {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  subcategory?: string;
  icon: string;
  href: string;
  status: ProductStatus;
  openSource: boolean;
  pricing?: ProductPricing;
  github: string;
  docs?: string;
  features: string[];
  install?: {
    cli?: string;
    docker?: string;
    npm?: string;
    pip?: string;
  };
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  tagline: string;
  description: string;
  icon: string;
}

// Category definitions
export const categories: Record<ProductCategory, CategoryInfo> = {
  data: {
    id: 'data',
    name: 'Data',
    tagline: 'Databases and storage for AI workloads',
    description: 'High-performance databases optimized for AI and ML applications.',
    icon: 'Database',
  },
  compute: {
    id: 'compute',
    name: 'Compute',
    tagline: 'Serverless compute for AI inference',
    description: 'Run AI models and applications at scale with serverless infrastructure.',
    icon: 'Cpu',
  },
  ml: {
    id: 'ml',
    name: 'ML',
    tagline: 'Machine learning infrastructure',
    description: 'End-to-end ML platform for training, tuning, and deploying models.',
    icon: 'Brain',
  },
  observability: {
    id: 'observability',
    name: 'Observability',
    tagline: 'Monitor and debug AI systems',
    description: 'Full visibility into AI application performance and behavior.',
    icon: 'Activity',
  },
  platform: {
    id: 'platform',
    name: 'Platform',
    tagline: 'Developer platform and tools',
    description: 'Complete developer experience for building AI applications.',
    icon: 'Layers',
  },
  async: {
    id: 'async',
    name: 'Async',
    tagline: 'Background jobs and queues',
    description: 'Reliable async processing for AI workloads.',
    icon: 'Clock',
  },
  apps: {
    id: 'apps',
    name: 'Apps',
    tagline: 'Pre-built AI applications',
    description: 'Ready-to-use AI applications and interfaces.',
    icon: 'LayoutGrid',
  },
};

// Products database
export const products: Product[] = [
  // Data products
  {
    id: 'sql',
    name: 'Hanzo SQL',
    shortName: 'SQL',
    tagline: 'Serverless SQL database',
    description: 'PostgreSQL-compatible serverless database with automatic scaling.',
    category: 'data',
    icon: 'Database',
    href: '/products/sql',
    status: 'ga',
    openSource: true,
    pricing: 'freemium',
    github: 'https://github.com/hanzoai/sql',
    docs: 'https://docs.hanzo.ai/sql',
    features: ['Auto-scaling', 'PostgreSQL compatible', 'Branching', 'Instant restore'],
  },
  {
    id: 'vector',
    name: 'Hanzo Vector',
    shortName: 'Vector',
    tagline: 'Vector database for AI',
    description: 'Purpose-built vector database for semantic search and RAG.',
    category: 'data',
    icon: 'Search',
    href: '/products/vector',
    status: 'ga',
    openSource: true,
    pricing: 'freemium',
    github: 'https://github.com/hanzoai/vector',
    docs: 'https://docs.hanzo.ai/vector',
    features: ['Semantic search', 'RAG support', 'Hybrid search', 'Real-time indexing'],
  },
  // Compute products
  {
    id: 'gateway',
    name: 'Hanzo Gateway',
    shortName: 'Gateway',
    tagline: 'Unified AI gateway',
    description: 'Single API for 100+ AI providers with load balancing and caching.',
    category: 'compute',
    icon: 'Zap',
    href: '/products/gateway',
    status: 'ga',
    openSource: true,
    pricing: 'freemium',
    github: 'https://github.com/hanzoai/gateway',
    docs: 'https://docs.hanzo.ai/gateway',
    features: ['100+ providers', 'Load balancing', 'Caching', 'Rate limiting'],
    install: {
      cli: 'hanzo gateway start',
      docker: 'docker run hanzo/gateway',
    },
  },
  {
    id: 'functions',
    name: 'Hanzo Functions',
    shortName: 'Functions',
    tagline: 'Serverless functions',
    description: 'Deploy functions that scale to zero with instant cold starts.',
    category: 'compute',
    icon: 'Rocket',
    href: '/products/functions',
    status: 'ga',
    openSource: true,
    pricing: 'freemium',
    github: 'https://github.com/hanzoai/functions',
    docs: 'https://docs.hanzo.ai/functions',
    features: ['Scale to zero', 'Fast cold starts', 'Multi-runtime', 'Edge deployment'],
  },
  // Apps products
  {
    id: 'chat',
    name: 'Hanzo Chat',
    shortName: 'Chat',
    tagline: 'AI chat interface',
    description: 'Beautiful chat interface for AI interactions with MCP support.',
    category: 'apps',
    icon: 'MessageSquare',
    href: '/products/chat',
    status: 'ga',
    openSource: true,
    pricing: 'free',
    github: 'https://github.com/hanzoai/chat',
    docs: 'https://docs.hanzo.ai/chat',
    features: ['MCP integration', 'Multi-provider', 'Streaming', 'File attachments'],
  },
  {
    id: 'mcp',
    name: 'Hanzo MCP',
    shortName: 'MCP',
    tagline: 'Model Context Protocol tools',
    description: '260+ tools for AI models to interact with external systems.',
    category: 'apps',
    icon: 'Workflow',
    href: '/products/mcp',
    status: 'ga',
    openSource: true,
    pricing: 'free',
    github: 'https://github.com/hanzoai/mcp',
    docs: 'https://docs.hanzo.ai/mcp',
    features: ['260+ tools', 'Filesystem', 'Browser', 'Code execution'],
    install: {
      npm: 'npm install -g @hanzo/mcp',
    },
  },
  {
    id: 'agent',
    name: 'Hanzo Agent',
    shortName: 'Agent',
    tagline: 'Multi-agent SDK',
    description: 'Build and orchestrate AI agents with OpenAI-compatible API.',
    category: 'apps',
    icon: 'Bot',
    href: '/products/agent',
    status: 'beta',
    openSource: true,
    pricing: 'free',
    github: 'https://github.com/hanzoai/agent',
    docs: 'https://docs.hanzo.ai/agent',
    features: ['Multi-agent', 'Tool use', 'Memory', 'OpenAI compatible'],
    install: {
      pip: 'pip install hanzo-agent',
    },
  },
];

// Helper functions
export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter(p => p.category === category);
}

export function getCategoryInfo(category: ProductCategory): CategoryInfo {
  return categories[category];
}
