'use client';

// Live model catalog + pricing, rendered inline in the docs (never a link-out).
// Fetches the real gateway catalog at runtime so a static export always shows
// the current models/prices without a rebuild. Grouped by family, searchable,
// theme-aware via Fumadocs fd-* tokens.
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Text, XStack, YStack } from '@hanzo/gui';
import { Field } from '@/components/field';
import { Copy, Check, Cpu, Sparkle, Zap, Box } from '@hanzogui/lucide-icons-2';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/mdx/prose';
import { muted } from '@/lib/ink';
import { PROVIDER_ICONS, providerKey } from '@/components/provider-icons';

const ENDPOINT = 'https://api.hanzo.ai/v1/models';

// `prompt`/`completion` are USD per token (OpenRouter's keys); the per-million
// rates sit under keys that name the unit.
type Pricing = { prompt?: string; completion?: string; input_per_million?: number; output_per_million?: number };
type Model = {
  id: string;
  name: string;
  fullName?: string;
  description?: string;
  features?: string[];
  tier?: string;
  // The catalogue names this `context_window`, and carries it per model rather
  // than on every row — read it, do not assume it.
  context_window?: number | null;
  supports_tools?: boolean;
  supports_vision?: boolean;
  pricing?: Pricing;
  provider?: string;
  owned_by?: string;
};
type Family = { id: string; name: string; description?: string; icon?: string; models: string[] };
type Catalog = { data: Model[]; families?: Family[]; summary?: Record<string, number>; updated?: string };

const FAMILY_ICON: Record<string, typeof Sparkle> = { Sparkle, Zap, Cpu, Box };

// The models trained here, and what to call their group. `owned_by` is the
// catalogue's raw key; these are the names we use for them.
const OURS: Record<string, string> = { hanzo: 'Hanzo', zenlm: 'Zen' };

// Prices shown are USD per 1M tokens.
function price(v: number | null | undefined): string {
  if (v == null) return '—';
  if (v === 0) return 'Free';
  return `$${v < 1 ? v.toFixed(3).replace(/0+$/, '').replace(/\.$/, '') : v.toFixed(2)}`;
}
function ctx(n: number | null | undefined): string {
  if (!n) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

// Provider identity chip — a stable, self-contained monogram (no external logo
// assets, so it works in a static export and every group renders uniformly). The
// tint is derived deterministically from the name, so a provider always reads
// the same color across sessions. currentColor-free HSL keeps it legible in
// both themes.
function hashHue(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 360;
}
function initials(name: string): string {
  const words = name.replace(/[^\p{L}\p{N} ]/gu, ' ').trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 2).toUpperCase() || '?';
}
function ProviderChip({ name }: { name: string }) {
  const svg = PROVIDER_ICONS[providerKey(name)];
  if (svg)
    return (
      <XStack
        aria-hidden
        width={18}
        height={18}
        shrink={0}
        color="$color12"
        dangerouslySetInnerHTML={{ __html: svg.replace('<svg', '<svg width="100%" height="100%"') }}
      />
    );
  const hue = hashHue(name.toLowerCase());
  return (
    <XStack aria-hidden width={20} height={20} shrink={0} rounded={4} items="center" justify="center" style={{ background: `hsl(${hue} 55% 92%)` }}>
      <Text fontSize={9} fontWeight="600" style={{ color: `hsl(${hue} 60% 32%)` }}>
        {initials(name)}
      </Text>
    </XStack>
  );
}

function CopyId({ id }: { id: string }) {
  const [done, setDone] = useState(false);
  return (
    <XStack
      render="button"
      type="button"
      title="Copy model id"
      onPress={() => {
        navigator.clipboard?.writeText(id).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1200);
        });
      }}
      gap={6}
      items="center"
      bg="transparent"
      borderWidth={0}
      p={0}
      cursor="pointer"
    >
      <Text fontFamily="$mono" fontSize={12} {...muted}>
        {id}
      </Text>
      {done ? <Check size={12} color="$green10" /> : <Copy size={12} color="$color9" />}
    </XStack>
  );
}

function capabilities(m: Model): string[] {
  if (m.features?.length) return m.features;
  const out: string[] = [];
  if (m.supports_tools) out.push('tools');
  if (m.supports_vision) out.push('vision');
  return out;
}

function ModelRow({ m }: { m: Model }) {
  const p = m.pricing;
  return (
    <Tr>
      <Td>
        <YStack gap={2} items="flex-start">
          <Text fontSize={14} fontWeight="500" color="$color12">
            {m.fullName || m.name || m.id}
          </Text>
          <XStack gap={8} items="center" flexWrap="wrap">
            <CopyId id={m.id} />
            {m.tier ? (
              <Text fontSize={11} fontWeight="500" px={6} rounded={4} bg="$hover" color="$color12">
                {m.tier}
              </Text>
            ) : null}
          </XStack>
        </YStack>
      </Td>
      <Td align="right">{ctx(m.context_window)}</Td>
      <Td align="right">{price(p?.input_per_million)}</Td>
      <Td align="right">{price(p?.output_per_million)}</Td>
      <Td align="right">
        <XStack gap={4} flexWrap="wrap" justify="flex-end">
          {capabilities(m).slice(0, 4).map((f) => (
            <Text key={f} fontSize={10} px={6} py={1} rounded={4} borderWidth={1} borderColor="$borderColor" {...muted}>
              {f}
            </Text>
          ))}
        </XStack>
      </Td>
    </Tr>
  );
}

/** `request` is the call to read the catalogue with your own key, highlighted by
 *  the page (an `Example`); it is shown only when the live fetch fails. */
