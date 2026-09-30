import { Landing } from '@/components/landing';
import { Example } from '@/components/example';
import { Tab, Tabs } from '@/components/mdx/tabs';

// The install and first-call tabs are the same two steps /docs/quickstart shows,
// highlighted here on the server so the page ships tokens, not a highlighter.
// Every SDK tab is the catalogue read — the same call the quickstart makes.
const install = [
  ['npm', 'bash', 'npm i -g hanzo'],
  ['Script', 'bash', 'curl -fsSL hanzo.sh | sh'],
  ['Homebrew', 'bash', 'brew install hanzoai/tap/hanzo'],
  ['From source', 'bash', 'git clone https://github.com/hanzoai/cli && cd cli && cargo install --path .'],
] as const;

const use = [
  ['CLI', 'bash', `hanzo auth login\n\nhanzo "explain quantum computing"\nhanzo models list\nhanzo projects deploy my-app`],
  ['TypeScript', 'typescript', `// npm i hanzoai\nimport { AiApi, Configuration } from 'hanzoai'\n\nconst ai = new AiApi(new Configuration())\n\nconst { data } = await ai.getModels()\nconsole.log(data.data?.length, 'models')`],
  ['Python', 'python', `# pip install hanzoai\nfrom hanzoai.cloud import AiApi, ApiClient, Configuration\n\nai = AiApi(ApiClient(Configuration()))\n\nprint(len(ai.get_models().data or []), "models")`],
  ['Go', 'go', `// go get github.com/hanzoai/go-sdk/v8\nimport hanzoai "github.com/hanzoai/go-sdk/v8"\n\nclient := hanzoai.NewAPIClient(hanzoai.NewConfiguration())\n\nmodels, _, err := client.AiAPI.GetModels(ctx).Execute()`],
  ['Rust', 'rust', `// cargo add hanzo-client\nuse hanzo_client::apis::{ai_api, configuration::Configuration};\n\nlet cfg = Configuration::new();\n\nlet models = ai_api::get_models(&cfg).await?;`],
  ['HTTP', 'bash', `curl https://api.hanzo.ai/v1/chat/completions \\\n  -H "Authorization: Bearer $HANZO_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"model":"zen6","messages":[{"role":"user","content":"Hello!"}]}'`],
] as const;

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
  return <Landing install={<Group rows={install} />} use={<Group rows={use} />} />;
}
