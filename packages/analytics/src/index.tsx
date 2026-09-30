'use client';

import { useEffect, type ReactNode } from 'react';
import { startTags } from '@hanzo/event';
import { AnalyticsProvider, useConsent, usePageview } from '@hanzo/event/react';
import { GuiProvider } from '@hanzo/gui';
import guiConfig from '@hanzo/ui/gui-config';
import { Consent } from '@hanzo/ui/consent';
import { usePathname } from 'next/navigation';

export { useAnalytics } from '@hanzo/event/react';
export { EVENTS } from '@hanzo/event';

/** The ONE Hanzo Cloud telemetry front door — POST api.hanzo.ai/v1/event. */
const HOST = 'https://api.hanzo.ai';

/** The sites one visit can cross; GA4 keeps it one session across them. */
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

function Pageview() {
  usePageview(usePathname());
  return null;
}

/**
 * The ad tags. `startTags` fetches this site's tag set from cloud (GA4 and the
 * Pixel are configuration there, never ids in this repo) and the consent rule
 * for this visitor's region, and loads only what consent allows.
 */
function Tags() {
  useEffect(() => startTags({ domains: [window.location.hostname, ...DOMAINS] }), []);
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
 * Errors are events on the same stream (`type: 'error'`). The stream runs while
 * the visitor allows analytics: cloud serves the rule for their region, and
 * <Consent> is the one banner that asks where the region requires it and offers
 * "Cookie settings" everywhere. Its key is the site's own project key, found by host.
 * `product` is the only knob.
 */
export function Analytics({ product = 'docs', children }: { product?: string; children?: ReactNode }) {
  const consent = useConsent();
  return (
    <AnalyticsProvider config={{ product, host: HOST, enabled: consent.analytics }}>
      <Tags />
      <Pageview />
      {children}
      <GuiProvider config={guiConfig as never} defaultTheme="dark">
        <Consent />
      </GuiProvider>
    </AnalyticsProvider>
  );
}
export default Analytics;
