// Brand tokens (monochrome --hanzo-*, --font-size-*, --z-*) load first so the
// Fumadocs theme + Tailwind layers in global.css can override where they meet.
import '@hanzo/brand/styles/variables.css';
import './global.css';
import type { Viewport } from 'next';
import { baseUrl, createMetadata } from '@/lib/metadata';
import { Provider } from './provider';
import type { ReactNode } from 'react';
import { Zen, ZenMono } from '@hanzo/font';
import { TreeProvider } from '@/lib/tree';
import { clientTree } from '@/lib/source';
import { NextProvider } from '@hanzo/docs/core/framework/next';
import { Analytics } from '@hanzo/docs-analytics';

export const metadata = createMetadata({
  title: {
    template: '%s | Hanzo Docs',
    default: 'Hanzo — Documentation',
  },
  description:
    'Documentation for Hanzo AI Cloud — every model, every tool, one key.',
  metadataBase: baseUrl,
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
};

// <html> ships `t_dark`, the default, so a page read before any script runs is
// already themed. The theme script swaps it for the reader's stored choice
// before the first paint, which is why the element does not warn about a class
// it did not render with.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${Zen.variable} ${ZenMono.variable} t_dark`} suppressHydrationWarning>
      <head>
        {/* Google Analytics 4 (G-15XZEQ6G9S) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-15XZEQ6G9S" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-15XZEQ6G9S', {
                linker: {
                  domains: ['hanzo.ai', 'hanzo.id', 'docs.hanzo.ai', 'hanzo.build', 'platform.hanzo.ai', 'pay.hanzo.ai', 'hanzo.app']
                }
              });
            `,
          }}
        />
        {/* Meta Pixel (1790308611893001) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1790308611893001');
              fbq('track', 'PageView');
            `,
          }}
        />
        {/* Hanzo Analytics — first-party privacy-preserving web analytics */}
        <script
          defer
          src="https://analytics.hanzo.ai/script.js"
          data-website-id="a323a8ae-c811-4061-9626-22caaffc612f"
        />
        {/* Hanzo Insights */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.hi=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="hi",u.people=u.people||[],u.toString=function(t){var e="hi";return"hi"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture captureException identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId setPersonProperties".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.hi||[]);
              hi.init('hi_e16a2d5a8033442d87f090b24c606825',{api_host:'https://insights.hanzo.ai',person_profiles:'identified_only'});
              hi.register({app:'docs',org:'hanzo'});
            `,
          }}
        />
      </head>
      <body>
        <Analytics product="docs">
          <NextProvider>
            <TreeProvider tree={clientTree()}>
              <Provider>{children}</Provider>
            </TreeProvider>
          </NextProvider>
        </Analytics>
      </body>
    </html>
  );
}
