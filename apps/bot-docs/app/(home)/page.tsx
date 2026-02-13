import Link from 'next/link';
import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import {
  BotIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  PlugIcon,
  ZapIcon,
  SmartphoneIcon,
  ServerIcon,
  CloudIcon,
  HeartHandshakeIcon,
  TerminalIcon,
  BrainCircuitIcon,
  GlobeIcon,
} from 'lucide-react';

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
  'inline-flex justify-center px-5 py-3 rounded-full font-medium tracking-tight transition-colors',
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

const cardVariants = cva('rounded-2xl text-sm p-6 bg-origin-border shadow-lg', {
  variants: {
    variant: {
      secondary: 'bg-brand-secondary text-brand-secondary-foreground',
      default: 'border bg-fd-card',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export default function Page() {
  return (
    <main className="text-landing-foreground pt-4 pb-6 dark:text-landing-foreground-dark md:pb-12">
      {/* Hero Section */}
      <div className="relative flex min-h-[600px] h-[70vh] max-h-[900px] border rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] bg-gradient-to-br from-brand/10 via-transparent to-brand-secondary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="flex flex-col z-2 px-4 size-full md:p-12 max-md:items-center max-md:text-center">
          <div className="flex items-center gap-2 mt-12 text-xs text-brand font-medium rounded-full p-2 border border-brand/50 w-fit">
            <BotIcon className="size-4" />
            AI-Powered Personal Assistant
          </div>
          <h1 className={cn(headingVariants({ variant: 'h1' }), 'my-8 leading-tight')}>
            <span className="text-brand">Hanzo Bot</span> — Your AI
            <br />
            on Every Platform
          </h1>
          <p className="text-lg text-fd-muted-foreground max-w-2xl mb-8">
            AI-powered personal assistant for any OS. Gateway to WhatsApp, Telegram,
            Discord, iMessage, and more. Full system access with privacy by default.
            Self-host or run on Hanzo Cloud.
          </p>
          <div className="flex flex-row items-center justify-center gap-4 flex-wrap w-fit">
            <Link href="/docs" className={cn(buttonVariants(), 'max-sm:text-sm')}>
              Get Started
            </Link>
            <Link href="/docs/install" className={cn(buttonVariants({ variant: 'secondary' }), 'max-sm:text-sm')}>
              Install Now
            </Link>
            <a
              href="https://github.com/hanzoai/bot"
              target="_blank"
              rel="noreferrer noopener"
              className={cn(buttonVariants({ variant: 'secondary' }), 'max-sm:text-sm')}
            >
              View on GitHub
            </a>
          </div>

          {/* Terminal Preview */}
          <div className="mt-12 w-full max-w-3xl mx-auto">
            <div className="bg-fd-card border rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-2 border-b bg-fd-muted/50">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-500" />
                  <div className="size-3 rounded-full bg-yellow-500" />
                  <div className="size-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-fd-muted-foreground ml-2">terminal</span>
              </div>
              <pre className="p-4 text-sm overflow-x-auto font-mono">
                <code>{`$ curl -fsSL https://hanzo.bot/install.sh | bash
$ hanzo-bot setup
$ hanzo-bot gateway

  Hanzo Bot Gateway running on 127.0.0.1:18789
  Dashboard: http://127.0.0.1:18789/

  Channels:
  ✓ WhatsApp connected (paired)
  ✓ Telegram connected (@mybot)
  ✓ Discord connected (Hanzo#1234)

  Skills: 743 loaded
  Provider: anthropic (claude-sonnet-4-5-20250514)
  Memory: persistent (SQLite)

  Ready. Send a message to get started.`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-10 mt-12 px-6 mx-auto w-full max-w-[1400px] md:px-12 lg:grid-cols-2">
        <p className="text-2xl tracking-tight leading-snug font-light col-span-full md:text-3xl xl:text-4xl">
          Connect to <span className="text-brand font-medium">every messaging platform</span>,{' '}
          run <span className="text-brand font-medium">743+ skills</span>, and{' '}
          keep <span className="text-brand font-medium">full control</span> of your data.
        </p>

        {/* Channels */}
        <div className={cn(cardVariants())}>
          <MessageSquareIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Multi-Channel Gateway
          </h3>
          <ul className="space-y-3 text-fd-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-brand">WhatsApp</span> — full media support, group chats
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">Telegram</span> — bot API and user gateway
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">Discord</span> — server bots, DMs, threads
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">iMessage, Signal, Slack, Matrix</span> and more
            </li>
          </ul>
        </div>

        {/* Hanzo Cloud */}
        <div className={cn(cardVariants({ variant: 'secondary' }))}>
          <CloudIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Hanzo Cloud
          </h3>
          <p className="mb-4">
            Don't want to self-host? Run Hanzo Bot on Hanzo Cloud with zero config.
            Start free with a <strong>$5 credit</strong> on signup.
          </p>
          <ul className="space-y-2 text-sm">
            <li>Managed infrastructure, automatic updates</li>
            <li>Scale from hobby to enterprise</li>
            <li>25% of compute costs paid back to OSS developers</li>
            <li>OpenClaw compatible — bring your existing config</li>
          </ul>
        </div>

        {/* Skills & Tools */}
        <div className={cn(cardVariants())}>
          <ZapIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            743+ Skills
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Extensible skill system with browser automation, code execution,
            web search, file management, and hundreds of community-built skills.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Browser</p>
              <p className="text-xs text-fd-muted-foreground">Headless automation</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Code Exec</p>
              <p className="text-xs text-fd-muted-foreground">Sandboxed runtime</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Web Search</p>
              <p className="text-xs text-fd-muted-foreground">Brave, Google, DuckDuckGo</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Media</p>
              <p className="text-xs text-fd-muted-foreground">Images, audio, voice</p>
            </div>
          </div>
        </div>

        {/* Privacy & Self-Host */}
        <div className={cn(cardVariants())}>
          <ShieldCheckIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Privacy by Default
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Self-host on your own hardware. All data stays local.
            Loopback-first architecture means your messages never leave your machine.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Local-first</p>
              <p className="text-xs text-fd-muted-foreground">Loopback by default</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Your keys</p>
              <p className="text-xs text-fd-muted-foreground">BYO API credentials</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Sandboxed</p>
              <p className="text-xs text-fd-muted-foreground">Configurable execution</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Open Source</p>
              <p className="text-xs text-fd-muted-foreground">MIT License</p>
            </div>
          </div>
        </div>

        {/* LLM Providers */}
        <div className={cn(cardVariants(), 'col-span-full')}>
          <BrainCircuitIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-6' }))}>
            Any LLM Provider
          </h3>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'OpenAI', desc: 'GPT-5, o3, o4-mini' },
              { name: 'Anthropic', desc: 'Claude 4.5/4.6' },
              { name: 'Ollama', desc: 'Local models' },
              { name: 'Qwen', desc: 'Qwen3 series' },
              { name: 'OpenRouter', desc: '200+ models' },
              { name: 'Bedrock', desc: 'AWS hosted' },
            ].map((provider) => (
              <div
                key={provider.name}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border"
              >
                <span className="font-medium">{provider.name}</span>
                <span className="text-xs text-fd-muted-foreground">{provider.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* OSS Revenue Share */}
        <div className={cn(cardVariants({ variant: 'secondary' }), 'col-span-full')}>
          <HeartHandshakeIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            25% Back to Open Source
          </h3>
          <p className="mb-6 max-w-3xl">
            Unlike traditional cloud platforms, Hanzo pays <strong>25% of compute costs</strong> back
            to OSS developers. Connect your account, share skills, and earn revenue when your
            contributions power Hanzo Bot instances across the network.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-black/20 rounded-lg">
              <h4 className="font-medium mb-1">Build Skills</h4>
              <p className="text-sm opacity-80">Create and publish skills to the marketplace</p>
            </div>
            <div className="p-4 bg-black/20 rounded-lg">
              <h4 className="font-medium mb-1">Connect Account</h4>
              <p className="text-sm opacity-80">Link your GitHub to track contributions</p>
            </div>
            <div className="p-4 bg-black/20 rounded-lg">
              <h4 className="font-medium mb-1">Earn Revenue</h4>
              <p className="text-sm opacity-80">Get paid when your code powers bots</p>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className={cn(cardVariants(), 'col-span-full')}>
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-6' }))}>
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Install</h4>
              <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`curl -fsSL https://hanzo.bot/install.sh | bash`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">npm</h4>
              <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`npm install -g @hanzo/bot
hanzo-bot setup`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Docker</h4>
              <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`docker run -d --name hanzo-bot \\
  ghcr.io/hanzoai/bot:latest`}
              </pre>
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div className={cn(cardVariants(), 'col-span-full')}>
          <GlobeIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-6' }))}>
            Runs Everywhere
          </h3>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'macOS', desc: 'Native companion app' },
              { name: 'Linux', desc: 'CLI + systemd' },
              { name: 'Windows', desc: 'WSL2 supported' },
              { name: 'iOS', desc: 'Mobile node' },
              { name: 'Android', desc: 'Termux compatible' },
              { name: 'Docker', desc: 'Container ready' },
              { name: 'Fly.io', desc: 'Edge deploy' },
              { name: 'Hanzo Cloud', desc: 'Managed hosting' },
            ].map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border"
              >
                <span className="font-medium">{platform.name}</span>
                <span className="text-xs text-fd-muted-foreground">{platform.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={cn(cardVariants(), 'col-span-full text-center py-12')}>
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-4' }))}>
            Ready to Get Started?
          </h2>
          <p className="text-fd-muted-foreground mb-8 max-w-2xl mx-auto">
            Install Hanzo Bot in under a minute. Self-host for free or launch on
            Hanzo Cloud with a $5 credit. OpenClaw compatible.
          </p>
          <div className="flex flex-row items-center justify-center gap-4">
            <Link href="/docs" className={cn(buttonVariants())}>
              Read the Docs
            </Link>
            <a
              href="https://cloud.hanzo.ai"
              target="_blank"
              rel="noreferrer noopener"
              className={cn(buttonVariants({ variant: 'secondary' }))}
            >
              Try Hanzo Cloud
            </a>
            <a
              href="https://github.com/hanzoai/bot"
              target="_blank"
              rel="noreferrer noopener"
              className={cn(buttonVariants({ variant: 'secondary' }))}
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
