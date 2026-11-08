# A2UI wizard

`wizard.jsonl` is the bitkit wizard as an [A2UI](https://a2ui.org) v0.9 surface on the Basic Catalog, so any A2UI renderer (web, mobile, desktop) can show it without running code.

1. The agent streams the three messages: `createSurface`, `updateComponents`, `updateDataModel`.
2. Inputs bind to `/kit/...` in the data model; `sendDataModel` is on, so edits travel back with actions.
3. **Export bundle** sends the `bitkit.export` event with the edited kit. The agent merges it into `bitkit.kit.json`, regenerates the bundle with the same generators as the web builder, and replies with `updateDataModel`.

The Basic Catalog has no color picker or live preview; the web builder covers those. Account creation is never an action in this surface.
