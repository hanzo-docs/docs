'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { createAiClient, type ChatCompletionMessage, type Tool } from '@hanzo/ai';
import type { z } from 'zod';
import type { ProvideLinksToolSchema } from '@/lib/ai/qa-schema';
import { chatEndpoint, chatKey, chatModel } from '@/lib/hanzo/client';
import { retrieveDocs, type DocHit } from '@/lib/hanzo/retrieve';

// Client-side chat for the docs AISearch widget. docs.hanzo.ai deploys as a
// STATIC export (hanzoai/static) with no server, so the retired `/api/chat`
// route can never run in prod. This hook streams straight from the Hanzo
// gateway (`POST {chatEndpoint}/v1/chat/completions`, model `enso`) using our
// own headless SDK (@hanzo/ai `createAiClient`) with a PUBLISHABLE key — never a
// server secret. It presents the exact surface the widget already consumes
// (messages/status/sendMessage/regenerate/stop/setMessages), so the bespoke
// provideLinks/sources UI is untouched.
//
// GROUNDING: before generating, we retrieve the most relevant doc pages for the
// question from the native search index (retrieveDocs) and fold them into the
// system turn, so answers are grounded in the shipped docs and cite real pages.
// Retrieval hits Meilisearch (not the billed gateway), so it works even before
// the chat wallet is funded; when it returns nothing, we answer ungrounded.

export type ChatStatus = 'ready' | 'submitted' | 'streaming' | 'error';

// Reuse the ONE links contract the UI already renders (from the tool schema).
type Links = z.infer<typeof ProvideLinksToolSchema>['links'];

export type ChatPart =
  | { type: 'text'; text: string }
  | { type: 'tool-provideLinks'; input: { links: Links } }
  | { type: 'data-client'; data: { location: string } };

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  parts: ChatPart[];
}

export interface HanzoChat {
  messages: ChatMessage[];
  status: ChatStatus;
  sendMessage: (message: { role: 'user'; parts: ChatPart[] }) => void;
  regenerate: () => void;
  stop: () => void;
  setMessages: (messages: ChatMessage[]) => void;
}

const SYSTEM_PROMPT =
  'You are Hanzo Docs AI, the assistant for the Hanzo AI Cloud documentation. ' +
  'Answer questions about Hanzo products, APIs, SDKs, and self-hosting concisely ' +
  'and accurately. Cite the documentation pages you draw on by calling the ' +
  'provideLinks tool with their URLs. If you are unsure, say so plainly and ' +
  'point to the closest relevant section — never invent APIs, flags, or endpoints.';

// The model-facing contract for citations. Kept as a clean JSON Schema (the zod
// `ProvideLinksToolSchema` is deliberately loose because it PARSES untrusted
// model output; this is what we ASK the model to produce). Shape matches the
// source cards the widget renders (label / url / title).
const provideLinksTool: Tool = {
  type: 'function',
  function: {
    name: 'provideLinks',
    description:
      'Cite the Hanzo documentation pages used to answer. Call once with every ' +
      'source URL referenced in the answer.',
    parameters: {
      type: 'object',
      properties: {
        links: {
          type: 'array',
          description: 'The documentation pages cited in the answer.',
          items: {
            type: 'object',
            properties: {
              label: { type: 'string', description: 'Footnote label, e.g. "1".' },
              url: { type: 'string', description: 'Absolute URL of the doc page.' },
              title: { type: 'string', description: 'Human-readable page title.' },
            },
            required: ['url'],
          },
        },
      },
      required: ['links'],
    },
  },
};

function partsToText(parts: ChatPart[]): string {
  return parts
    .map((p) =>
      p.type === 'text'
        ? p.text
        : p.type === 'data-client'
          ? `[Current page: ${p.data.location}]\n\n`
          : '',
    )
    .join('')
    .trim();
}

// Fold the retrieved docs into the system turn. With context, the model is told
// to ground strictly in it and cite; with none (index/key not live yet) it
// answers from its own Hanzo knowledge under the base guardrails — degrade
// gracefully, never crash.
function buildSystem(context: string): string {
  if (!context) return SYSTEM_PROMPT;
  return (
    SYSTEM_PROMPT +
    '\n\nGround your answer in the Hanzo documentation context below and cite the ' +
    'pages you use by calling provideLinks with their URLs. If the context does ' +
    'not cover the question, say so plainly and point to the closest section.\n\n' +
    '--- Hanzo documentation context ---\n' +
    context +
    '\n--- end context ---'
  );
}

function toCompletionMessages(history: ChatMessage[], context: string): ChatCompletionMessage[] {
  const turns: ChatCompletionMessage[] = history
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: partsToText(m.parts) }))
    .filter((m) => typeof m.content === 'string' && m.content.length > 0);
  return [{ role: 'system', content: buildSystem(context) }, ...turns];
}

function contextFrom(hits: DocHit[]): string {
  return hits.map((h, i) => `[${i + 1}] ${h.title} (${h.url})\n${h.content}`).join('\n\n');
}

