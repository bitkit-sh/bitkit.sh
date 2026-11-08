---
name: coopers-coffee-brand-voice
description: "Write any public copy for bitkit (bios, posts, captions, site text) in the brand voice from bitkit.kit.json. Use whenever text will appear under the brand's name."
---

# bitkit voice

Read `bitkit.kit.json` first; it wins over this file if they differ.

- Scales (0 formal/serious/reserved, 1 casual/playful/bold): formality 0.45, playfulness 0.35, boldness 0.6.
- We say: Show the kit, then the claim; Name the file a feature lives in.
- We avoid: Growth-hack language; Promises about follower counts.
- Bio limits per platform live in `platforms[].bioLimit`; never exceed them.

When copy for a platform changes, update `voice.bios.<platform>` in the kit and regenerate rather than editing generated files.
