import type { ReactNode } from 'react';

// TODO: Import Navbar and Footer after migration
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* <Navbar /> */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-sm border-b border-neutral-800 flex items-center justify-between px-6">
        <a href="/" className="text-xl font-bold">
          Hanzo AI
        </a>
        <div className="flex items-center gap-4">
          <a href="/pricing" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Pricing
          </a>
          <a href="/docs" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Docs
          </a>
          <a
            href="https://app.hanzo.ai"
            className="text-sm px-4 py-2 bg-white text-black rounded-full hover:bg-neutral-200 transition-colors"
          >
            Get Started
          </a>
        </div>
      </nav>

      <main className="pt-16">
        {children}
      </main>

      {/* <Footer /> */}
      <footer className="border-t border-neutral-800 py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-neutral-400">
              © {new Date().getFullYear()} Hanzo AI, Inc. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="/terms" className="text-sm text-neutral-400 hover:text-white transition-colors">Terms</a>
              <a href="/privacy" className="text-sm text-neutral-400 hover:text-white transition-colors">Privacy</a>
              <a href="/security" className="text-sm text-neutral-400 hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
