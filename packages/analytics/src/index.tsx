'use client';

import { useEffect, type ReactNode } from 'react';
import { keyForPage } from '@hanzo/event';
import { AnalyticsProvider, usePageview, useAnalytics } from '@hanzo/event/react';
import { usePathname } from 'next/navigation';

export { useAnalytics } from '@hanzo/event/react';
export { EVENTS } from '@hanzo/event';

/** The ONE Hanzo Cloud telemetry front door — POST api.hanzo.ai/v1/event. */
const HOST = 'https://api.hanzo.ai';

/** Google Analytics 4 Measurement ID for docs.hanzo.ai */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-15XZEQ6G9S';

/** Meta / Facebook Pixel ID */
const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '1790308611893001';

/** Cross-domain session linker */
const DOMAINS = [
  'hanzo.ai',
  'docs.hanzo.ai',
  'hanzo.id',
  'hanzo.build',
  'platform.hanzo.ai',
  'hanzo.app',
  'hanzo.chat',
  'pay.hanzo.ai',
];

/** Publishable ingest key */
const INGEST_KEY =
  process.env.NEXT_PUBLIC_PUBLISHABLE_KEY?.trim() ||
  keyForPage() ||
  'pk-CmfLA2K6kvsPflrS9DSkt06H_kSoQB_21sjedt6VJdc';

/** Sentry DSN for error and span trace capture */
const EVENT_DSN =
  process.env.NEXT_PUBLIC_HANZO_EVENT_DSN ||
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  'https://pub-sentry@sentry.hanzo.ai/1';

function consented(): boolean {
  if (typeof navigator === 'undefined') return true;
  const nav = navigator as Navigator & {
    globalPrivacyControl?: boolean;
    doNotTrack?: string | null;
  };
  if (nav.globalPrivacyControl === true) return false;
  const dnt = nav.doNotTrack;
  return dnt !== '1' && dnt !== 'yes';
}

function Pageview() {
  const pathname = usePathname();
  usePageview(pathname);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // GA4 pageview
    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      fbq?: (...args: unknown[]) => void;
      hi?: { capture: (event: string, properties?: Record<string, unknown>) => void };
    };

    if (w.gtag) {
      w.gtag('event', 'page_view', {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }

    // Meta Pixel pageview
    if (w.fbq) {
      w.fbq('track', 'PageView');
    }

    // Hanzo Insights pageview
    if (w.hi) {
      w.hi.capture('$pageview', {
        $current_url: window.location.href,
        pathname,
      });
    }
  }, [pathname]);

  return null;
}

function ExternalTags() {
  useEffect(() => {
    if (typeof window === 'undefined' || !consented()) return;

    const w = window as any;

    // 1. Google Analytics (gtag.js)
    if (!w.dataLayer) {
      w.dataLayer = [];
      w.gtag = function () {
        w.dataLayer.push(arguments);
      };
      w.gtag('js', new Date());
      w.gtag('config', GA_ID, {
        linker: { domains: DOMAINS },
        send_page_view: false, // Pageview handled on route change
      });

      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(gaScript);
    }

    // 2. Meta Pixel (fbevents.js)
    if (!w.fbq) {
      const fbq: any = function () {
        fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
      };
      if (!w._fbq) w._fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
      w.fbq = fbq;

      w.fbq('init', PIXEL_ID);

      const fbScript = document.createElement('script');
      fbScript.async = true;
      fbScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(fbScript);
    }

    // 3. Hanzo Insights (PostHog-compatible)
    if (!w.hi) {
      (function (t: any, e: any) {
        var o: any, n: any, p: any, r: any;
        e.__SV ||
          ((window as any).hi = e),
          (e._i = []),
          (e.init = function (i: any, s: any, a: any) {
            function g(t: any, e: any) {
              var o = e.split('.');
              2 == o.length && ((t = t[o[0]]), (e = o[1])),
                (t[e] = function () {
                  t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                });
            }
            ((p = t.createElement('script')).type = 'text/javascript'),
              (p.crossOrigin = 'anonymous'),
              (p.async = !0),
              (p.src = s.api_host + '/static/array.js'),
              (r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(p, r);
            var u = e;
            for (
              void 0 !== a ? (u = e[a] = []) : (a = 'hi'),
                u.people = u.people || [],
                u.toString = function (t: any) {
                  var e = 'hi';
                  return 'hi' !== a && (e += '.' + a), t || (e += ' (stub)'), e;
                },
                u.people.toString = function () {
                  return u.toString(1) + '.people (stub)';
                },
                o =
                  'init capture captureException identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId setPersonProperties'.split(
                    ' ',
                  ),
                n = 0;
              n < o.length;
              n++
            )
              g(u, o[n]);
            e._i.push([i, s, a]);
          }),
          (e.__SV = 1);
      })(document, (window as any).hi || []);

      w.hi?.init('hi_e16a2d5a8033442d87f090b24c606825', {
        api_host: 'https://insights.hanzo.ai',
        person_profiles: 'identified_only',
      });
      w.hi?.register({ app: 'docs', org: 'hanzo' });
    }

    // 4. Hanzo Analytics native script
    if (!document.querySelector('script[src*="analytics.hanzo.ai/script.js"]')) {
      const umScript = document.createElement('script');
      umScript.defer = true;
      umScript.src = 'https://analytics.hanzo.ai/script.js';
      umScript.setAttribute('data-website-id', 'a323a8ae-c811-4061-9626-22caaffc612f');
      document.head.appendChild(umScript);
    }

    // 5. Global interaction listeners for docs
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('pre, code, [data-code]')) {
        w.gtag?.('event', 'copy_code', { page_location: window.location.href });
        w.hi?.capture('code_copied', { url: window.location.href });
      }
    };

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.href;
      if (href.includes('hanzo.ai') && (href.includes('/pricing') || href.includes('/login') || href.includes('/signup') || href.includes('/pay'))) {
        w.gtag?.('event', 'begin_checkout', { link_url: href });
        w.fbq?.('track', 'InitiateCheckout', { content_name: 'docs_cta' });
        w.hi?.capture('checkout_started', { cta: 'docs_link', href });
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
}

/**
 * Telemetry for a Hanzo docs site — mount once in the root layout, around the
 * app when a page sends events of its own (`useAnalytics` from @hanzo/event/react):
 *
 *     <Analytics product="docs">{app}</Analytics>
 *
 * The provider owns the ONE @hanzo/event client: it fires the first pageview,
 * registers auto error capture (window.onerror + unhandledrejection), and flushes
 * the batch on unload; <Pageview> adds one pageview per client-side route change.
 * Errors are just events on the same stream, so there is no separate DSN. Nothing
 * here is docs-specific except the default host and consent gate — `product` is
 * the only knob, because Cloud derives everything else server-side.
 */
export function Analytics({ product = 'docs', children }: { product?: string; children?: ReactNode }) {
  return (
    <AnalyticsProvider
      config={{
        product,
        host: HOST,
        dsn: EVENT_DSN,
        ingestKey: INGEST_KEY,
        enabled: consented(),
      }}
    >
      <ExternalTags />
      <Pageview />
      {children}
    </AnalyticsProvider>
  );
}
export default Analytics;
