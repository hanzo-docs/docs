import { Shell } from '@/components/shell';
import { HanzoPreFooterCTA } from '@hanzogui/shell';
import { Footer } from '@/components/footer';

// The landing page carries the SAME chrome as /docs — rail, tree, bar — because
// it is where a reader does not yet know what is here, and the tree is the
// table of contents.
//
// The page itself paints a dark palette of its own (literal white-on-neutral),
// so the page, and only the page, is held dark with gui's `t_dark` on a wrapper:
// the chrome around it follows the reader's theme like every other route. That
// wrapper goes when the landing moves onto gui tokens.
export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Shell>
        <div className="t_dark bg-fd-background text-fd-foreground [--text-primary:var(--color-fd-foreground)]">
          {children}
        </div>
      </Shell>
      <div className="t_dark bg-fd-background text-fd-foreground [--text-primary:var(--color-fd-foreground)]">
        <HanzoPreFooterCTA surface="hanzo.ai" />
      </div>
      <Footer />
    </>
  );
}
