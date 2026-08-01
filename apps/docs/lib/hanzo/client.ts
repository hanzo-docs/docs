// Hanzo Cloud, as the browser reaches it. Search is NOT here: the docs are a
// static export and carry their own corpus (app/v1/search), so nothing on this
// site queries a search service or holds a key for one.

// Gateway BASE the docs chat widget streams from, CLIENT-SIDE. The @hanzo/ai
// client appends `/v1/chat/completions` itself (never an `/api/` prefix), so
// this is the gateway ROOT — not a full path. Replaces the retired server-route
// RAG proxy (the dead `/v1/chat-docs` name): docs deploys as a static export
// with no server, so the browser calls the real gateway directly.
export const chatEndpoint =
  process.env.NEXT_PUBLIC_HANZO_CHAT_ENDPOINT ?? 'https://api.hanzo.ai';

// Publishable key (pk-*) for the hanzo-docs org, scoped to chat. Ships in the
// client bundle BY DESIGN (NEXT_PUBLIC) — never a server secret. Answering is
// balance-gated: the hanzo-docs org wallet must be funded for the gateway to bill.
export const chatKey = process.env.NEXT_PUBLIC_HANZO_CHAT_KEY ?? '';

// Generation model on the gateway. `enso` is the Hanzo docs assistant model.
export const chatModel = process.env.NEXT_PUBLIC_HANZO_CHAT_MODEL ?? 'enso';
