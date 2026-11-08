---
name: cf-preview-claim
description: "Deploy the brand site to a Cloudflare temporary preview account and hand the claim link to the brand owner safely. Use for any preview deploy."
---

# Temporary previews

Based on https://developers.cloudflare.com/workers/platform/claim-deployments/ (Wrangler 4.152.0; 4.102.0 or later works).

- Run `just preview` (`scripts/preview-temporary.sh`). It clears Cloudflare credentials and uses an isolated `XDG_CONFIG_HOME` under `.tmp/`, since `--temporary` refuses to run when credentials exist.
- The claim URL is a bearer credential. Give it only to the brand owner, directly. Never put it in issues, comments, commits, logs, or memory.
- The owner must finish claiming within 60 minutes; after that Cloudflare deletes the account and its resources.
- Supported on temporary accounts: Workers on workers.dev, Static Assets (1,000 files, 5 MiB each), KV, one D1 database (100 MB), Durable Objects, two Hyperdrive configs, 10 Queues.
- Production deploys use the owner's own account via `just deploy`.
