import Link from 'next/link';
import { cn } from '@/lib/cn';
import {
  CheckIcon, ArrowRightIcon, MessageCircleIcon,
  DownloadIcon, SparklesIcon,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Hanzo Bot pricing — Free locally, $5/mo in the cloud. Full-blown computer-using AI agent in a box.',
};

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Run on your own hardware. Full power, no limits.',
    cta: 'Download Free',
    ctaHref: '/#quickstart',
    features: [
      'Runs on Mac, Windows, Linux',
      'Bring your own API keys (OpenAI, Anthropic, etc.)',
      'All chat integrations (WhatsApp, Telegram, Discord, Slack, Signal, iMessage)',
      'Full system access (files, terminal, browser)',
      'Persistent memory & context',
      'Community skills & plugins',
      'Open source — inspect every line',
    ],
  },
  {
    name: 'Cloud',
    price: '$5',
    period: '/mo per bot',
    desc: 'Always-on Linux VM in Hanzo Cloud. No hardware needed.',
    cta: 'Start Free Trial',
    ctaHref: 'https://app.hanzo.bot',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Full Linux desktop VM (Ubuntu)',
      '100+ AI models included via Hanzo LLM Gateway',
      'Always-on — never goes to sleep',
      'All chat integrations',
      'Persistent memory, files & storage',
      'Auto-updates & daily backups',
      'Web dashboard at app.hanzo.bot',
      'API access for automation',
    ],
  },
  {
    name: 'Cloud Pro',
    price: '$25',
    period: '/mo per bot',
    desc: 'Mac or Windows VM for native desktop apps.',
    cta: 'Get Started',
    ctaHref: 'https://app.hanzo.bot',
    features: [
      'macOS or Windows desktop VM',
      'Run native desktop apps (Xcode, Figma, etc.)',
      'Priority model access & faster inference',
      'Advanced browser automation (Playwright)',
      'Team collaboration & shared bots',
      'Priority support',
      'Custom skill development',
      'SSO & enterprise auth (Hanzo IAM)',
    ],
  },
];

const faqs = [
  {
    q: 'Is Hanzo Bot really free?',
    a: 'Yes. The self-hosted version is 100% free and open source. You bring your own API keys for LLM providers (OpenAI, Anthropic, etc.) and run it on your own Mac, Windows, or Linux machine. No limits, no trials, no credit card.',
  },
  {
    q: 'What does the $5/mo Cloud plan include?',
    a: 'A full Linux desktop VM running in Hanzo Cloud with access to 100+ AI models via the Hanzo LLM Gateway. Your bot is always on, backed up daily, and accessible from any device. All chat integrations are included.',
  },
  {
    q: 'Why is Cloud Pro $25/mo?',
    a: 'Cloud Pro runs a full macOS or Windows VM, which requires significantly more resources than a Linux container. You also get priority model access, faster inference, advanced browser automation, and team collaboration features.',
  },
  {
    q: 'Can I use my own API keys with Cloud plans?',
    a: 'Yes! Cloud plans include access to 100+ models, but you can also bring your own API keys if you prefer. Mix and match freely.',
  },
  {
    q: 'How does the free trial work?',
    a: 'Cloud plans include a 14-day free trial. No credit card required to start. Your bot and all its data persist after the trial — just add a payment method to continue.',
  },
  {
    q: 'Can I run multiple bots?',
    a: 'Absolutely. Each bot is an independent instance with its own memory, personality, and configuration. Pricing is per bot. Most people start with one and add more as they find new use cases.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Self-hosted bots keep all data on your machine. Cloud bots run in isolated VMs with encrypted storage. We never train on your data. Enterprise customers can use their own infrastructure.',
  },
  {
    q: 'Do you offer enterprise pricing?',
    a: 'Yes. For teams needing custom deployments, SLAs, dedicated infrastructure, or volume licensing, contact us at team@hanzo.ai.',
  },
];

