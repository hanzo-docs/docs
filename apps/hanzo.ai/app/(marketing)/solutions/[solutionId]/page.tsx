import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Globe,
  Shield,
  Brain,
  Code,
  Rocket,
  Network,
  DollarSign,
  Building2,
  Plane,
  Car,
  Landmark,
  Factory,
  Laptop,
  ShoppingCart,
  Leaf,
  ArrowRight,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface Solution {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  icon: string;
  type: 'capability' | 'industry';
  features: string[];
  useCases: string[];
  products: { name: string; href: string }[];
}

// =============================================================================
// DATA
// =============================================================================

const solutions: Solution[] = [
  // Capabilities
  {
    id: 'cloud',
    name: 'Cloud',
    tagline: 'AI-native cloud infrastructure',
    description: 'Deploy and scale AI workloads on purpose-built cloud infrastructure.',
    longDescription: 'Hanzo Cloud provides a complete AI-native infrastructure platform. From GPU clusters to serverless functions, everything you need to build, deploy, and scale AI applications.',
    icon: 'Globe',
    type: 'capability',
    features: ['GPU compute at scale', 'Global edge network', 'Auto-scaling infrastructure', 'Cost optimization', 'Multi-region deployment', 'Hybrid cloud support'],
    useCases: ['AI model training', 'Inference at scale', 'Real-time AI applications', 'Global AI services'],
    products: [
      { name: 'Hanzo Machines', href: '/products/compute/machines' },
      { name: 'Hanzo Functions', href: '/products/compute/functions' },
      { name: 'Hanzo Edge', href: '/products/platform/edge' },
    ],
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    tagline: 'AI-powered security solutions',
    description: 'Protect your applications and data with intelligent security.',
    longDescription: 'Leverage AI to detect threats, prevent attacks, and secure your infrastructure. From identity management to LLM safety layers, comprehensive security for the AI era.',
    icon: 'Shield',
    type: 'capability',
    features: ['AI-powered threat detection', 'Zero-trust architecture', 'Identity & access management', 'LLM safety guardrails', 'Compliance automation', 'Secrets management'],
    useCases: ['Secure AI deployments', 'Enterprise security', 'Compliance requirements', 'Data protection'],
    products: [
      { name: 'Hanzo IAM', href: '/products/platform/iam' },
      { name: 'Hanzo Guard', href: '/products/platform/guard' },
      { name: 'Hanzo KMS', href: '/products/platform/kms' },
    ],
  },
  {
    id: 'data-ai',
    name: 'Data and AI',
    tagline: 'End-to-end AI/ML platform',
    description: 'From data to insights with integrated AI and ML tools.',
    longDescription: 'Build, train, and deploy AI models with a complete MLOps platform. Notebooks for experimentation, pipelines for automation, and serving for production.',
    icon: 'Brain',
    type: 'capability',
    features: ['Foundation models', 'MLOps automation', 'Vector databases', 'Feature stores', 'Model monitoring', 'Training infrastructure'],
    useCases: ['AI application development', 'ML model deployment', 'Data science workflows', 'AI-powered products'],
    products: [
      { name: 'Zen Models', href: '/products/ml/zen' },
      { name: 'Hanzo Vector', href: '/products/data/vector' },
      { name: 'Hanzo Agent', href: '/products/apps/agent' },
    ],
  },
  {
    id: 'engineering',
    name: 'Engineering',
    tagline: 'AI-augmented development',
    description: 'Build better software faster with AI assistance.',
    longDescription: 'Accelerate development with AI coding assistants, automated testing, and intelligent DevOps. From code generation to deployment, AI enhances every step.',
    icon: 'Code',
    type: 'capability',
    features: ['AI coding assistants', 'Automated code review', 'Intelligent testing', 'CI/CD optimization', 'Developer experience', 'Code generation'],
    useCases: ['Software development', 'DevOps automation', 'Code quality', 'Team productivity'],
    products: [
      { name: 'Hanzo MCP', href: '/products/apps/mcp' },
      { name: 'Hanzo Platform', href: '/products/platform/platform' },
      { name: 'Hanzo Functions', href: '/products/compute/functions' },
    ],
  },
  {
    id: 'emerging-tech',
    name: 'Emerging Tech',
    tagline: 'Next-generation technology',
    description: 'Stay ahead with cutting-edge AI capabilities.',
    longDescription: 'Explore the frontier of AI technology. From multimodal models to autonomous agents, access the latest innovations in artificial intelligence.',
    icon: 'Rocket',
    type: 'capability',
    features: ['Multimodal AI', 'Autonomous agents', 'Computer use', 'Generative AI', 'Edge AI', 'Real-time AI'],
    useCases: ['Innovation labs', 'R&D projects', 'Proof of concepts', 'Competitive advantage'],
    products: [
      { name: 'Zen Models', href: '/products/ml/zen' },
      { name: 'Hanzo Operative', href: '/products/apps/operative' },
      { name: 'Hanzo Agent', href: '/products/apps/agent' },
    ],
  },
  {
    id: 'partners',
    name: 'Partners',
    tagline: 'Ecosystem partnerships',
    description: 'Build together with our partner network.',
    longDescription: 'Join our partner ecosystem to extend your offerings with AI capabilities. Integration partners, resellers, and technology alliances.',
    icon: 'Network',
    type: 'capability',
    features: ['Technology integrations', 'Reseller programs', 'Co-development', 'White-label solutions', 'Partner APIs', 'Revenue sharing'],
    useCases: ['System integrators', 'Technology vendors', 'Consultancies', 'ISVs'],
    products: [
      { name: 'Hanzo Gateway', href: '/products/compute/gateway' },
      { name: 'Hanzo Base', href: '/products/apps/base' },
      { name: 'Hanzo Platform', href: '/products/platform/platform' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    tagline: 'AI for financial services',
    description: 'Transform financial operations with intelligent automation.',
    longDescription: 'AI solutions designed for the unique requirements of financial services. From fraud detection to algorithmic trading, secure and compliant AI.',
    icon: 'DollarSign',
    type: 'capability',
    features: ['Fraud detection', 'Risk assessment', 'Algorithmic trading', 'Compliance automation', 'Document processing', 'Customer insights'],
    useCases: ['Banking AI', 'Trading platforms', 'Risk management', 'RegTech'],
    products: [
      { name: 'Hanzo Agent', href: '/products/apps/agent' },
      { name: 'Hanzo Analytics', href: '/products/apps/analytics' },
      { name: 'Hanzo Guard', href: '/products/platform/guard' },
    ],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    tagline: 'Enterprise-grade foundations',
    description: 'Reliable infrastructure for mission-critical AI.',
    longDescription: 'Build on enterprise-grade infrastructure designed for AI workloads. High availability, disaster recovery, and global scale.',
    icon: 'Building2',
    type: 'capability',
    features: ['High availability', 'Disaster recovery', 'Global scale', 'Enterprise SLAs', 'Hybrid deployment', 'Infrastructure as code'],
    useCases: ['Enterprise AI', 'Critical workloads', 'Global deployments', 'Regulated industries'],
    products: [
      { name: 'Hanzo HKE', href: '/products/platform/hke' },
      { name: 'Hanzo Networking', href: '/products/platform/networking' },
      { name: 'Hanzo Platform', href: '/products/platform/platform' },
    ],
  },
  // Industries
  {
    id: 'aerospace',
    name: 'Aerospace & Defense',
    tagline: 'AI for aerospace and defense',
    description: 'Secure, reliable AI for aerospace and defense applications.',
    longDescription: 'Mission-critical AI solutions for aerospace and defense. Secure infrastructure, compliance-ready, and built for extreme reliability.',
    icon: 'Plane',
    type: 'industry',
    features: ['Secure infrastructure', 'Air-gapped deployment', 'FedRAMP ready', 'Real-time systems', 'Predictive maintenance', 'Autonomous systems'],
    useCases: ['Defense systems', 'Satellite operations', 'Aircraft maintenance', 'Logistics optimization'],
    products: [
      { name: 'Hanzo Machines', href: '/products/compute/machines' },
      { name: 'Hanzo Serving', href: '/products/ml/serving' },
      { name: 'Hanzo IAM', href: '/products/platform/iam' },
    ],
  },
  {
    id: 'automotive',
    name: 'Automotive',
    tagline: 'AI for automotive innovation',
    description: 'Drive automotive innovation with AI.',
    longDescription: 'From autonomous driving to smart manufacturing, AI solutions for the automotive industry. Edge computing, real-time inference, and simulation.',
    icon: 'Car',
    type: 'industry',
    features: ['Autonomous driving AI', 'Predictive maintenance', 'Supply chain optimization', 'Manufacturing automation', 'Customer experience', 'Connected vehicles'],
    useCases: ['ADAS development', 'Factory automation', 'Fleet management', 'Customer analytics'],
    products: [
      { name: 'Zen Models', href: '/products/ml/zen' },
      { name: 'Hanzo Edge', href: '/products/platform/edge' },
      { name: 'Hanzo Serving', href: '/products/ml/serving' },
    ],
  },
  {
    id: 'banking',
    name: 'Banking',
    tagline: 'AI for modern banking',
    description: 'Transform banking with intelligent automation.',
    longDescription: 'AI solutions built for banking requirements. Fraud prevention, customer service automation, and regulatory compliance.',
    icon: 'Landmark',
    type: 'industry',
    features: ['Fraud detection', 'KYC automation', 'Credit scoring', 'Chatbot assistants', 'Document processing', 'Regulatory compliance'],
    useCases: ['Retail banking', 'Commercial banking', 'Wealth management', 'Payment processing'],
    products: [
      { name: 'Hanzo Agent', href: '/products/apps/agent' },
      { name: 'Hanzo Guard', href: '/products/platform/guard' },
      { name: 'Hanzo CX', href: '/products/cx/suite' },
    ],
  },
  {
    id: 'capital-markets',
    name: 'Capital Markets',
    tagline: 'AI for capital markets',
    description: 'Gain an edge with AI-powered trading and analysis.',
    longDescription: 'Low-latency AI for capital markets. Algorithmic trading, market analysis, and risk management with enterprise-grade infrastructure.',
    icon: 'Globe',
    type: 'industry',
    features: ['Low-latency inference', 'Market analysis', 'Risk modeling', 'Algorithmic trading', 'Sentiment analysis', 'Portfolio optimization'],
    useCases: ['Trading desks', 'Quantitative research', 'Risk management', 'Investment analysis'],
    products: [
      { name: 'Hanzo Gateway', href: '/products/compute/gateway' },
      { name: 'Hanzo Datastore', href: '/products/data/datastore' },
      { name: 'Hanzo Serving', href: '/products/ml/serving' },
    ],
  },
  {
    id: 'chemicals',
    name: 'Chemicals',
    tagline: 'AI for chemical industry',
    description: 'Optimize chemical manufacturing with AI.',
    longDescription: 'AI solutions for chemical manufacturing. Process optimization, safety monitoring, and R&D acceleration.',
    icon: 'Factory',
    type: 'industry',
    features: ['Process optimization', 'Safety monitoring', 'Quality control', 'R&D acceleration', 'Supply chain', 'Sustainability'],
    useCases: ['Manufacturing optimization', 'Laboratory automation', 'Safety compliance', 'Formulation development'],
    products: [
      { name: 'Hanzo Notebooks', href: '/products/ml/notebooks' },
      { name: 'Hanzo Metrics', href: '/products/observability/metrics' },
      { name: 'Hanzo Agent', href: '/products/apps/agent' },
    ],
  },
  {
    id: 'communications',
    name: 'Communications',
    tagline: 'AI for communications',
    description: 'Enhance communications with AI.',
    longDescription: 'AI solutions for telecommunications and media. Network optimization, content personalization, and customer experience.',
    icon: 'Laptop',
    type: 'industry',
    features: ['Network optimization', 'Content personalization', 'Customer churn prediction', 'Chatbot assistants', 'Fraud detection', '5G optimization'],
    useCases: ['Telecom operations', 'Media streaming', 'Customer service', 'Network planning'],
    products: [
      { name: 'Hanzo Edge', href: '/products/platform/edge' },
      { name: 'Hanzo CX', href: '/products/cx/suite' },
      { name: 'Hanzo Insights', href: '/products/growth/insights' },
    ],
  },
  {
    id: 'consumer',
    name: 'Consumer',
    tagline: 'AI for consumer businesses',
    description: 'Win consumers with personalized AI experiences.',
    longDescription: 'AI solutions for consumer-facing businesses. Personalization, recommendation engines, and customer engagement.',
    icon: 'ShoppingCart',
    type: 'industry',
    features: ['Personalization', 'Recommendation engines', 'Customer segmentation', 'Demand forecasting', 'Inventory optimization', 'Chatbot assistants'],
    useCases: ['E-commerce', 'Retail', 'Consumer goods', 'Hospitality'],
    products: [
      { name: 'Hanzo Commerce', href: '/products/apps/commerce' },
      { name: 'Hanzo Insights', href: '/products/growth/insights' },
      { name: 'Hanzo Agent', href: '/products/apps/agent' },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    tagline: 'AI for energy transition',
    description: 'Power the energy transition with AI.',
    longDescription: 'AI solutions for the energy industry. Grid optimization, renewable forecasting, and sustainability initiatives.',
    icon: 'Leaf',
    type: 'industry',
    features: ['Grid optimization', 'Renewable forecasting', 'Predictive maintenance', 'Energy trading', 'Sustainability analytics', 'Asset management'],
    useCases: ['Power generation', 'Grid operations', 'Oil & gas', 'Renewable energy'],
    products: [
      { name: 'Hanzo Metrics', href: '/products/observability/metrics' },
      { name: 'Hanzo Serving', href: '/products/ml/serving' },
      { name: 'Hanzo Datastore', href: '/products/data/datastore' },
    ],
  },
];

// =============================================================================
// ICON MAP
// =============================================================================

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Shield,
  Brain,
  Code,
  Rocket,
  Network,
  DollarSign,
  Building2,
  Plane,
  Car,
  Landmark,
  Factory,
  Laptop,
  ShoppingCart,
  Leaf,
};

// =============================================================================
// STATIC PARAMS
// =============================================================================

export async function generateStaticParams() {
  return solutions.map((solution) => ({
    solutionId: solution.id,
  }));
}

// =============================================================================
// METADATA
// =============================================================================

export async function generateMetadata({
  params,
}: {
  params: Promise<{ solutionId: string }>;
}): Promise<Metadata> {
  const { solutionId } = await params;
  const solution = solutions.find((s) => s.id === solutionId);

  if (!solution) {
    return { title: 'Not Found | Hanzo AI' };
  }

  return {
    title: `${solution.name} Solutions`,
    description: solution.description,
  };
}

// =============================================================================
// PAGE
// =============================================================================

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ solutionId: string }>;
}) {
  const { solutionId } = await params;
  const solution = solutions.find((s) => s.id === solutionId);

  if (!solution) {
    notFound();
  }

  const SolutionIcon = iconComponents[solution.icon] || Globe;

  // Get related solutions (same type)
  const relatedSolutions = solutions
    .filter((s) => s.type === solution.type && s.id !== solution.id)
    .slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 800px 400px at 50% 0%, rgba(253, 68, 68, 0.15) 0%, transparent 70%)',
          }}
        />

        <div className="container mx-auto relative z-10 max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 mb-8">
              <SolutionIcon className="h-4 w-4" />
              <span>{solution.type === 'capability' ? 'Capability' : 'Industry'}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">{solution.name}</span>
              <br />
              <span className="text-neutral-400">Solutions</span>
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-[#fd4444] mb-6 font-medium">{solution.tagline}</p>

            {/* Description */}
            <p className="text-lg text-neutral-400 mb-10 max-w-3xl mx-auto">{solution.longDescription}</p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://app.hanzo.ai"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-[#fd4444] rounded-full hover:bg-[#fd4444]/90 transition-colors"
              >
                Get Started
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 border-t border-neutral-800">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Key Capabilities</h2>
          <p className="text-neutral-500 text-center mb-10">What we offer for {solution.name.toLowerCase()}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {solution.features.map((feature) => (
              <div
                key={feature}
                className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 hover:border-[#fd4444]/30 transition-colors group"
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

      {/* Use Cases Section */}
      <section className="py-16 px-6 border-t border-neutral-800 bg-gradient-to-b from-neutral-900/30 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Use Cases</h2>
          <p className="text-neutral-500 text-center mb-10">How organizations use Hanzo for {solution.name.toLowerCase()}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solution.useCases.map((useCase) => (
              <div
                key={useCase}
                className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 text-center hover:border-neutral-600 transition-colors"
              >
                <p className="text-white font-medium">{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Products Section */}
      <section className="py-16 px-6 border-t border-neutral-800">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Recommended Products</h2>
          <p className="text-neutral-500 text-center mb-10">Products that power {solution.name.toLowerCase()} solutions</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {solution.products.map((product) => (
              <Link key={product.name} href={product.href} className="group">
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-[#fd4444]/50 transition-all duration-300 h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#fd4444] transition-colors">
                      {product.name}
                    </h3>
                    <ArrowRight className="h-5 w-5 text-neutral-500 group-hover:text-[#fd4444] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Related Solutions Section */}
      {relatedSolutions.length > 0 && (
        <section className="py-16 px-6 border-t border-neutral-800 bg-gradient-to-t from-neutral-900/30 to-transparent">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Related Solutions</h2>
            <p className="text-neutral-500 text-center mb-10">Explore more {solution.type === 'capability' ? 'capabilities' : 'industries'}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedSolutions.map((related) => {
                const RelatedIcon = iconComponents[related.icon] || Globe;
                return (
                  <Link key={related.id} href={`/solutions/${related.id}`} className="group">
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 hover:border-[#fd4444]/50 transition-all duration-300 h-full">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#fd4444]/30 transition-colors">
                          <RelatedIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#fd4444] transition-colors">
                            {related.name}
                          </h3>
                          <p className="text-neutral-400 text-sm">{related.tagline}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-neutral-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#fd4444]/5 to-transparent" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to transform your <span className="text-[#fd4444]">{solution.name.toLowerCase()}</span> with AI?
          </h2>
          <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
            Get started with Hanzo today. Our team is ready to help you build the future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://app.hanzo.ai"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-[#fd4444] rounded-full hover:bg-[#fd4444]/90 transition-colors"
            >
              Start Building
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white border border-neutral-700 rounded-full hover:bg-neutral-900 transition-colors"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
