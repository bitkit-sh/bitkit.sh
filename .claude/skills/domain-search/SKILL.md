---
name: domain-search
description: "Search and check domain names for the brand with the cf CLI and report prices. Use when the owner asks about domains. Never registers a domain."
---

# Domain search

- Search: `npx cf@latest registrar registrations search --query "bitkit"` (results are cached suggestions).
- Confirm: `npx cf@latest registrar registrations check --domains a.com b.co` for live availability and price.
- Report name, registrable, first-year and renewal price. Record picks in `domain.results` in the kit.
- Registration is the owner's purchase: hand them the name and let them register it in their own account.
