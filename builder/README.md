# Builder source

- `gen.js`: the generator (bundle files from `bitkit.kit.json`). The platform embeds it as `platform/src/generator.js`.
- `ui.js`, `base.clean.css`, `extra.css`, `head.html`, `middle.html`: the builder page parts.
- `studiokit.js`: bitkit's own kit. `seedcc.js`: the Cooper's Coffee demo kit.
- `sh build.sh` writes `../site/app-index.html`, which is served from R2 at `site/app/index.html`.
