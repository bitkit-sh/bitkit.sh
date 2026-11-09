# bitkit identity kit

Brand identity in a box: one kit, every surface.

Everything here is generated from `bitkit.kit.json` (schema bitkit.kit/v1, 2026-11-09T06:27:46Z). Change the kit, then regenerate.

## What’s inside

| Module | Files |
| --- | --- |
| Brand kit | Brand book, guide, tokens, mark, profile sheets |
| Account checklist | ACCOUNTS.md: what you sign up for, in order |
| Dev experience | Tooling and editor config |
| Cloudflare project | cloudflare.config.ts, Worker, Vite, and domain scripts |
| Cloudflare for Platforms | platform/: dispatcher, Dynamic Workers, tenant provisioning |
| GitHub Actions | Workflows you picked |
| MCP config | .mcp.json for Claude Code and other clients |
| Agent skills | .claude/skills generated from the kit |
| Paperclip company | company/ in agentcompanies/v1 format |
| Claude Design System | design-system/project/: tokens, brand book, components for Claude |
| A2UI wizard | The same wizard as an A2UI v0.9 surface |

## Start

```sh
mise install
just setup
just check
just dev        # local brand site
```

Then work through `ACCOUNTS.md`. You create every platform account yourself; the kit prepares the fields.

## Files

```text
.claude/skills/account-launch-prep/SKILL.md
.claude/skills/bitkit-kit-editor/SKILL.md
.claude/skills/coopers-coffee-brand-tokens/SKILL.md
.claude/skills/coopers-coffee-brand-voice/SKILL.md
.claude/skills/domain-search/SKILL.md
.devcontainer/devcontainer.json
.editorconfig
.github/workflows/actions-audit.yml
.github/workflows/check.yml
.github/workflows/deploy.yml
.github/workflows/pr-build.yml
.gitignore
.mcp.json
.oxlintrc.json
ACCOUNTS.md
AGENTS.md
CLAUDE.md
README.md
a2ui/README.md
a2ui/wizard.jsonl
biome.json
bitkit.kit.json
brand/BRAND.md
brand/assets/mark.svg
brand/index.html
brand/platforms/bluesky.md
brand/platforms/github.md
brand/platforms/linkedin.md
brand/platforms/threads.md
brand/platforms/x.md
brand/platforms/youtube.md
brand/tokens.css
brand/tokens.json
cloudflare.config.ts
company/.paperclip.yaml
company/COMPANY.md
company/README.md
company/agents/brand-lead/AGENTS.md
company/agents/copywriter/AGENTS.md
company/agents/cto/AGENTS.md
company/agents/delivery-lead/AGENTS.md
company/agents/director/AGENTS.md
company/agents/edge-devops/AGENTS.md
company/agents/identity-designer/AGENTS.md
company/agents/platform-engineer/AGENTS.md
company/agents/qa/AGENTS.md
company/agents/security/AGENTS.md
company/assets/mark.svg
company/projects/account-launch/PROJECT.md
company/projects/account-launch/tasks/prepare-accounts-md/TASK.md
company/projects/brand-system/PROJECT.md
company/projects/brand-system/tasks/audit-contrast-and-handle-rules/TASK.md
company/projects/brand-system/tasks/review-platform-catalog/TASK.md
company/projects/dev-platform/PROJECT.md
company/projects/dev-platform/tasks/verify-pins/TASK.md
company/projects/kit-builder/PROJECT.md
company/projects/kit-builder/tasks/keep-generators-byte-stable/TASK.md
company/projects/web-presence/PROJECT.md
company/projects/web-presence/tasks/check-the-brand-site/TASK.md
company/projects/web-presence/tasks/prepare-production-deploy/TASK.md
company/skills/account-launch-prep/SKILL.md
company/skills/bitkit-kit-editor/SKILL.md
company/skills/coopers-coffee-brand-tokens/SKILL.md
company/skills/coopers-coffee-brand-voice/SKILL.md
company/skills/domain-search/SKILL.md
company/tasks/weekly-brand-review/TASK.md
company/tasks/weekly-pin-review/TASK.md
company/teams/creative/TEAM.md
company/teams/delivery/TEAM.md
company/teams/engineering/TEAM.md
design-system/CREATE-IN-CLAUDE.md
design-system/project/README.md
design-system/project/assets/Logos/README.md
design-system/project/assets/Logos/mark.svg
design-system/project/components/Button/README.md
design-system/project/components/Button/preview.html
design-system/project/components/Cover/preview.html
design-system/project/components/ProfileCard/README.md
design-system/project/components/ProfileCard/preview.html
design-system/project/design-system.json
design-system/project/tokens.json
justfile
lefthook.yml
migrations/0001_init.sql
mise.toml
package.json
platform/README.md
platform/cloudflare.config.ts
platform/migrations/0001_registry.sql
platform/migrations/0002_tenant_hosts.sql
platform/migrations/0003_keys_and_deploys.sql
platform/migrations/0004_tenant_setup.sql
platform/migrations/0005_kit_owners.sql
platform/package.json
platform/scripts/bootstrap.sh
platform/src/account.ts
platform/src/agentsetup.ts
platform/src/crypto.ts
platform/src/generator.d.ts
platform/src/generator.js
platform/src/index.ts
platform/src/kitsite.ts
platform/src/mcp.ts
platform/src/md.ts
platform/src/subjects.ts
platform/tenant-domains.json
platform/tsconfig.json
platform/vite.config.ts
schema/bitkit.kit.v1.json
scripts/deploy-tenant.sh
scripts/find-domain.sh
scripts/publish-kit.sh
scripts/validate-kit.ts
src/index.ts
tests/kit.test.ts
tsconfig.json
vite.config.ts
vitest.config.ts
```
