import type { ReactNode } from 'react';
import Link from 'next/link';
import { Github, MessageSquare, BookOpen } from 'lucide-react';
import { brand } from '../../lib/config';

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-fd-border bg-fd-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg">
            {brand.shortName}
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/docs"
              className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            >
              Browse
            </Link>
            {brand.forumUrl && (
              <a
                href={brand.forumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
              >
                Forum
              </a>
            )}
            {brand.githubRepo && (
              <a
                href={brand.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
              >
                GitHub
              </a>
            )}
          </nav>
        </div>
      </header>

      {children}

      {/* Footer */}
      <footer className="border-t border-fd-border py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-fd-muted-foreground text-sm">
              {brand.name} - Open Governance
            </div>
            <div className="flex items-center gap-6">
              {brand.githubRepo && (
                <a
                  href={brand.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {brand.forumUrl && (
                <a
                  href={brand.forumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                </a>
              )}
              {brand.docsUrl && (
                <a
                  href={brand.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                >
                  <BookOpen className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
