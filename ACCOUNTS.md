# Accounts to create: bitkit

You create each account yourself, signed in as the brand owner. Nothing in this bundle signs up for, logs in to, or posts on any platform. Each row links to the platform’s own sign-up page and to the profile sheet with every field ready to paste.

Platform rules were last reviewed 2026-11-08. Check each platform’s current rules as you go.

## Checklist

- [ ] **Threads** as @bitkitsh: sign up at https://www.threads.net/, then fill the profile from [brand/platforms/threads.md](brand/platforms/threads.md)
- [ ] **X** as @bitkitsh: sign up at https://x.com/i/flow/signup, then fill the profile from [brand/platforms/x.md](brand/platforms/x.md)
- [ ] **Bluesky** as @bitkitsh: sign up at https://bsky.app/, then fill the profile from [brand/platforms/bluesky.md](brand/platforms/bluesky.md)
- [ ] **LinkedIn Page** as @bitkitsh: sign up at https://www.linkedin.com/company/setup/new/, then fill the profile from [brand/platforms/linkedin.md](brand/platforms/linkedin.md)
- [ ] **YouTube** as @bitkitsh: sign up at https://www.youtube.com/create_channel, then fill the profile from [brand/platforms/youtube.md](brand/platforms/youtube.md)
- [ ] **GitHub** as @bitkitsh: sign up at https://github.com/account/organizations/new, then fill the profile from [brand/platforms/github.md](brand/platforms/github.md)

## Domain

- [ ] Run `just domains` to search
- [ ] Register your pick yourself in your Cloudflare account, then set `deploy.domain` in the kit

## Cloudflare

- [ ] Create or sign in to your Cloudflare account at https://dash.cloudflare.com/sign-up
- [ ] For CI deploys, create an API token scoped to Workers and add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as repository secrets

## Repository

- [ ] Create `bitkit-sh/bitkit` on GitHub and push this bundle

## After each account exists

Tell your agents which accounts are live by ticking the box above and committing. The Delivery Lead reads this file; agents never hold platform passwords.
