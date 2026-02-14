import Link from 'next/link';
import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import {
  HomeIcon, MessageCircleIcon, BrainIcon, GlobeIcon,
  TerminalIcon, PuzzleIcon, MonitorIcon, ShieldIcon,
  DownloadIcon, LogInIcon, UsersIcon, BookOpenIcon,
} from 'lucide-react';
import testimonials from '@/data/testimonials.json';
import { TestimonialCarousel } from './_components/testimonial-carousel';
import { InstallTabs } from './_components/install-tabs';
import { IntegrationPills } from './_components/integration-pills';

const headingVariants = cva('font-medium tracking-tight', {
  variants: {
    variant: {
      h1: 'text-4xl lg:text-5xl xl:text-6xl',
      h2: 'text-3xl lg:text-4xl',
      h3: 'text-xl lg:text-2xl',
    },
  },
});

const buttonVariants = cva(
  'inline-flex justify-center items-center px-5 py-3 rounded-full font-medium tracking-tight transition-all no-underline',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-brand-foreground hover:bg-brand-200',
        secondary: 'border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

const HanzoLogo = () => (
  <svg viewBox="0 0 67 67" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
    <path d="M22.21 67V44.6369H0V67H22.21Z" fill="currentColor"/>
    <path d="M0 44.6369L22.21 46.8285V44.6369H0Z" fill="currentColor" opacity="0.4"/>
    <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" fill="currentColor"/>
    <path d="M22.21 0H0V22.3184H22.21V0Z" fill="currentColor"/>
    <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" fill="currentColor"/>
    <path d="M66.6753 22.3185L44.5098 20.0822V22.3185H66.6753Z" fill="currentColor" opacity="0.4"/>
    <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" fill="currentColor"/>
  </svg>
);

const models = [
  { provider: 'Anthropic', names: 'Claude Opus 4.6, Sonnet 4.5' },
  { provider: 'OpenAI', names: 'GPT-5.2, GPT-5.1 Codex' },
  { provider: 'Google', names: 'Gemini 3 Pro, Flash' },
  { provider: 'Open Source', names: 'Qwen 3, GLM 4.7, Llama' },
  { provider: 'Together AI', names: 'DeepSeek, Mixtral, more' },
  { provider: 'OpenRouter', names: '100+ models, one API' },
];

const features = [
  { icon: HomeIcon, title: 'Runs on Your Machine', desc: 'Mac, Windows, or Linux. Anthropic, OpenAI, or local models. Private by default\u2014your data stays yours.', href: 'https://github.com/hanzoai/bot' },
  { icon: MessageCircleIcon, title: 'Any Chat App', desc: 'Talk to it on WhatsApp, Telegram, Discord, Slack, Signal, or iMessage. Works in DMs and group chats.', href: '/integrations' },
  { icon: BrainIcon, title: 'Persistent Memory', desc: 'Remembers you and becomes uniquely yours. Your preferences, your context, your AI.', href: 'https://github.com/hanzoai/bot' },
  { icon: GlobeIcon, title: 'Browser Control', desc: 'It can browse the web, fill forms, and extract data from any site.', href: 'https://github.com/hanzoai/bot' },
  { icon: TerminalIcon, title: 'Full System Access', desc: 'Read and write files, run shell commands, execute scripts. Full access or sandboxed\u2014your choice.', href: 'https://github.com/hanzoai/bot' },
  { icon: PuzzleIcon, title: 'Skills & Plugins', desc: 'Extend with community skills or build your own. It can even write its own.', href: '/skills' },
];

export default function Page() {
  return (
    <main className="relative z-[1] max-w-[860px] mx-auto px-6 pt-16 pb-10">
      <div className="stars" />
      <div className="nebula" />

      {/* Hero */}
      <header className="text-center mb-14 animate-[fadeInUp_0.8s_ease-out]">
        <div className="w-20 h-20 mx-auto mb-6 animate-[float_4s_ease-in-out_infinite] text-fd-foreground hover:scale-110 hover:text-[#00e5cc] transition-all duration-300 [&:hover]:animate-none [&_svg]:drop-shadow-[0_0_20px_rgba(240,244,255,0.3)] [&:hover_svg]:drop-shadow-[0_0_30px_rgba(0,229,204,0.6)]">
          <HanzoLogo />
        </div>

        <h1 className={cn(headingVariants({ variant: 'h1' }), 'mb-3 leading-none font-bold')}>
          <span className="bg-gradient-to-br from-fd-foreground via-brand to-[#00e5cc] bg-[length:200%_200%] bg-clip-text text-transparent animate-[gradientShift_6s_ease_infinite]">
            Hanzo Bot
          </span>
        </h1>

        <p className="text-brand text-sm font-medium tracking-[0.15em] uppercase mb-5 animate-[fadeInUp_0.8s_ease-out_0.15s_both]">
          Your AI team, deployed everywhere.
        </p>

        <p className="text-lg text-fd-muted-foreground max-w-[780px] mx-auto leading-relaxed animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
          Run locally on your Mac, or deploy to Hanzo Cloud with a full desktop VM and 100+ AI models.
          <br />
          Every channel. Every platform. Private by default. Powered by Hanzo AI.
        </p>

        <div className="flex gap-4 justify-center mt-8 animate-[fadeInUp_0.8s_ease-out_0.45s_both]">
          <a
            href="#quickstart"
            className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-[#050810] bg-gradient-to-br from-brand to-[#e03e3e] rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(255,77,77,0.45)] shadow-[0_4px_24px_rgba(255,77,77,0.3)]"
          >
            <DownloadIcon className="w-5 h-5" />
            Download
          </a>
          <a
            href="https://app.hanzo.bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-fd-foreground bg-[rgba(255,255,255,0.05)] border border-fd-border rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:bg-[rgba(0,229,204,0.08)] hover:border-[#00e5cc] hover:shadow-[0_8px_40px_rgba(0,229,204,0.2)]"
          >
            <LogInIcon className="w-5 h-5" />
            Launch in Cloud
          </a>
        </div>
      </header>

      {/* Models */}
      <section className="mb-14 animate-[fadeInUp_0.8s_ease-out_0.5s_both]">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-5">
          <span className="text-brand font-bold">&#x27E9;</span> 100+ AI Models
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {models.map((m) => (
            <div key={m.provider} className="flex flex-col gap-1 p-4 rounded-xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:border-brand hover:-translate-y-0.5">
              <span className="text-xs font-semibold text-brand uppercase tracking-wider">{m.provider}</span>
              <span className="text-sm text-fd-muted-foreground">{m.names}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-fd-muted-foreground">
          Bring your own API keys or use Hanzo Cloud for instant access to all models.
        </p>
      </section>

      {/* Testimonials */}
      <TestimonialCarousel testimonials={testimonials} />

      {/* Install Tabs */}
      <div id="quickstart">
        <InstallTabs />
      </div>

      {/* Features */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-5">
          <span className="text-brand font-bold">&#x27E9;</span> What It Does
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            const isExternal = f.href.startsWith('http');
            const El = isExternal ? 'a' : Link;
            const props = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};
            return (
              <El
                key={f.title}
                href={f.href}
                {...props}
                className="block p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm no-underline text-inherit transition-all hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_40px_rgba(255,77,77,0.2)]"
              >
                <div className="flex items-center justify-center mb-3">
                  <Icon className="w-7 h-7 text-brand" />
                </div>
                <h3 className="text-sm font-semibold text-fd-foreground mb-1.5">{f.title}</h3>
                <p className="text-xs text-fd-muted-foreground leading-relaxed">{f.desc}</p>
              </El>
            );
          })}
        </div>
      </section>

      {/* Integrations */}
      <IntegrationPills />

      {/* Why Hanzo Bot */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-5">
          <span className="text-brand font-bold">&#x27E9;</span> Why Hanzo Bot
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-[rgba(255,77,77,0.3)] bg-gradient-to-br from-[rgba(255,77,77,0.05)] to-[rgba(10,15,26,0.7)] backdrop-blur-sm text-center transition-all hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_40px_rgba(255,77,77,0.15)]">
            <div className="flex items-center gap-2.5">
              <MonitorIcon className="w-7 h-7 text-fd-muted-foreground" />
              <span className="text-lg font-semibold text-fd-muted-foreground">Full Desktop VMs</span>
            </div>
            <blockquote className="text-sm font-medium leading-relaxed italic">
              Each agent gets a full cloud desktop environment. Browse, code, design — just like a real team member.
            </blockquote>
            <span className="text-sm text-brand font-medium">Powered by Hanzo Cloud</span>
          </div>
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.7)] backdrop-blur-sm text-center transition-all hover:-translate-y-1 hover:border-brand hover:shadow-[0_12px_40px_rgba(255,77,77,0.15)]">
            <div className="flex items-center gap-2.5">
              <ShieldIcon className="w-7 h-7 text-fd-muted-foreground" />
              <span className="text-lg font-semibold text-fd-muted-foreground">Secure by Default</span>
            </div>
            <blockquote className="text-sm font-medium leading-relaxed italic">
              Your data stays yours. Hanzo IAM for auth, encrypted at rest, isolated per-agent. No data leaves your infrastructure.
            </blockquote>
            <span className="text-sm text-brand font-medium">Enterprise Ready</span>
          </div>
        </div>
      </section>

      {/* Primary CTA */}
      <div className="text-center mb-8">
        <a
          href="https://app.hanzo.bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-9 py-4 text-lg font-semibold text-[#050810] bg-gradient-to-br from-brand to-[#e03e3e] rounded-2xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(255,77,77,0.45)] shadow-[0_4px_24px_rgba(255,77,77,0.3)]"
        >
          <LogInIcon className="w-5 h-5" />
          Launch Bot Dashboard
        </a>
        <p className="mt-3 text-sm text-fd-muted-foreground">Deploy and manage your AI team across every channel</p>
      </div>

      {/* CTA Grid */}
      <nav className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {[
          { href: 'https://app.hanzo.bot', icon: UsersIcon, label: 'Dashboard', sub: 'Launch app.hanzo.bot', className: 'border-[rgba(255,77,77,0.25)] bg-[rgba(255,77,77,0.06)] hover:border-brand hover:shadow-[0_12px_40px_rgba(255,77,77,0.25)]' },
          { href: 'https://discord.gg/hanzo', icon: MessageCircleIcon, label: 'Discord', sub: 'Join community', className: 'hover:border-[#5865F2] hover:shadow-[0_12px_40px_rgba(88,101,242,0.2)]' },
          { href: 'https://github.com/hanzoai/bot', icon: GlobeIcon, label: 'GitHub', sub: 'View source', className: 'hover:border-fd-foreground hover:shadow-[0_12px_40px_rgba(240,244,255,0.1)]' },
          { href: '/docs', icon: BookOpenIcon, label: 'Docs', sub: 'Get started', className: 'hover:border-[#00e5cc] hover:shadow-[0_12px_40px_rgba(0,229,204,0.15)]' },
        ].map((cta) => {
          const Icon = cta.icon;
          const isExternal = cta.href.startsWith('http');
          const El = isExternal ? 'a' : Link;
          const props = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};
          return (
            <El
              key={cta.label}
              href={cta.href}
              {...props}
              className={cn(
                'flex flex-col items-center gap-2 px-4 py-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm no-underline text-fd-foreground transition-all hover:-translate-y-1',
                cta.className,
              )}
            >
              <Icon className="w-7 h-7 text-brand transition-transform hover:scale-110" />
              <span className="font-semibold">{cta.label}</span>
              <span className="text-xs text-fd-muted-foreground">{cta.sub}</span>
            </El>
          );
        })}
      </nav>
    </main>
  );
}
