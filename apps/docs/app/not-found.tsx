import type { Metadata } from 'next';
import { Docs } from '@/components/layouts/docs';
import { Footer } from '@/components/footer';
import { NotFound } from '@/components/layouts/not-found';

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
  { id: 'docs', href: '/docs', title: 'Documentation' },
  { id: 'quickstart', href: '/docs/quickstart', title: 'Quickstart' },
  { id: 'openapi', href: '/docs/openapi', title: 'API reference' },
  { id: 'sdks', href: '/docs/sdks', title: 'SDKs' },
  { id: 'mcp', href: '/docs/mcp', title: 'MCP' },
];

export default function Page() {
  return (
    <>
      <Docs>
        <NotFound getSuggestions={async () => suggestions} />
      </Docs>
      <div className="pt-16 md:pt-24">
        <Footer />
      </div>
    </>
  );
}
