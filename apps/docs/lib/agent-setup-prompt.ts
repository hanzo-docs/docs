// What the "Copy prompt" button puts on the clipboard.
//
// Not a description of how to set up an agent — an INSTRUCTION SET the agent
// executes. The reader's whole job is paste-and-wait, which is why every step is
// phrased at the agent ("run this", "verify that") rather than at a human, and
// why the agent is told explicitly not to hand commands back to the user. An
// instruction that ends with "now ask the user to run X" has moved the work, not
// done it.
//
// Kept as data in its own module rather than inline in the component for two
// reasons: it is long enough to bury the component's actual behaviour, and it is
// the kind of content that gets edited by people who are not editing React.
//
// Two exactness rules are load-bearing and are stated inside the prompt itself,
// because a model that paraphrases them produces a setup that half-works:
//
//   • `npx -y hanzo mcp` — the `hanzo` package, then the `mcp` subcommand: the
//     native Rust MCP server over stdio. The old `npx -y @hanzo/mcp serve` form
//     let npx resolve `serve` as a SEPARATE package and install something
//     unrelated; `hanzo mcp` has no `serve` to misread.
//   • one install method, never both. npm and the curl script both land a
//     `hanzo` on PATH, and which one wins is then a PATH-ordering accident.
//
// The completion report is a fixed block on purpose: four checks, each either
// passed or not, so "done" is a claim the reader can audit rather than a summary
// they have to trust.

