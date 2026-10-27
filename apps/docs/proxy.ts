import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred } from '@hanzo/docs/core/negotiation';
import { twinPath } from '@/lib/twin';

// A page's Markdown twin under `next dev`, which serves no `<page>.md` file:
// the export's copies (scripts/twins.ts) are of these routes.
const TWIN = /^\/(index|docs(?:\/.*)?|blog(?:\/.*)?|reference)\.md$/;
function twinRoute(pathname: string): string | undefined {
  const m = TWIN.exec(pathname);
  if (!m) return undefined;
  return m[1] === 'index' ? '/llms.mdx/content.md' : `/llms.mdx/${m[1]}/content.md`;
}

const DEFAULT_HOST_SUFFIX = 'docs.hanzo.ai';

const SKIP_PATTERN = /^\/(\_next|api|assets|favicon\.ico)(\/|$)/;

function extractSubdomain(host: string, suffix: string): string {
  const normalizedHost = host.split(':')[0];
  if (!normalizedHost.endsWith(suffix)) return '';
  const trimmed = normalizedHost.slice(0, normalizedHost.length - suffix.length);
  if (!trimmed.endsWith('.')) return '';
  return trimmed.slice(0, -1);
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal/static paths
  if (SKIP_PATTERN.test(pathname)) {
    return NextResponse.next();
  }

  // Subdomain-based project routing (e.g. mcp.docs.hanzo.ai -> /docs/projects/hanzoai/mcp/...)
  const host = request.headers.get('host') ?? '';
  const hostSuffix = process.env.HANZO_DOCS_HOST_SUFFIX ?? DEFAULT_HOST_SUFFIX;

  if (host.endsWith(hostSuffix)) {
    const subdomain = extractSubdomain(host, hostSuffix);
    if (subdomain && subdomain !== 'docs') {
      const org = process.env.HANZO_DOCS_DEFAULT_ORG ?? 'hanzoai';
      if (pathname !== '/docs/projects' && !pathname.startsWith('/docs/projects/')) {
        const suffix = pathname === '/' ? '' : pathname;
        const url = request.nextUrl.clone();
        url.pathname = `/docs/projects/${org}/${subdomain}${suffix}`;
        return NextResponse.rewrite(url);
      }
    }
  }

  // `<page>.md`, or the page asked for as Markdown: its twin.
  const twin = twinRoute(pathname) ?? (isMarkdownPreferred(request) ? twinRoute(twinPath(pathname)) : undefined);
  if (twin) return NextResponse.rewrite(new URL(twin, request.nextUrl));

  return NextResponse.next();
}
