# bitkit

Ship identity kits that brand owners can launch the same day, generated from one bitkit.kit.json.

## Org chart

| Agent | Title | Reports to | Skills |
| --- | --- | --- | --- |
| Studio Director | Chief Executive Officer | board | none |
| Brand Lead | Creative Director | director | brand-voice, brand-tokens, kit-editor |
| Identity Designer | Visual Identity Designer | brand-lead | brand-tokens |
| Copywriter | Brand Copywriter | brand-lead | brand-voice, account-launch |
| CTO | Chief Technology Officer | director | kit-editor, cf-preview-claim |
| Platform Engineer | Platform Engineer | cto | kit-editor, brand-tokens, cf-preview-claim |
| Edge DevOps | Edge Deploy Engineer | cto | cf-preview-claim |
| QA Engineer | QA Engineer | cto | none |
| Delivery Lead | Launch and Delivery Lead | director | account-launch |
| Security Lead | Security and Trust | director | cf-preview-claim |

## Import

```sh
bunx paperclipai@2026.1023.0 company import ./company --target new --dry-run
bunx paperclipai@2026.1023.0 company import ./company --target new
```

After import: seed the `GH_TOKEN` and `CLAUDE_CODE_OAUTH_TOKEN` secrets, approve each agent, then enable routines when you want them. No Cloudflare or platform credentials belong in this company.
