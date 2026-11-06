import { Shell } from '@/components/shell';

// The blog sits in the same chrome as the docs: one rail, one bar, one way to
// find anything from any page.
export default function Layout({ children }: LayoutProps<'/'>) {
  return <Shell>{children}</Shell>;
}
