# bitkit: instructions for Claude and other agents

- `bitkit.kit.json` is the single source of truth. Edit it, validate with `bun scripts/validate-kit.ts`, then regenerate. Never hand-edit files whose header says they are generated.
- Brand voice and tokens: see the skills in `.claude/skills/`.
- Cloudflare: use the `cf` CLI (`npx cf@latest`); this project has `cloudflare.config.ts` and no Wrangler config.
- Commands: `just check`, `just dev`, `just build`, `just domains`, `just deploy`.
- Tests: `bun test`; Vitest with `just test-workers`.
- Never create, sign in to, or post from any platform account, never register a domain, and never accept terms of service on the owner's behalf. Prepare `ACCOUNTS.md` and the profile sheets; the owner does the sign-ups.
- API tokens are credentials. Keep them out of commits, issues, and logs.
- Scratch files go in `.tmp/`.
