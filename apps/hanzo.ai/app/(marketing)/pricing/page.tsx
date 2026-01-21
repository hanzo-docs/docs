import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for teams of all sizes.',
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For individuals and small projects',
    features: [
      '1,000 API calls/month',
      'Access to GPT-4, Claude, Gemini',
      'Community support',
      'Basic analytics',
    ],
    cta: 'Start Free',
    href: 'https://app.hanzo.ai/signup',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For developers and growing teams',
    features: [
      '50,000 API calls/month',
      'All AI models',
      'Priority support',
      'Advanced analytics',
      'Custom rate limits',
      'Team collaboration',
    ],
    cta: 'Start Pro Trial',
    href: 'https://app.hanzo.ai/signup?plan=pro',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited API calls',
      'Dedicated infrastructure',
      'SLA guarantee',
      '24/7 support',
      'Custom integrations',
      'On-premise deployment',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="py-24 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 mb-8">
            <span className="h-2 w-2 rounded-full bg-[#fd4444]" />
            <span>Pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative p-8 rounded-2xl ${
                plan.featured
                  ? 'bg-neutral-900 border-2 border-[#fd4444]'
                  : 'bg-neutral-900/50 border border-neutral-800'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#fd4444] text-white text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-neutral-400">{plan.period}</span>}
                </div>
                <p className="text-neutral-400 mt-2">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-neutral-300">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                className={`block w-full text-center py-3 rounded-full font-medium transition-colors ${
                  plan.featured
                    ? 'bg-white text-black hover:bg-neutral-200'
                    : 'border border-neutral-700 text-white hover:bg-neutral-800'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
