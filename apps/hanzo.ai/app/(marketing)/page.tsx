import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hanzo - Frontier AI for Developers',
  description: 'Build with next-generation AI models. Deploy anywhere with our open-source platform or scale instantly on our AI cloud infrastructure.',
};

// Hero Section
function HeroSection() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 px-6">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 800px 400px at 50% 0%, rgba(253, 68, 68, 0.15) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 mb-8">
            <span className="h-2 w-2 rounded-full bg-[#fd4444]" />
            <span>Unified AI Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-white">Build the Future</span>
            <br />
            <span className="text-neutral-400">with Frontier AI</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
            Access 100+ AI models through a unified gateway. Deploy AI agents, build intelligent applications, and scale with our cloud infrastructure.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://app.hanzo.ai"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-black bg-white rounded-full hover:bg-neutral-200 transition-colors"
            >
              Start Building Free
            </a>
            <a
              href="/docs"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white border border-neutral-700 rounded-full hover:bg-neutral-900 transition-colors"
            >
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      title: 'LLM Gateway',
      description: 'Unified API for 100+ models from OpenAI, Anthropic, Google, Meta, and more.',
      icon: '🔌',
    },
    {
      title: 'AI Agents',
      description: 'Build and deploy autonomous AI agents with memory, tools, and planning.',
      icon: '🤖',
    },
    {
      title: 'Desktop App',
      description: 'Native desktop application for developers with MCP integration.',
      icon: '💻',
    },
    {
      title: 'AI Cloud',
      description: 'Scalable infrastructure for AI workloads with GPU acceleration.',
      icon: '☁️',
    },
  ];

  return (
    <section className="py-24 px-6 border-t border-neutral-800">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need to Build AI
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            A complete platform for developing, deploying, and scaling AI applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-neutral-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#fd4444]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build with AI?
          </h2>
          <p className="text-neutral-400 text-lg mb-10">
            Join thousands of developers building the future with Hanzo AI. Get started for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://app.hanzo.ai/signup"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-black bg-white rounded-full hover:bg-neutral-200 transition-colors"
            >
              Create Free Account
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white border border-neutral-700 rounded-full hover:bg-neutral-900 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </>
  );
}
