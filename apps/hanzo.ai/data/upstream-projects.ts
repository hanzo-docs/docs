// Upstream project information for OSS attribution

export interface UpstreamProject {
  name: string;
  description: string;
  url: string;
  github: string;
  logo?: string;
  license?: string;
  stars?: string;
}

export interface CodeExample {
  language: string;
  label: string;
  code: string;
  description?: string;
}

export interface CommunityInfo {
  discord?: string;
  twitter?: string;
  slack?: string;
  forum?: string;
}

// Upstream projects that Hanzo products are built on
const upstreamProjects: Record<string, UpstreamProject> = {
  chat: {
    name: 'LibreChat',
    description: ' We contribute back to the upstream project and maintain compatibility.',
    url: 'https://librechat.ai',
    github: 'https://github.com/danny-avila/LibreChat',
    license: 'MIT',
    stars: '18k+',
  },
  gateway: {
    name: 'LiteLLM',
    description: ' We extend it with additional features and enterprise capabilities.',
    url: 'https://litellm.ai',
    github: 'https://github.com/BerriAI/litellm',
    license: 'MIT',
    stars: '12k+',
  },
};

// Code examples for products
const codeExamples: Record<string, CodeExample[]> = {
  gateway: [
    {
      language: 'python',
      label: 'Python',
      code: `from openai import OpenAI

client = OpenAI(
    base_url="https://api.hanzo.ai/v1",
    api_key="your-hanzo-key"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
      description: 'Use the OpenAI SDK with Hanzo Gateway',
    },
    {
      language: 'curl',
      label: 'cURL',
      code: `curl https://api.hanzo.ai/v1/chat/completions \\
  -H "Authorization: Bearer $HANZO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`,
      description: 'Call the API directly with cURL',
    },
  ],
  chat: [
    {
      language: 'docker',
      label: 'Docker',
      code: `docker run -d \\
  -p 3081:3081 \\
  -e OPENAI_API_KEY=your-key \\
  hanzo/chat:latest`,
      description: 'Run Hanzo Chat with Docker',
    },
  ],
};

// Community links for products
const communityLinks: Record<string, CommunityInfo> = {
  default: {
    discord: 'https://discord.gg/hanzo',
    twitter: 'https://twitter.com/hanloai',
  },
};

// Hanzo SDKs
export interface SDK {
  language: string;
  name: string;
  package: string;
  registry: string;
  url: string;
  installCommand: string;
  docsUrl?: string;
}

export const hanzoSDKs: SDK[] = [
  {
    language: 'Python',
    name: 'Hanzo Python SDK',
    package: 'hanzo',
    registry: 'PyPI',
    url: 'https://pypi.org/project/hanzo/',
    installCommand: 'pip install hanzo',
    docsUrl: 'https://docs.hanzo.ai/sdk/python',
  },
  {
    language: 'TypeScript',
    name: 'Hanzo JS SDK',
    package: '@hanzo/ai',
    registry: 'npm',
    url: 'https://www.npmjs.com/package/@hanzo/ai',
    installCommand: 'npm install @hanzo/ai',
    docsUrl: 'https://docs.hanzo.ai/sdk/javascript',
  },
  {
    language: 'Go',
    name: 'Hanzo Go SDK',
    package: 'github.com/hanzoai/go-sdk',
    registry: 'Go Modules',
    url: 'https://pkg.go.dev/github.com/hanzoai/go-sdk',
    installCommand: 'go get github.com/hanzoai/go-sdk',
    docsUrl: 'https://docs.hanzo.ai/sdk/go',
  },
  {
    language: 'Rust',
    name: 'Hanzo Rust SDK',
    package: 'hanzo',
    registry: 'crates.io',
    url: 'https://crates.io/crates/hanzo',
    installCommand: 'cargo add hanzo',
    docsUrl: 'https://docs.hanzo.ai/sdk/rust',
  },
];

// Helper functions
export function getUpstreamForProduct(productId: string): UpstreamProject | undefined {
  return upstreamProjects[productId];
}

export function getCodeExamplesForProduct(productId: string): CodeExample[] {
  return codeExamples[productId] || [];
}

export function getCommunityForProduct(productId: string): CommunityInfo {
  return communityLinks[productId] || communityLinks.default;
}
