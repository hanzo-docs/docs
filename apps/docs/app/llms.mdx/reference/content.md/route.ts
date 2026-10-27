import { twin } from '@/lib/markdown';

// /reference as Markdown. That page (public/reference/index.html) draws the
// published OpenAPI document in the browser, so its twin says where the
// document and the same reference as pages are. scripts/twins.ts copies it to
// /reference.md.
export const revalidate = false;

const body = `The interactive reference draws the OpenAPI document in the browser. Read the same reference as Markdown instead:

- [Every capability, one page each, and one page per operation](https://docs.hanzo.ai/docs/openapi.md)
- [The capability index](https://api.hanzo.ai/v1): every capability's name, route and description.
- [The OpenAPI document](https://api.hanzo.ai/v1/openapi.json), generated from the API itself. It is large: ask for one capability with \`?capability=<name>\` or one operation with \`?operation=<operationId>\`.`;

export function GET() {
  return new Response(
    twin({
      title: 'Hanzo API Reference',
      description: 'The full REST API reference for the Hanzo Open AI Cloud — every /v1 endpoint across all services, one key, generated from the OpenAPI 3.1 spec.',
      url: '/reference',
      body,
    }),
    { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } },
  );
}
