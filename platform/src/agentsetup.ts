// Agent setup prompts, in the style of developers.cloudflare.com/agent-setup:
// a one-line prompt the user pastes into their agent, which fetches these instructions.
const MCP = "https://app.bitkit.sh/mcp";
const SKILL_ZIP = "https://app.bitkit.sh/skill.zip";

export const ONE_LINE = "Fetch and follow the instructions to set me up for bitkit from https://app.bitkit.sh/agent-setup/prompt.md";
export const kitOneLine = (id: string) => `Fetch and follow the instructions to build my bitkit brand kit from https://app.bitkit.sh/agent-setup/${id}.md`;

const connect = `## Connect bitkit

Use the section for the agent you are running in.

### Claude Code

Run these commands yourself. Ask the user for their bitkit edit key first (it starts with \`bk_\`) and pass it through an environment variable so it is never printed.

\`\`\`sh
claude mcp add --transport http --scope user bitkit ${MCP} --header "x-auth-token: $BITKIT_KEY"
mkdir -p ~/.claude/skills && curl -fsSL ${SKILL_ZIP} -o /tmp/bitkit-skill.zip && unzip -o /tmp/bitkit-skill.zip -d ~/.claude/skills && rm /tmp/bitkit-skill.zip
\`\`\`

If the user has no edit key yet, add the connector without the \`--header\` part; reading kits works without it. Then tell the user to run \`/mcp\` to confirm bitkit is connected.

### Claude (web, desktop, or mobile)

You cannot change these settings yourself. Walk the user through it:

1. Settings → Connectors → Add custom connector. Name: bitkit. URL: \`${MCP}\`.
2. Authentication: No sign-in. Request headers: name \`x-auth-token\`, value their edit key, Required checked.
3. Optional: Settings → Capabilities → Skills → upload ${SKILL_ZIP}.

### Other MCP clients (Codex, Cursor, VS Code, OpenCode)

Add a remote (HTTP) MCP server named \`bitkit\` at \`${MCP}\` in the client's MCP config, with the header \`x-auth-token: <edit key>\`. Install the skill from ${SKILL_ZIP} where the client loads skills.`;

const rules = `## Rules

- Never print, repeat, or write the edit key into any file, commit, or chat message.
- Never create, sign in to, or post from social or registrar accounts, and never register domains or accept terms for the user. The user does those; their kit's ACCOUNTS.md lists each step.`;

export function setupPrompt(): string {
  return `These are official instructions from bitkit (https://www.bitkit.sh) to connect your agent to bitkit, which turns a brand into one kit: brand book, design system, website, and launch checklist, hosted on Cloudflare.

Complete these steps yourself where your agent allows it. Where it does not, guide the user step by step.

${connect}

## Then

Ask the user for their kit id: the 20-character id in their setup command (\`curl -fsSL https://app.bitkit.sh/setup/<kit_id> | sh\`). With it, fetch https://app.bitkit.sh/agent-setup/<kit_id>.md and follow those instructions.

If they have no kit yet, send them to https://app.bitkit.sh to make one.

${rules}

Once done, tell the user: "bitkit is connected. Give me your kit id and I will build your design system."
`;
}

export function kitPrompt(id: string, name: string, site: string | null): string {
  return `These are official instructions from bitkit (https://www.bitkit.sh) for building the design system for **${name}** (kit \`${id}\`). Complete them yourself.

## 1. Make sure bitkit is connected

If the \`bitkit\` tools (\`get_kit\`, \`get_design_seed\`, \`submit_design_system\`) are not available, follow the "Connect bitkit" steps in https://app.bitkit.sh/agent-setup/prompt.md first.

If you have no bitkit tools and cannot add them, read the kit from https://app.bitkit.sh/kits/${id}.tar.gz instead and give the user the finished files to upload at the end.

## 2. Build the design system

1. Call \`get_kit\` and \`get_design_seed\` with kit_id \`${id}\`.
2. Create a design system titled "${name}" from the seed files exactly: \`project/tokens.json\` (keep every value), \`project/README.md\`, the components, and the cover. Use \`project/assets/Logos/mark.svg\` as the logo. In Claude, use the Design System artifact type; elsewhere, write the files into a \`design-system/\` folder.
3. Show it to the user and refine it together. Keep text at 4.5:1 contrast in every theme.

## 3. Hand it back

When the user is happy, call \`submit_design_system\` with kit_id \`${id}\`, every file under \`project/\` as text, and binary assets as base64. Report the kit site link it returns (currently https://app.bitkit.sh/kits/${id}/).

Then offer \`request_deploy\` to publish the website${site ? ` (now at ${site})` : ""}, and use \`kit_status\` to report progress.

${rules}
`;
}

export function llmsTxt(): string {
  return `# bitkit

> bitkit turns a brand into one kit (bitkit.kit.json): brand book, Claude Design System, EmDash website, profile sheets, and a launch checklist, hosted on Cloudflare.

## Agent setup

- [Setup prompt](https://app.bitkit.sh/agent-setup/prompt.md): connect an agent (Claude Code, Claude, other MCP clients) to bitkit
- [Kit prompt](https://app.bitkit.sh/agent-setup/{kit_id}.md): build and hand back one kit's design system

## Tools

- [MCP server](${MCP}): get_kit, get_design_seed, update_kit, submit_design_system, kit_status, request_deploy
- [Claude plugin](https://app.bitkit.sh/plugin.zip) and [skill](${SKILL_ZIP})
- [Kit schema](https://bitkit.sh/schemas/bitkit.kit.v1.json)

## Apps

- [Builder](https://app.bitkit.sh/): customize and publish a kit
- [Setup command](https://app.bitkit.sh/setup/{kit_id}): \`curl -fsSL https://app.bitkit.sh/setup/<kit_id> | sh\`
`;
}
