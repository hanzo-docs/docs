import { describe, expect, it } from 'vitest';
import { absolute, toMarkdown, twin, twinPath } from './markdown';
import { markdown as landing } from './landing';

const md = (src: string, url = '/docs/a/b') => toMarkdown(src, { url });

describe('twinPath', () => {
  it.each([
    ['/', '/index.md'],
    ['', '/index.md'],
    ['/index.html', '/index.md'],
    ['/docs', '/docs.md'],
    ['/docs/', '/docs.md'],
    ['/docs/quickstart', '/docs/quickstart.md'],
    ['/docs/quickstart/', '/docs/quickstart.md'],
    ['/docs/quickstart.html', '/docs/quickstart.md'],
    ['/docs/openapi/index', '/docs/openapi/index.md'],
    ['/docs/agents#headless', '/docs/agents.md'],
  ])('%s -> %s', (from, to) => expect(twinPath(from)).toBe(to));
});

describe('absolute', () => {
  it('roots, anchors and relatives land on docs.hanzo.ai; schemes stay', () => {
    expect(absolute('/docs/x', '/docs/a/b')).toBe('https://docs.hanzo.ai/docs/x');
    expect(absolute('#y', '/docs/a/b')).toBe('https://docs.hanzo.ai/docs/a/b#y');
    expect(absolute('./c', '/docs/a/b')).toBe('https://docs.hanzo.ai/docs/a/c');
    expect(absolute('https://hanzo.ai/x', '/docs')).toBe('https://hanzo.ai/x');
    expect(absolute('mailto:ir@hanzo.ai', '/docs')).toBe('mailto:ir@hanzo.ai');
  });
});

describe('toMarkdown', () => {
  it('leaves no JSX, import or heading id behind', () => {
    const out = md("import { X } from 'y'\n\n## Install [#1-install]\n\n<Steps>\n  <Step>\n    Run it.\n  </Step>\n</Steps>\n");
    expect(out).toBe('## Install\n\nRun it.');
  });

  it('makes every link absolute', () => {
    expect(md('See [keys](/docs/api-keys) and ![logo](/logo.png).')).toBe(
      'See [keys](https://docs.hanzo.ai/docs/api-keys) and ![logo](https://docs.hanzo.ai/logo.png).',
    );
  });

  it('writes a callout as a quote with its title', () => {
    expect(md('<Callout title="Heads up">\n  Keys are shown once.\n</Callout>')).toBe('> **Heads up**\n>\n> Keys are shown once.');
  });

  it('writes cards as a list of links', () => {
    const out = md('<Cards>\n  <Card title="Chat" href="/docs/chat" description="Talk to it." />\n  <Card title="MCP" href="/docs/mcp">\n    Tools.\n  </Card>\n</Cards>');
    expect(out).toBe('- [Chat](https://docs.hanzo.ai/docs/chat): Talk to it.\n- [MCP](https://docs.hanzo.ai/docs/mcp): Tools.');
  });

  it('labels each tab, from `value` or the Tabs items', () => {
    const out = md("<Tabs items={['npm', 'Script']}>\n  <Tab>\n    ```bash\n    npm i -g hanzo\n    ```\n  </Tab>\n  <Tab value=\"Script\">\n    ```bash\n    curl -fsSL https://hanzo.sh | sh\n    ```\n  </Tab>\n</Tabs>");
    expect(out).toBe('**npm**\n\n```bash\nnpm i -g hanzo\n```\n\n**Script**\n\n```bash\ncurl -fsSL https://hanzo.sh | sh\n```');
  });

  it('drops a code tab bar and keeps each block under its label', () => {
    const out = md(
      '<CodeBlockTabs defaultValue="curl">\n  <CodeBlockTabsList>\n    <CodeBlockTabsTrigger value="curl">\n      curl\n    </CodeBlockTabsTrigger>\n  </CodeBlockTabsList>\n\n  <CodeBlockTab value="curl">\n    ```bash\n    curl https://api.hanzo.ai/v1/models\n    ```\n  </CodeBlockTab>\n</CodeBlockTabs>',
    );
    expect(out).toBe('**curl**\n\n```bash\ncurl https://api.hanzo.ai/v1/models\n```');
  });

  it('writes an Example as a fenced block', () => {
    expect(md('<Example lang="bash" code="hanzo models list" />')).toBe('```bash\nhanzo models list\n```');
  });

  it('reads a ProductSection, snippet quotes and all', () => {
    const out = md(
      `<ProductSection title="Streams" href="/docs/openapi/pubsub" snippet="<Example lang=&#x22;bash&#x22; code=&#x22;hanzo pubsub publish orders '{ &quot;id&quot;: 1 }'&#x22; />" links="[{ name: 'PubSub', href: '/docs/openapi/pubsub' }]" action="{ label: 'Move a message', href: '/docs/openapi/pubsub' }">\n  Move messages.\n</ProductSection>`,
    );
    expect(out).toBe(
      [
        '### [Streams](https://docs.hanzo.ai/docs/openapi/pubsub)',
        '',
        'Move messages.',
        '',
        '```bash',
        `hanzo pubsub publish orders '{ "id": 1 }'`,
        '```',
        '',
        '- [PubSub](https://docs.hanzo.ai/docs/openapi/pubsub)',
        '',
        '[Move a message](https://docs.hanzo.ai/docs/openapi/pubsub)',
      ].join('\n'),
    );
  });

  it('keeps tables', () => {
    expect(md('| a | b |\n| - | - |\n| 1 | 2 |')).toBe('| a | b |\n| - | - |\n| 1 | 2 |');
  });

  it('drops browser-only widgets and points live catalogues at their source', () => {
    expect(md('<DocsHero />\n\n<ModelsCatalog />')).toBe(
      'The live model catalogue: [GET https://api.hanzo.ai/v1/models](https://api.hanzo.ai/v1/models)',
    );
  });

  it('reads source that is not valid MDX as Markdown', () => {
    expect(md('Use {region} and <b>bold.\n\n[x](/y)')).toContain('[x](https://docs.hanzo.ai/y)');
  });

  it('skips frontmatter in raw source', () => {
    expect(md('---\ntitle: X\n---\nBody.')).toBe('Body.');
  });
});

describe('twin', () => {
  it('opens with the title, the canonical URL and the description', () => {
    expect(twin({ title: 'Quickstart', description: 'Install\nand go.', url: '/docs/quickstart', body: 'Body.' })).toBe(
      '# Quickstart\n\nURL: https://docs.hanzo.ai/docs/quickstart\n\n> Install and go.\n\nBody.\n',
    );
  });
});

describe('the front page twin', () => {
  it('says what the page says, with absolute links', () => {
    const out = landing({ models: 561, makers: 60, kai: { input: 0.021, output: 0 } });
    expect(out).toContain("Building business software since 2014. Techstars '17.");
    expect(out).toContain('## Kai decides.');
    expect(out).toContain('$0.021 per million input tokens, output free');
    expect(out).toContain('- [Identity & trust](https://docs.hanzo.ai/docs/openapi/iam)');
    expect(out).toContain('## All models: 500+');
    expect(out).not.toMatch(/\]\(\//);
  });
});
