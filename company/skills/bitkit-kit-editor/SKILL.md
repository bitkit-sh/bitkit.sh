---
name: bitkit-kit-editor
description: "Edit bitkit.kit.json (the single source of truth for this brand) and regenerate the bundle. Use when asked to change the brand name, handle, platforms, palette, type, voice, tooling, workflows, MCP servers, skills, or agents."
---

# Editing the kit

1. Change only `bitkit.kit.json`. Every other generated file names it as its source.
2. Run `bun scripts/validate-kit.ts`.
3. Regenerate: open the bitkit builder, import `bitkit.kit.json`, export, and replace the bundle; or ask Claude to update the kit in the bitkit artifact.
4. Commit the kit and the regenerated files together.

Never create, sign in to, or post on third-party accounts. Account creation belongs to the brand owner; see `ACCOUNTS.md`.