export function ModelsCatalog({ request }: { request?: ReactNode }) {
  const [cat, setCat] = useState<Catalog | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    let live = true;
    fetch(ENDPOINT)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d: Catalog) => live && setCat(d))
      .catch((e) => live && setErr(String(e.message || e)));
    return () => {
      live = false;
    };
  }, []);

  const groups = useMemo(() => {
    if (!cat) return [];
    const byId = new Map(cat.data.map((m) => [m.id, m]));
    const claimed = new Set<string>();
    const fams = (cat.families ?? []).map((f) => {
      const models = f.models.map((id) => byId.get(id)).filter(Boolean) as Model[];
      models.forEach((m) => claimed.add(m.id));
      return { ...f, resolved: models };
    });
    // Everything not in a curated family groups by who trained it, so the rest
    // of the catalogue reads as sections instead of one wall of rows. Our own
    // families lead: sorting purely by model count would bury `hanzo` and
    // `zenlm` under whichever outside lab happens to ship the most ids.
    const rest = cat.data.filter((m) => !claimed.has(m.id));
    const byOwner = new Map<string, Model[]>();
    for (const m of rest) {
      const p = m.owned_by || m.provider || 'Other';
      (byOwner.get(p) ?? byOwner.set(p, []).get(p)!).push(m);
    }
    const ours = Object.keys(OURS);
    [...byOwner.entries()]
      .sort((a, b) => {
        const ai = ours.indexOf(a[0]);
        const bi = ours.indexOf(b[0]);
        if (ai !== bi && (ai < 0 || bi < 0)) return ai < 0 ? 1 : -1;
        if (ai >= 0 && bi >= 0) return ai - bi;
        return b[1].length - a[1].length;
      })
      .forEach(([p, models]) =>
        fams.push({
          id: `${OURS[p] ? 'family' : 'provider'}-${p}`,
          name: OURS[p] ?? p,
          icon: OURS[p] ? 'Sparkle' : 'Box',
          models: [],
          resolved: models,
        }),
      );
    const needle = q.trim().toLowerCase();
    if (!needle) return fams.filter((f) => f.resolved.length);
    return fams
      .map((f) => ({
        ...f,
        resolved: f.resolved.filter((m) =>
          `${m.fullName} ${m.name} ${m.id} ${capabilities(m).join(' ')}`.toLowerCase().includes(needle),
        ),
      }))
      .filter((f) => f.resolved.length);
  }, [cat, q]);

  if (err)
    return (
      <YStack gap={10} p={16} rounded="$5" borderWidth={1} borderColor="$borderColor" bg="$panel">
        <Text fontSize={14} lineHeight={22} whiteSpace="normal" {...muted}>
          Couldn’t load the live catalog ({err}). GET /v1/models requires a bearer token, and this page has none to
          send — so read it with your own key instead:
        </Text>
        {request}
        <Text render="a" href="/docs/api-keys" fontSize={14} color="$color12" textDecorationLine="underline">
          Mint a key →
        </Text>
      </YStack>
    );
  if (!cat)
    return (
      <YStack gap={8} aria-busy>
        {[0, 1, 2].map((i) => (
          <YStack key={i} height={48} rounded="$3" bg="$hover" />
        ))}
      </YStack>
    );

  const s = cat.summary ?? {};
  return (
    <YStack gap={24}>
      <XStack gap={12} justify="space-between" items="center" flexWrap="wrap">
        <XStack gap={16} flexWrap="wrap" items="center">
          <Text fontSize={14} fontWeight="500" color="$color12">
            {s.totalModels ?? cat.data.length} models
          </Text>
          {s.zenModels ? <Text fontSize={14} {...muted}>{s.zenModels} Zen</Text> : null}
          {s.ensoModels ? <Text fontSize={14} {...muted}>{s.ensoModels} Enso</Text> : null}
          {cat.updated ? (
            <Text fontSize={14} {...muted}>
              updated {DAY.format(new Date(cat.updated))}
            </Text>
          ) : null}
        </XStack>
        <Field value={q} onChange={setQ} placeholder="Filter models…" width={260} />
      </XStack>

      {groups.map((f) => {
        const isProvider = f.id.startsWith('provider-');
        const Icon = FAMILY_ICON[f.icon ?? ''] ?? Box;
        return (
          <YStack key={f.id} render="section" gap={8}>
            <XStack gap={8} items="center">
              {isProvider ? <ProviderChip name={f.name} /> : <Icon size={16} color="$color12" />}
              <Text render="h3" fontSize={16} fontWeight="600" color="$color12">
                {f.name}
              </Text>
              <Text fontSize={12} {...muted}>
                ({f.resolved.length})
              </Text>
            </XStack>
            {f.description ? (
              <Text fontSize={14} whiteSpace="normal" {...muted}>
                {f.description}
              </Text>
            ) : null}
            <Table>
              <Thead>
                <Tr>
                  <Th>Model</Th>
                  <Th align="right">Context</Th>
                  <Th align="right">Input /1M</Th>
                  <Th align="right">Output /1M</Th>
                  <Th align="right">Capabilities</Th>
                </Tr>
              </Thead>
              <Tbody>
                {f.resolved.map((m) => (
                  <ModelRow key={m.id} m={m} />
                ))}
              </Tbody>
            </Table>
          </YStack>
        );
      })}
      {!groups.length ? (
        <Text fontSize={14} {...muted}>
          No models match “{q}”.
        </Text>
      ) : null}
    </YStack>
  );
}

// Fixed locale and zone, so every reader sees the same date for the same data.
const DAY = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });

export default ModelsCatalog;