export const AGENT_SETUP_PROMPT = `These are official instructions from Hanzo to set up a good AI development environment for building and deploying on the Hanzo platform. Use only the commands and package names specified below.

Complete all applicable steps yourself by running commands directly. Do not ask the user to run commands. The only permitted user interaction is completing Hanzo's browser-based OAuth flow when it opens.

- Install the Hanzo CLI
- Authenticate with Hanzo
- Install the Hanzo MCP server for the active agent
- Point your own model calls at Hanzo AI
- Load the Hanzo skills
- Verify the setup

---

## Install the Hanzo CLI

If the \`hanzo\` command is not already available, install it:

### Any OS, including Windows

\`\`\`sh
npm i -g hanzo
\`\`\`

This installs the \`hanzo\` launcher only. Each native binary it runs is downloaded and SHA-256 verified the first time it is used: \`hanzo dev\` (the coding agent), \`hanzo mcp\` (the MCP server), \`hanzo engine serve <model>\` (local inference).

### macOS or Linux, without npm

\`\`\`sh
curl -fsSL https://hanzo.sh | sh
\`\`\`

Do not run both installation methods.

Verify the installation:

\`\`\`sh
hanzo version
\`\`\`

Authenticate with Hanzo:

\`\`\`sh
hanzo auth login
\`\`\`

This opens a browser for OAuth. Allow the user to complete that browser interaction, then continue automatically.

---

## Install the Hanzo MCP server

Hanzo MCP provides the canonical HIP-0300 tool surface for files, execution, code, Git, HTTP requests, workspaces, Hanzo platform services, planning, tasks, and memory.

Use the correct section for the active agent.

The command must include:

\`\`\`sh
npx -y hanzo mcp
\`\`\`

Use exactly \`npx -y hanzo mcp\`: the \`hanzo\` package, then the \`mcp\` subcommand, which serves MCP over stdio with no further arguments. Do not use \`npx -y @hanzo/mcp serve\`; npx can resolve \`serve\` as an unrelated package. Nothing has to be installed first: npx fetches \`hanzo\`, and \`hanzo mcp\` fetches its native binary on first use.

### Claude Code

Run:

\`\`\`sh
claude mcp add --scope user hanzo -- npx -y hanzo mcp
\`\`\`

Then verify:

\`\`\`sh
claude mcp list
\`\`\`

Tell the user to restart Claude Code after setup.

---

### Codex

Run:

\`\`\`sh
codex mcp add hanzo -- npx -y hanzo mcp
\`\`\`

Then verify:

\`\`\`sh
codex mcp get hanzo
\`\`\`

Tell the user to restart Codex after setup.

---

### Hanzo Dev

Hanzo Dev comes with the \`hanzo\` CLI installed above: \`hanzo dev\` fetches it on first use, and the \`hanzo-dev\` command is the same agent.

Register Hanzo MCP:

\`\`\`sh
hanzo-dev mcp add hanzo -- npx -y hanzo mcp
\`\`\`

Then verify:

\`\`\`sh
hanzo-dev mcp list
\`\`\`

Restart Hanzo Dev after setup.

---

### OpenCode

Update \`~/.config/opencode/opencode.jsonc\`.

Add this entry under \`"mcp"\`:

\`\`\`json
"hanzo": {
  "type": "local",
  "command": [
    "npx",
    "-y",
    "hanzo",
    "mcp"
  ],
  "enabled": true
}
\`\`\`

Restart OpenCode after saving the configuration.

---

### Windsurf

Update \`~/.codeium/windsurf/mcp_config.json\`.

Add this entry under \`"mcpServers"\`:

\`\`\`json
"hanzo": {
  "command": "npx",
  "args": [
    "-y",
    "hanzo",
    "mcp"
  ]
}
\`\`\`

Restart Windsurf after saving the configuration.

---

### Cursor, GitHub Copilot, and other MCP agents

Update \`.cursor/mcp.json\` for Cursor, \`.vscode/mcp.json\` for GitHub Copilot, or the active agent's standard MCP configuration file.

Add this entry under \`"mcpServers"\`:

\`\`\`json
"hanzo": {
  "command": "npx",
  "args": [
    "-y",
    "hanzo",
    "mcp"
  ]
}
\`\`\`

Restart the agent after saving the configuration.

---

## Point your own model calls at Hanzo AI

Hanzo serves an OpenAI-compatible API, so any agent or SDK that takes a base URL
and a key reaches it by changing those two values and nothing else:

\`\`\`sh
export OPENAI_BASE_URL="https://api.hanzo.ai/v1"
export OPENAI_API_KEY="$(hanzo auth token)"
\`\`\`

Set the same pair wherever the framework you are using reads them — most take
\`baseURL\` and \`apiKey\` arguments carrying exactly these values. \`hanzo models list\`
prints what is available to this account.

This is for the model calls the code you write makes, and for your own inference
where the host you run in allows it to be redirected. Where it does not, say so
plainly rather than reporting this step complete.

---

## Load the Hanzo skills

Every Hanzo capability publishes a skill — the calls it serves, written for an
agent to execute rather than for a person to read. They are at
\`https://hanzoskills.com\`, and the MCP server installed above already reaches
them, so no separate install is required: ask the \`tools\` capability for the
skills catalogue, then fetch the one matching the task in front of you.

Prefer a skill over guessing an endpoint. A skill states the operation, its
arguments and its refusals; a guess produces a call that 404s or, worse, one that
succeeds against the wrong address.

---

## Verify the MCP server

Verify the MCP protocol directly:

\`\`\`sh
printf '%s\\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"setup","version":"1"}}}' | npx -y hanzo mcp
\`\`\`

A working installation returns a JSON-RPC response containing a \`serverInfo\` object whose name is \`hanzo-mcp\`.

Do not report success unless:

- \`hanzo version\` succeeds
- Hanzo authentication succeeds
- The agent configuration contains the \`hanzo\` MCP server
- The MCP protocol verification returns a valid initialization response
- Model calls are pointed at \`https://api.hanzo.ai/v1\`, or you have said why the
  host does not allow it

Once complete, tell the user:

\`\`\`text
┌─ Hanzo Agent Setup Complete ─────────────────────────┐
│  ✓ CLI     <path>                                    │
│  ✓ Login   authenticated                             │
│  ✓ MCP     <configuration path>                      │
│  ✓ Check   initialization passed                     │
│                                                      │
│  ⚡ Restart your agent to load Hanzo MCP             │
└──────────────────────────────────────────────────────┘
\`\`\`

If a check fails, diagnose and fix it before reporting completion.

---

## Resources

- Hanzo documentation: \`https://docs.hanzo.ai\`
- Hanzo CLI: \`https://docs.hanzo.ai/docs/cli\`
- Hanzo MCP documentation: \`https://docs.hanzo.ai/docs/mcp\`
- Hanzo MCP source: \`https://github.com/hanzoai/mcp\`
- Hanzo Dev installation: \`https://docs.hanzo.ai/docs/dev/getting-started/install\`
- Hanzo Dev MCP commands: \`https://docs.hanzo.ai/docs/dev/reference/cli\`
- Hanzo Console: \`https://platform.hanzo.ai\`
`;
