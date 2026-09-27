import type { BaseLayoutProps, LinkItemType } from '@hanzo/docs-base-ui/layouts/shared';
import { HanzoMark } from '@hanzogui/shell';
import { nav } from '@/lib/nav';

// The blog's HomeLayout (app/(home)) is the last caller of this, and it goes
// when the blog moves onto the gui shell. The nav itself is lib/nav.
export const linkItems: LinkItemType[] = nav.map((item) => ({
  text: item.text,
  url: item.url,
  active: item.exact ? 'url' : 'nested-url',
}));

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <HanzoMark size={18} />
          <span className="font-medium max-md:hidden">Hanzo AI</span>
          <span className="max-md:hidden rounded border border-fd-border px-1.5 py-0.5 text-[11px] font-medium text-fd-muted-foreground">
            Docs
          </span>
        </>
      ),
    },
  };
}
