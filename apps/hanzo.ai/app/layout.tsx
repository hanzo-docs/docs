import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'Hanzo AI - Unified AI Platform',
    template: '%s | Hanzo AI',
  },
  description: 'Build AI-powered applications with the unified AI platform. LLM Gateway, AI Agents, Desktop App, and more.',
  metadataBase: new URL('https://hanzo.ai'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hanzo.ai',
    siteName: 'Hanzo AI',
    title: 'Hanzo AI - Unified AI Platform',
    description: 'Build AI-powered applications with the unified AI platform.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hanzo AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hanzo AI - Unified AI Platform',
    description: 'Build AI-powered applications with the unified AI platform.',
    images: ['/og-image.png'],
    creator: '@hanzoai',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