export default function PricingPage() {
  return (
    <main className="relative z-[1] max-w-[860px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-10 overflow-hidden">
      <div className="stars" />
      <div className="nebula" />

      {/* Header */}
      <header className="text-center mb-12 animate-[fadeInUp_0.8s_ease-out]">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
          <span className="bg-gradient-to-br from-fd-foreground via-brand to-[#00e5cc] bg-[length:200%_200%] bg-clip-text text-transparent animate-[gradientShift_6s_ease_infinite]">
            Simple Pricing
          </span>
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-[600px] mx-auto">
          Get started free. Run locally forever, or deploy to Hanzo Cloud starting at $5/mo.
        </p>
      </header>

      {/* Pricing Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              'relative flex flex-col p-6 rounded-2xl border backdrop-blur-sm transition-all hover:-translate-y-1',
              tier.highlight
                ? 'border-brand bg-gradient-to-br from-[rgba(255,77,77,0.08)] to-[rgba(10,15,26,0.8)] shadow-[0_4px_24px_rgba(255,77,77,0.2)]'
                : 'border-fd-border bg-[rgba(10,15,26,0.6)]',
            )}
          >
            {tier.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-bold bg-brand text-white rounded-full whitespace-nowrap">
                {tier.badge}
              </span>
            )}
            <h2 className="text-xl font-bold text-fd-foreground mb-1">{tier.name}</h2>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-bold text-fd-foreground">{tier.price}</span>
              <span className="text-sm text-fd-muted-foreground">{tier.period}</span>
            </div>
            <p className="text-sm text-fd-muted-foreground mb-5">{tier.desc}</p>
            <ul className="flex flex-col gap-2.5 mb-6 flex-1">
              {tier.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2 text-sm text-fd-muted-foreground">
                  <CheckIcon className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                  {feat}
                </li>
              ))}
            </ul>
            <a
              href={tier.ctaHref}
              target={tier.ctaHref.startsWith('http') ? '_blank' : undefined}
              rel={tier.ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={cn(
                'inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold no-underline transition-all hover:-translate-y-0.5 text-center',
                tier.highlight
                  ? 'bg-gradient-to-br from-brand to-[#e03e3e] text-[#050810] hover:shadow-[0_8px_40px_rgba(255,77,77,0.45)] shadow-[0_4px_24px_rgba(255,77,77,0.3)]'
                  : 'bg-[rgba(255,255,255,0.05)] border border-fd-border text-fd-foreground hover:border-brand',
              )}
            >
              {tier.cta}
              <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        ))}
      </section>

      {/* Enterprise */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
        <div className="flex flex-col items-center gap-5 p-8 rounded-2xl border border-[rgba(0,229,204,0.3)] bg-gradient-to-br from-[rgba(0,229,204,0.05)] to-[rgba(10,15,26,0.8)] backdrop-blur-sm text-center">
          <SparklesIcon className="w-8 h-8 text-[#00e5cc]" />
          <h2 className="text-2xl font-bold text-fd-foreground">Enterprise</h2>
          <p className="text-fd-muted-foreground max-w-[500px]">
            Custom deployments, dedicated infrastructure, SLAs, volume licensing, and SSO.
            Built for teams that need full control.
          </p>
          <a
            href="mailto:team@hanzo.ai"
            className="inline-flex items-center gap-2 px-7 py-3 font-semibold text-[#050810] bg-gradient-to-br from-[#00e5cc] to-[#14b8a6] rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(0,229,204,0.35)]"
          >
            <MessageCircleIcon className="w-5 h-5" />
            Contact Sales
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
        <h2 className="text-2xl font-bold text-fd-foreground mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group p-5 rounded-xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:border-brand"
            >
              <summary className="text-sm font-semibold text-fd-foreground cursor-pointer list-none flex items-center justify-between gap-3">
                {faq.q}
                <span className="text-brand transition-transform group-open:rotate-45 text-lg shrink-0">+</span>
              </summary>
              <p className="mt-3 text-sm text-fd-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center mb-8">
        <Link
          href="/#quickstart"
          className="inline-flex items-center gap-2.5 px-9 py-4 text-lg font-semibold text-[#050810] bg-gradient-to-br from-brand to-[#e03e3e] rounded-2xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(255,77,77,0.45)] shadow-[0_4px_24px_rgba(255,77,77,0.3)]"
        >
          <DownloadIcon className="w-5 h-5" />
          Get Started Free
        </Link>
        <p className="mt-3 text-sm text-fd-muted-foreground">
          Free locally. $5/mo in the cloud. Cancel anytime.
        </p>
      </div>
    </main>
  );
}
