import { Shell } from '@/components/shell';

// The landing page carries the SAME chrome as /docs — rail, tree, bar — because
// it is where a reader does not yet know what is here, and the tree is the
// table of contents.
export default function Layout({ children }: LayoutProps<'/'>) {
  return <Shell>{children}</Shell>;
}
