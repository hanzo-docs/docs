import { RootProvider } from '@hanzo/docs/ui/provider/next';
import './global.css';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
