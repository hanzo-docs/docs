import { Shell } from '@/components/shell';
import 'katex/dist/katex.min.css';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return <Shell>{children}</Shell>;
}
