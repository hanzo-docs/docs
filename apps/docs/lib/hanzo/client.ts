export const searchBackend =
  (process.env.NEXT_PUBLIC_HANZO_SEARCH_BACKEND as 'cloud' | 'meilisearch' | undefined) ??
  'meilisearch';

export const searchEndpoint =
  process.env.NEXT_PUBLIC_HANZO_SEARCH_ENDPOINT ??
  (searchBackend === 'meilisearch'
    ? 'https://search.hanzo.ai'
    : 'https://api.hanzo.ai/v1/search-docs');

export const searchIndex =
  process.env.NEXT_PUBLIC_HANZO_SEARCH_INDEX ?? 'app-docs-hanzo-ai-docs';

export const indexEndpoint =
  process.env.HANZO_SEARCH_INDEX_ENDPOINT ??
  'https://api.hanzo.ai/v1/index-docs';

// Gateway BASE the docs chat widget streams from, CLIENT-SIDE. The @hanzo/ai
// client appends `/v1/chat/completions` itself (never an `/api/` prefix), so
// this is the gateway ROOT — not a full path. Replaces the retired server-route
// RAG proxy (the dead `/v1/chat-docs` name): docs deploys as a static export
// with no server, so the browser calls the real gateway directly.
export const chatEndpoint =
  process.env.NEXT_PUBLIC_HANZO_CHAT_ENDPOINT ?? 'https://api.hanzo.ai';

// WIDGET key (hz_*) for the hanzo-docs org, scoped to chat. Ships in the client
// bundle BY DESIGN (NEXT_PUBLIC) — client-safe and readable, NEVER a server secret
// (hk-/sk-) and NOT an ingest publishable key (pk-, which the gateway rejects for
// completions). The gateway binds this key server-side to its owner org
// (WIDGET_KEY_OWNERS), an enso-only model allowlist (WIDGET_KEY_MODELS), a per-org
// rate limit, and the org's prepaid balance — so a leaked key is capped, never an
// open bill. Answering is balance-gated: the hanzo-docs org wallet must be funded
// for the gateway to bill.
export const chatKey = process.env.NEXT_PUBLIC_HANZO_CHAT_KEY ?? '';

// Generation model on the gateway. `enso` is the Hanzo docs assistant model; the
// docs widget key is bound to it (and only it) server-side via WIDGET_KEY_MODELS.
export const chatModel = process.env.NEXT_PUBLIC_HANZO_CHAT_MODEL ?? 'enso';

// Public, read-only search key for retrieval grounding — like an Algolia
// search-only key: it ships in the static bundle BY DESIGN and can only READ the
// index (never write, never bill inference). The default is the hanzo-docs
// Meilisearch public search key (the active `meilisearch` backend). The cloud
// backend has NO baked-in key: absent NEXT_PUBLIC_HANZO_SEARCH_KEY it resolves to
// '' and retrieveDocs degrades to no-retrieval (fail-secure) rather than firing a
// request with a placeholder credential.
export const publishableKey =
  process.env.NEXT_PUBLIC_HANZO_SEARCH_KEY ??
  (searchBackend === 'meilisearch'
    ? '2d99c3ab7551b807c9b8c132f663eba7e27e765a511907d9a566799497c7fd42'
    : '');

export const adminKey =
  process.env.HANZO_SEARCH_ADMIN_KEY ?? '';
