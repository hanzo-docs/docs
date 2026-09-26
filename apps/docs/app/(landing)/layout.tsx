import { Docs } from '@/components/layouts/docs';
import { HanzoPreFooterCTA } from '@hanzogui/shell';
import { Footer } from '@/components/footer';

// The landing page carries the SAME chrome as /docs — page tree, sidebar
// filter, project switcher.
//
// It sat under (home)'s HomeLayout, which has no tree and therefore no sidebar:
// a reader arriving at / saw eight domain cards and had to click one before the
// site would show them what it contains. The sidebar is the table of contents
// for ~1,600 pages, and the landing page is where it is worth the most.
//
// / gets its own route group because (home) also wraps /blog, an editorial
// page with no place in the docs tree, so it keeps the marketing chrome — and
// (home) keeps its name, which reads as "the pages using HomeLayout", the
// upstream component's own vocabulary.
export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <>
      {/* `dark` on the route, because this page paints its own palette in
          literal white-on-neutral rather than fd- tokens and only reads on a
          dark ground. Hiding the theme switch does not make it dark: the class
          is stored globally, so a reader who chose light on /docs and clicked
          the wordmark arrived at a 72px white headline on a white page. `.dark`
          is a plain class selector, so nesting it redefines the tokens for
          everything below — chrome included, which is why it sits here and not
          on the page's own <main>.

          @hanzo/ui's own ramp has no `.dark` (dark is its :root, light its
          `.light`), so in here a light reader's --text-primary stayed #0a0a0a and
          its h1–h4 printed black on #050505. The div names the site's foreground
          as that token, and the pre-footer's glass sits on this ground, not on
          the white body. */}
      {/* THE TREE IS THE POINT, so it starts open here as it does everywhere
          else. It started collapsed on the argument that a reader who typed the
          domain has not asked for a table of contents — but the landing page is
          exactly where somebody does not yet know what is here, and a collapsed
          rail answers that by showing nothing. It also cost the page its
          wordmark: the sidebar renders it, so collapsing the sidebar rendered no
          brand at all. One state, every route. */}
      <div className="dark bg-fd-background text-fd-foreground [--text-primary:var(--color-fd-foreground)]">
        <Docs themeSwitch={{ enabled: false }} sidebar={{ defaultCollapsed: false }}>
          {children}
        </Docs>
        <HanzoPreFooterCTA surface="hanzo.ai" />
      </div>
      <Footer />
    </>
  );
}
