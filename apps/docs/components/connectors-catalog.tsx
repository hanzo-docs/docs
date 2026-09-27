'use client';

// Unified connectors catalog — the ONE place to discover everything Hanzo can
// connect to, by how you connect it:
//   · Native connectors — first-party integrations you link once (OAuth2 /
//     GitHub App) in the console: GitHub, GitLab, Slack, Google, Discord, X …
//   · MCP servers — the open Model Context Protocol ecosystem, indexed live
//     from the official registry (registry.modelcontextprotocol.io), connect
//     over streamable-http or a package. Hundreds of servers, always current.
//
// Rendered inline in the docs (never a link-out). Same lazy-island + fd-token
// pattern as <ModelsCatalog/>.
import { useEffect, useMemo, useState } from 'react';
import { Text, XStack, YStack } from '@hanzo/gui';
import { Plug, Boxes, ArrowUpRight } from '@hanzogui/lucide-icons-2';
import { Grid } from '@hanzo/ui/grid';
import { Action } from '@/components/action';
import { Field } from '@/components/field';
import { muted } from '@/lib/ink';

const MCP_REGISTRY = 'https://registry.modelcontextprotocol.io/v0/servers?limit=100';

// First-party connectors — linked once in the console, then callable from the
// unified Hanzo MCP + the gateway. method = how you authorize the connection.
type Native = { id: string; label: string; method: string; blurb: string };
const NATIVE: Native[] = [
  { id: 'github', label: 'GitHub', method: 'GitHub App', blurb: 'Repos, issues, PRs, actions, code search.' },
  { id: 'gitlab', label: 'GitLab', method: 'OAuth2', blurb: 'Projects, merge requests, pipelines, issues.' },
  { id: 'slack', label: 'Slack', method: 'OAuth2', blurb: 'Channels, messages, search, notifications.' },
  { id: 'google', label: 'Google', method: 'OAuth2', blurb: 'Drive, Gmail, Calendar, Sheets.' },
  { id: 'discord', label: 'Discord', method: 'OAuth2', blurb: 'Servers, channels, messages.' },
  { id: 'x', label: 'X', method: 'OAuth2', blurb: 'Post, read, and search on X.' },
];

type McpServer = { name: string; title?: string; description?: string; remotes?: { type: string }[]; packages?: { registryType: string }[] };
type RegItem = { server: McpServer };

function connectVia(s: McpServer): string {
  if (s.remotes?.length) return s.remotes[0].type; // streamable-http / sse
  if (s.packages?.length) return s.packages[0].registryType; // npm / pypi / oci …
  return 'mcp';
}

export function ConnectorsCatalog() {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const loadPage = (cur?: string) => {
    setLoading(true);
    fetch(cur ? `${MCP_REGISTRY}&cursor=${encodeURIComponent(cur)}` : MCP_REGISTRY)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d: { servers: RegItem[]; metadata?: { nextCursor?: string } }) => {
        // The registry lists a server once per published version, so a name is
        // kept once, across pages and within one.
        setServers((prev) => {
          const byName = new Map(prev.map((s) => [s.name, s]));
          for (const { server } of d.servers) if (server.name && !byName.has(server.name)) byName.set(server.name, server);
          return [...byName.values()];
        });
        setCursor(d.metadata?.nextCursor ?? null);
      })
      .catch((e) => setErr(String(e.message || e)))
      .finally(() => setLoading(false));
  };
  useEffect(() => { loadPage(); /* eslint-disable-next-line */ }, []);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return servers;
    return servers.filter((s) => `${s.name} ${s.title} ${s.description}`.toLowerCase().includes(n));
  }, [servers, q]);

  const nativeFiltered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? NATIVE.filter((c) => `${c.label} ${c.method} ${c.blurb}`.toLowerCase().includes(n)) : NATIVE;
  }, [q]);

  return (
    <YStack gap={28}>
      <Field value={q} onChange={setQ} placeholder="Search connectors and MCP servers…" />

      {nativeFiltered.length > 0 && (
        <YStack render="section" gap={10}>
          <Heading icon={<Plug size={16} color="$color12" />} title="Native connectors" note="link once in the console" />
          <Grid columns={{ min: 220 }} gap={8}>
            {nativeFiltered.map((c) => (
              <YStack key={c.id} gap={6} p={12} rounded="$4" borderWidth={1} borderColor="$borderColor" bg="$panel">
                <XStack gap={8} items="center">
                  <Plug size={14} color="$color12" />
                  <Text flex={1} fontSize={14} fontWeight="500" color="$color12">
                    {c.label}
                  </Text>
                  <Badge>{c.method}</Badge>
                </XStack>
                <Text fontSize={14} whiteSpace="normal" {...muted}>
                  {c.blurb}
                </Text>
              </YStack>
            ))}
          </Grid>
        </YStack>
      )}

      {/* MCP servers — live from the official registry */}
      <YStack render="section" gap={10}>
        <Heading
          icon={<Boxes size={16} color="$color12" />}
          title="MCP servers"
          note={servers.length ? `${servers.length}+ indexed · Model Context Protocol registry` : 'loading the registry…'}
        />
        {err ? (
          <Text fontSize={14} whiteSpace="normal" {...muted}>
            Couldn’t reach the MCP registry ({err}). Browse it at{' '}
            <Text render="a" href="https://registry.modelcontextprotocol.io" color="$color12" textDecorationLine="underline">
              registry.modelcontextprotocol.io
            </Text>
            .
          </Text>
        ) : (
          <>
            <YStack rounded="$4" borderWidth={1} borderColor="$borderColor" overflow="hidden">
              {filtered.map((s, i) => (
                <YStack key={s.name} gap={2} p={12} borderTopWidth={i ? 1 : 0} borderColor="$borderColor">
                  <XStack gap={8} items="center">
                    <Text fontSize={14} fontWeight="500" color="$color12" numberOfLines={1}>
                      {s.title || s.name}
                    </Text>
                    <Badge>{connectVia(s)}</Badge>
                  </XStack>
                  <Text fontFamily="$mono" fontSize={12} numberOfLines={1} {...muted}>
                    {s.name}
                  </Text>
                  {s.description ? (
                    <Text fontSize={14} numberOfLines={2} whiteSpace="normal" {...muted}>
                      {s.description}
                    </Text>
                  ) : null}
                </YStack>
              ))}
              {!filtered.length && !loading ? (
                <Text p={16} fontSize={14} {...muted}>
                  No servers match “{q}”.
                </Text>
              ) : null}
            </YStack>
            {!q && cursor ? (
              <XStack>
                <Action tone="line" render="button" type="button" onPress={() => loadPage(cursor)} disabled={loading} opacity={loading ? 0.5 : 1}>
                  <Text fontSize={13} color="$color12">
                    {loading ? 'Loading…' : 'Load more'}
                  </Text>
                  <ArrowUpRight size={13} color="$color12" />
                </Action>
              </XStack>
            ) : null}
          </>
        )}
      </YStack>
    </YStack>
  );
}

function Heading({ icon, title, note }: { icon: React.ReactNode; title: string; note: string }) {
  return (
    <XStack gap={8} items="center" flexWrap="wrap">
      {icon}
      <Text render="h3" fontSize={16} fontWeight="600" color="$color12">
        {title}
      </Text>
      <Text fontSize={12} {...muted}>
        {note}
      </Text>
    </XStack>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <Text fontSize={10} px={6} py={1} rounded={4} borderWidth={1} borderColor="$borderColor" {...muted}>
      {children}
    </Text>
  );
}

export default ConnectorsCatalog;
