import { Landing } from '@/components/landing';
import { Example } from '@/components/example';
import { Tab, Tabs } from '@/components/mdx/tabs';
import pricing from '@/openapi-specs/pricing.json';
import { quickstart } from '@/lib/landing';
import { alternates } from '@/lib/metadata';

export const metadata = { alternates: alternates('/') };

// The install and first-call tabs are the same two steps /docs/quickstart shows
// (lib/landing), highlighted here on the server so the page ships tokens, not a
// highlighter. Every SDK tab is the catalogue read — the same call the
// quickstart makes.
function Group({ rows }: { rows: readonly (readonly [string, string, string])[] }) {
  return (
    <Tabs items={rows.map(([name]) => name)}>
      {rows.map(([name, lang, code]) => (
        <Tab key={name} value={name}>
          <Example lang={lang} code={code} />
        </Tab>
      ))}
    </Tabs>
  );
}

export default function Page() {
  return <Landing install={<Group rows={quickstart.install} />} use={<Group rows={quickstart.use} />} catalogue={pricing.catalogue} />;
}
