import Link from 'next/link';
import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import {
  TerminalIcon,
  ShieldCheckIcon,
  BotIcon,
  PlugIcon,
  ZapIcon,
  CodeIcon,
  GitBranchIcon,
  PlayIcon,
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
            <TerminalIcon className="size-4" />
            AI-Powered Development CLI
          </div>
          <h1 className={cn(headingVariants({ variant: 'h1' }), 'my-8 leading-tight')}>
            <span className="text-brand">Hanzo Dev</span> — Your AI
            <br />
            Coding Assistant
          </h1>
          <p className="text-lg text-fd-muted-foreground max-w-2xl mb-8">
            AI-powered terminal tool with multi-agent orchestration, sandboxed execution,
            MCP integration, and Auto Drive for fully automated development workflows.
          </p>
          <div className="flex flex-row items-center justify-center gap-4 flex-wrap w-fit">
            <Link href="/docs" className={cn(buttonVariants(), 'max-sm:text-sm')}>
              Get Started
            </Link>
            <a
              href="https://github.com/hanzoai/dev"
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
                <code>{`$ dev "refactor the auth module to use JWT"

  Analyzing codebase...
  Found 12 files related to authentication.

  Plan:
  1. Replace session-based auth with JWT tokens
  2. Add token refresh endpoint
  3. Update middleware to verify JWT
  4. Migrate existing sessions

  Executing with sandbox: workspace-write
  ✓ Modified src/auth/handler.rs
  ✓ Modified src/middleware/auth.rs
  ✓ Created src/auth/jwt.rs
  ✓ Updated 8 test files
  ✓ All tests passing`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-10 mt-12 px-6 mx-auto w-full max-w-[1400px] md:px-12 lg:grid-cols-2">
        <p className="text-2xl tracking-tight leading-snug font-light col-span-full md:text-3xl xl:text-4xl">
          Ship faster with <span className="text-brand font-medium">AI-powered coding</span>,{' '}
          <span className="text-brand font-medium">multi-agent orchestration</span>, and{' '}
          <span className="text-brand font-medium">sandboxed execution</span>.
        </p>

        {/* Multi-Agent */}
        <div className={cn(cardVariants())}>
          <BotIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Multi-Agent Orchestration
          </h3>
          <ul className="space-y-3 text-fd-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-brand">Fan out</span> tasks across GPT-5, Claude, Gemini, Qwen
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">/plan</span> /solve /code multi-agent flows
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">Custom agents</span> via config.toml
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">Subagent</span> orchestration with merged reasoning
            </li>
          </ul>
        </div>

        {/* Auto Drive */}
        <div className={cn(cardVariants({ variant: 'secondary' }))}>
          <PlayIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Auto Drive
          </h3>
          <p className="mb-4">
            Fully automated multi-turn task execution with planning, review gates,
            and configurable countdown modes.
          </p>
          <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`# Fully automated task execution
dev auto "Refactor the database module"

# With time limit in CI
dev exec --auto --max-seconds 300 "Fix all TODOs"`}
          </pre>
        </div>

        {/* Sandboxing */}
        <div className={cn(cardVariants())}>
          <ShieldCheckIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Sandboxed Execution
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Secure command execution with platform-native sandboxing and configurable approval policies.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Seatbelt</p>
              <p className="text-xs text-fd-muted-foreground">macOS sandbox</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Landlock</p>
              <p className="text-xs text-fd-muted-foreground">Linux sandbox</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Approval gates</p>
              <p className="text-xs text-fd-muted-foreground">Human-in-the-loop</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Workspace isolation</p>
              <p className="text-xs text-fd-muted-foreground">Read/write controls</p>
            </div>
          </div>
        </div>

        {/* MCP */}
        <div className={cn(cardVariants())}>
          <PlugIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            MCP Integration
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Connect to any MCP server for extended tool capabilities. Hanzo Dev can also serve as an MCP server.
          </p>
          <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`[mcp_servers.my-tool]
command = "npx"
args = ["-y", "@my/mcp-server"]
env = { "API_KEY" = "sk-..." }`}
          </pre>
        </div>

        {/* IDE Integration */}
        <div className={cn(cardVariants(), 'col-span-full')}>
          <CodeIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-6' }))}>
            IDE & Tool Integrations
          </h3>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'Zed', desc: 'ACP agent integration' },
              { name: 'GitHub Copilot', desc: 'CLI-powered assistance' },
              { name: 'MCP Servers', desc: '260+ tool servers' },
              { name: 'CI/CD', desc: 'GitHub Actions & more' },
            ].map((tool) => (
              <div
                key={tool.name}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border"
              >
                <span className="font-medium">{tool.name}</span>
                <span className="text-xs text-fd-muted-foreground">{tool.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start */}
        <div className={cn(cardVariants({ variant: 'secondary' }), 'col-span-full')}>
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-6' }))}>
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">npm</h4>
              <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`npm install -g @hanzo/dev`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Homebrew</h4>
              <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`brew tap hanzoai/tap
brew install hanzo-dev`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">From Source</h4>
              <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`git clone https://github.com/hanzoai/dev
cd dev/codex-rs && cargo build`}
              </pre>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={cn(cardVariants(), 'col-span-full text-center py-12')}>
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-4' }))}>
            Ready to Build?
          </h2>
          <p className="text-fd-muted-foreground mb-8 max-w-2xl mx-auto">
            Start using AI-powered development in your terminal today.
            Hanzo Dev brings multi-agent orchestration and sandboxed execution
            to your workflow.
          </p>
          <div className="flex flex-row items-center justify-center gap-4">
            <Link href="/docs" className={cn(buttonVariants())}>
              Read the Docs
            </Link>
            <a
              href="https://github.com/hanzoai/dev"
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
