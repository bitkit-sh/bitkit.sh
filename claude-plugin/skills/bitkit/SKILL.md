---
name: bitkit
description: "Build the owner's brand design system from their bitkit kit and hand it back to bitkit to publish. Use when the owner mentions bitkit, their kit id, a bitkit setup command, or asks to build, change, or publish their brand's design system or website."
---

# bitkit

bitkit (https://www.bitkit.sh) turns a brand into one kit: `bitkit.kit.json`. This skill builds the kit's Claude Design System with the owner and sends it back so bitkit can publish it and their website.

## Tools

The bitkit connector (`https://app.bitkit.sh/mcp`) provides `get_kit`, `get_design_seed`, `update_kit`, `submit_design_system`, `kit_status`, and `request_deploy`. If the connector is not available, read the kit from `https://app.bitkit.sh/kits/<kit_id>.tar.gz` (a tarball) or from files the owner attaches, and give the owner the files to upload at the end.

## Kit id and edit key

- The kit id is the 20-character id in the owner's setup command: `curl -fsSL https://app.bitkit.sh/setup/<kit_id> | sh`.
- Writes (`update_kit`, `submit_design_system`, `request_deploy`) need the kit's edit key (`bk_…`). Ask the owner for it when a write is needed. Never repeat it back or write it into any file or artifact.

## Build the design system

1. `get_kit` and `get_design_seed` for the kit id.
2. Create a Claude Design System titled with the brand name from the seed files exactly: `project/tokens.json` (keep every value), `project/README.md`, the components, and the cover. Upload `project/assets/Logos/mark.svg` as a Logos asset. Write the index (`project/design-system.json`) last.
3. Show the owner the system, then refine it together. Keep text at 4.5:1 contrast in every theme.
4. When the owner is happy, call `submit_design_system` with every file under `project/` as text and binary assets as base64. Report the kit site link it returns.
5. Offer `request_deploy` to publish the website. Use `kit_status` to report progress.

## Changing the kit

Use `update_kit` with only the fields that change (arrays replace whole arrays). If it returns problems, explain them and propose fixes.

## Boundaries

Never create, sign in to, or post from social or registrar accounts, never register domains, and never accept terms on the owner's behalf. The owner does those; `ACCOUNTS.md` in their kit lists each step.
