import Link from 'next/link';
import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import {
  ZapIcon,
  ShieldCheckIcon,
  CodeIcon,
  NetworkIcon,
  CpuIcon,
  LockIcon,
  BoltIcon,
  ServerIcon,
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

const languages = [
  { name: 'Rust', icon: '🦀', color: 'text-orange-500' },
  { name: 'Go', icon: '🐹', color: 'text-cyan-500' },
  { name: 'Python', icon: '🐍', color: 'text-yellow-500' },
  { name: 'JavaScript', icon: '📜', color: 'text-yellow-400' },
  { name: 'C++', icon: '⚡', color: 'text-blue-500' },
  { name: 'C', icon: '🔧', color: 'text-gray-500' },
  { name: 'Java', icon: '☕', color: 'text-red-500' },
  { name: 'C#', icon: '💜', color: 'text-purple-500' },
  { name: 'Erlang', icon: '📡', color: 'text-pink-500' },
  { name: 'OCaml', icon: '🐫', color: 'text-orange-400' },
  { name: 'Haskell', icon: '💎', color: 'text-purple-400' },
];

export default function Page() {
  return (
    <main className="text-landing-foreground pt-4 pb-6 dark:text-landing-foreground-dark md:pb-12">
      {/* Hero Section */}
      <div className="relative flex min-h-[600px] h-[70vh] max-h-[900px] border rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] bg-gradient-to-br from-brand/10 via-transparent to-brand-secondary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="flex flex-col z-2 px-4 size-full md:p-12 max-md:items-center max-md:text-center">
          <div className="flex items-center gap-2 mt-12 text-xs text-brand font-medium rounded-full p-2 border border-brand/50 w-fit">
            <BoltIcon className="size-4" />
            Zero-Copy App Proto for AI Agents
          </div>
          <h1 className={cn(headingVariants({ variant: 'h1' }), 'my-8 leading-tight')}>
            <span className="text-brand">ZAP</span> - High-Performance
            <br />
            Agent Communication
          </h1>
          <p className="text-lg text-fd-muted-foreground max-w-2xl mb-8">
            Cap'n Proto RPC protocol designed for AI agent ecosystems. Zero-copy serialization,
            post-quantum security, and native support for 11 programming languages.
          </p>
          <div className="flex flex-row items-center justify-center gap-4 flex-wrap w-fit">
            <Link href="/docs" className={cn(buttonVariants(), 'max-sm:text-sm')}>
              Get Started
            </Link>
            <a
              href="https://github.com/zap-protocol/zap"
              target="_blank"
              rel="noreferrer noopener"
              className={cn(buttonVariants({ variant: 'secondary' }), 'max-sm:text-sm')}
            >
              View on GitHub
            </a>
          </div>

          {/* Code Preview */}
          <div className="mt-12 w-full max-w-3xl mx-auto">
            <div className="bg-fd-card border rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-2 border-b bg-fd-muted/50">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-500" />
                  <div className="size-3 rounded-full bg-yellow-500" />
                  <div className="size-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-fd-muted-foreground ml-2">zap.capnp</span>
              </div>
              <pre className="p-4 text-sm overflow-x-auto font-mono">
                <code>{`interface Zap {
  init @0 (client :ClientInfo) -> (server :ServerInfo);
  listTools @1 () -> (tools :ToolList);
  callTool @2 (call :ToolCall) -> (result :ToolResult);
  listResources @3 () -> (resources :ResourceList);
  readResource @4 (uri :Text) -> (content :ResourceContent);
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-10 mt-12 px-6 mx-auto w-full max-w-[1400px] md:px-12 lg:grid-cols-2">
        <p className="text-2xl tracking-tight leading-snug font-light col-span-full md:text-3xl xl:text-4xl">
          ZAP brings <span className="text-brand font-medium">zero-copy performance</span> to AI agent
          communication with <span className="text-brand font-medium">MCP compatibility</span> and
          <span className="text-brand font-medium"> post-quantum security</span> built-in.
        </p>

        {/* Why ZAP */}
        <div className={cn(cardVariants())}>
          <ZapIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Why ZAP over MCP?
          </h3>
          <ul className="space-y-3 text-fd-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-brand">10-100x</span> faster than JSON-RPC serialization
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">Zero-copy</span> message passing with shared memory
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">Post-quantum</span> ML-KEM/ML-DSA cryptography
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">Threshold signing</span> with Ringtail consensus
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">W3C DID</span> native identity support
            </li>
          </ul>
        </div>

        {/* MCP Compatibility */}
        <div className={cn(cardVariants({ variant: 'secondary' }))}>
          <NetworkIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            MCP Gateway
          </h3>
          <p className="mb-4">
            Full backward compatibility with existing MCP servers through the Gateway interface.
            Bridge stdio, HTTP, WebSocket, and Unix socket transports.
          </p>
          <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`interface Gateway extends(Zap) {
  addServer @0 (name :Text, url :Text,
    config :ServerConfig) -> (id :Text);
  listServers @2 () -> (servers :List(ConnectedServer));
}`}
          </pre>
        </div>

        {/* Post-Quantum Security */}
        <div className={cn(cardVariants())}>
          <ShieldCheckIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Post-Quantum Security
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Future-proof your agent communication with NIST-approved post-quantum algorithms.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg border">
              <p className="font-medium">ML-KEM-768</p>
              <p className="text-xs text-fd-muted-foreground">Key encapsulation</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">ML-DSA-65</p>
              <p className="text-xs text-fd-muted-foreground">Digital signatures</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">X25519</p>
              <p className="text-xs text-fd-muted-foreground">Hybrid handshake</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Ringtail</p>
              <p className="text-xs text-fd-muted-foreground">Threshold signing</p>
            </div>
          </div>
        </div>

        {/* Agent Consensus */}
        <div className={cn(cardVariants())}>
          <CpuIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Agent Consensus
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Voting-based consensus for multi-agent response aggregation with configurable thresholds.
          </p>
          <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`struct AgentConsensusConfig {
  threshold @0 :Float64;      # Vote fraction
  minResponses @1 :UInt32;    # Min responses
  timeoutSecs @2 :UInt32;     # Query timeout
  requireSignatures @3 :Bool; # Signatures req
}`}
          </pre>
        </div>

        {/* Language Bindings */}
        <div className={cn(cardVariants(), 'col-span-full')}>
          <CodeIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-6' }))}>
            11 Language Bindings
          </h3>
          <div className="flex flex-wrap gap-4">
            {languages.map((lang) => (
              <Link
                key={lang.name}
                href={`/docs/bindings/${lang.name.toLowerCase().replace('#', 'sharp').replace('++', 'pp')}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:border-brand transition-colors"
              >
                <span className="text-xl">{lang.icon}</span>
                <span className="font-medium">{lang.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* W3C DID */}
        <div className={cn(cardVariants())}>
          <LockIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            W3C DID Support
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Native decentralized identity with did:lux, did:key, and did:web methods.
          </p>
          <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`struct Did {
  method @0 :DidMethod;  # lux, key, web
  id @1 :Text;           # Method-specific ID
}

interface DidRegistry {
  resolve @0 (request :DidResolveRequest)
    -> (response :DidResolveResponse);
}`}
          </pre>
        </div>

        {/* Lux Integration */}
        <div className={cn(cardVariants())}>
          <ServerIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Lux Network Integration
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            First-class support for the Lux blockchain with did:lux anchoring and stake registry.
          </p>
          <ul className="space-y-2 text-sm text-fd-muted-foreground">
            <li>Blockchain-anchored DIDs</li>
            <li>Stake-weighted agent coordination</li>
            <li>On-chain identity verification</li>
            <li>Cross-chain interoperability</li>
          </ul>
        </div>

        {/* Quick Start */}
        <div className={cn(cardVariants({ variant: 'secondary' }), 'col-span-full')}>
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-6' }))}>
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Rust</h4>
              <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`cargo add zap-protocol`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Go</h4>
              <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`go get github.com/zap-protocol/zap-go`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Python</h4>
              <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`pip install zap-protocol`}
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
            Join the next generation of AI agent protocols. ZAP provides the performance and
            security infrastructure your agents need.
          </p>
          <div className="flex flex-row items-center justify-center gap-4">
            <Link href="/docs" className={cn(buttonVariants())}>
              Read the Docs
            </Link>
            <a
              href="https://github.com/zap-protocol/zap"
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