// Retrieved pages become the citation fallback: if the model answers but forgets
// to call provideLinks, we still show the sources we grounded on.
function linksFrom(hits: DocHit[]): Links {
  return hits.map((h, i) => ({ label: String(i + 1), url: h.url, title: h.title }));
}

let seq = 0;
const nextId = () => `msg-${Date.now()}-${seq++}`;

export function useHanzoChat(): HanzoChat {
  const [messages, setMessagesState] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('ready');
  const messagesRef = useRef<ChatMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const commit = useCallback((next: ChatMessage[]) => {
    messagesRef.current = next;
    setMessagesState(next);
  }, []);

  // One client for the widget's lifetime. Missing key → null (fail secure: we
  // surface a config message rather than firing an unauthenticated request).
  const client = useMemo(
    () => (chatKey ? createAiClient({ baseUrl: chatEndpoint, token: chatKey }) : null),
    [],
  );

  const run = useCallback(
    async (history: ChatMessage[]) => {
      if (!client) {
        commit([
          ...history,
          {
            id: nextId(),
            role: 'assistant',
            parts: [
              {
                type: 'text',
                text: 'AI chat is not configured yet. Set `NEXT_PUBLIC_HANZO_CHAT_KEY` to a Hanzo publishable key.',
              },
            ],
          },
        ]);
        setStatus('ready');
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;
      setStatus('submitted');

      const assistantId = nextId();
      let body = '';
      const toolArgs = new Map<number, { name: string; args: string }>();

      // `final` seeds the retrieved pages as citations when the model answered
      // without calling provideLinks — so grounded answers always show sources.
      const render = (fallback?: Links) => {
        const parts: ChatPart[] = [];
        if (body) parts.push({ type: 'text', text: body });
        let hasLinks = false;
        for (const { name, args } of toolArgs.values()) {
          if (name !== 'provideLinks') continue;
          try {
            const parsed = JSON.parse(args) as { links: Links };
            if (parsed?.links?.length) {
              parts.push({ type: 'tool-provideLinks', input: { links: parsed.links } });
              hasLinks = true;
            }
          } catch {
            // Arguments still streaming (incomplete JSON) — render once valid.
          }
        }
        if (!hasLinks && fallback?.length) {
          parts.push({ type: 'tool-provideLinks', input: { links: fallback } });
        }
        commit([...history, { id: assistantId, role: 'assistant', parts }]);
      };

      // Seed an empty assistant turn so the panel shows activity immediately.
      commit([...history, { id: assistantId, role: 'assistant', parts: [] }]);

      // Ground on the native index: retrieve the top pages for the latest turn.
      // Search on the user's TEXT only — the `[Current page: …]` client-context
      // prefix that partsToText adds for the model would only pollute the query.
      // Never fatal — retrieveDocs resolves to [] on any error (answer ungrounded).
      const question = (history.at(-1)?.parts ?? [])
        .map((p) => (p.type === 'text' ? p.text : ''))
        .join(' ')
        .trim();
      const hits = await retrieveDocs(question, 8, controller.signal);
      if (controller.signal.aborted) {
        setStatus('ready');
        return;
      }
      const context = contextFrom(hits);
      const fallbackLinks = linksFrom(hits);

      try {
        const stream = await client.chat.completions.create(
          {
            model: chatModel,
            messages: toCompletionMessages(history, context),
            tools: [provideLinksTool],
            tool_choice: 'auto',
            stream: true,
          },
          { signal: controller.signal },
        );
        setStatus('streaming');
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta;
          if (!delta) continue;
          if (delta.content) body += delta.content;
          for (const call of delta.tool_calls ?? []) {
            const cur = toolArgs.get(call.index) ?? { name: '', args: '' };
            if (call.function?.name) cur.name = call.function.name;
            if (call.function?.arguments) cur.args += call.function.arguments;
            toolArgs.set(call.index, cur);
          }
          render();
        }
        render(fallbackLinks);
        setStatus('ready');
      } catch {
        if (controller.signal.aborted) {
          setStatus('ready');
          return;
        }
        // Fail closed: never leak gateway internals to the client.
        commit([
          ...history,
          {
            id: assistantId,
            role: 'assistant',
            parts: [{ type: 'text', text: 'Chat is temporarily unavailable. Please try again in a moment.' }],
          },
        ]);
        setStatus('error');
      } finally {
        abortRef.current = null;
      }
    },
    [client, commit],
  );

  const sendMessage = useCallback(
    (message: { role: 'user'; parts: ChatPart[] }) => {
      const next = [...messagesRef.current, { id: nextId(), role: 'user' as const, parts: message.parts }];
      commit(next);
      void run(next);
    },
    [commit, run],
  );

  const regenerate = useCallback(() => {
    const msgs = messagesRef.current;
    let lastUser = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'user') {
        lastUser = i;
        break;
      }
    }
    if (lastUser === -1) return;
    const history = msgs.slice(0, lastUser + 1);
    commit(history);
    void run(history);
  }, [commit, run]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, status, sendMessage, regenerate, stop, setMessages: commit };
}
