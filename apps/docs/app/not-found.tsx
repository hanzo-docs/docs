import type { Metadata } from 'next';
import { Shell } from '@/components/shell';
import { Footer } from '@/components/footer';
import { Missing } from '@/components/missing';

// The export writes this page as 404.html, and the edge serves it for any path
// the site does not hold (ingress staticFiles errorPage404). A miss is answered
// with the site's own chrome — the page tree and the sidebar filter — because
// the reader's next move is to find the page they meant.
export const metadata: Metadata = {
  title: 'Page not found',
  // A 404 that is indexed puts dead addresses in search results.
  robots: { index: false, follow: true },
};

// Where a reader who mistyped or followed an old link most often meant to go.
// Static, because a static export has no request to reason about: the path that
// missed is not known at build time.
const suggestions = [
  { href: '/docs', title: 'Documentation' },
  { href: '/docs/quickstart', title: 'Quickstart' },
  { href: '/docs/openapi', title: 'API reference' },
  { href: '/docs/sdks', title: 'SDKs' },
  { href: '/docs/mcp', title: 'MCP' },
];

export default function Page() {
  return (
    <>
      <Shell>
        <Missing suggestions={suggestions} />
      </Shell>
      <Footer />
    </>
  );
}
