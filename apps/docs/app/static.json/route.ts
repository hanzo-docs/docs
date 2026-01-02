import { source } from '@/lib/source';
import type { OramaDocument } from '@hanzo/docs-core/search/orama-cloud';
import { getBreadcrumbItems } from '@hanzo/docs-core/breadcrumb';
import { getSection } from '@/lib/source/navigation';
import { NextResponse } from 'next/server';

export const revalidate = false;

export async function GET() {
  const pages = source.getPages();
  const results: OramaDocument[] = [];

  for (const page of pages) {
    if (page.data.type === 'openapi') continue;

    const items = getBreadcrumbItems(page.url, source.getPageTree(), {
      includePage: false,
      includeRoot: true,
    });

    const loaded = await page.data.load();
    
    results.push({
      id: page.url,
      structured: loaded.structuredData,
      tag: getSection(page.slugs[0]),
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      breadcrumbs: items.flatMap<string>((item, i) =>
        i > 0 && typeof item.name === 'string' ? item.name : [],
      ),
    });
  }

  return NextResponse.json(results);
}
