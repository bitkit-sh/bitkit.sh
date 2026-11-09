"use strict";
const GEN_SOURCE = document.getElementById("bitkit-gen")?.textContent ?? "";
const G = BITKIT, { esc, font, validHex, contrast, mix, onColor, trimBio, checkHandle } = G;
const STORE = "bitkit.kit.v1";
let d;
try { d = G.normalize(JSON.parse(localStorage.getItem(STORE)) || G.blank()); } catch { d = G.normalize(G.blank()); }
let step = 0, previewTab = "book", toast = "", openFile = "README.md", lastSynced = "", syncState = "This browser only";
const $ = (s, r = document) => r.querySelector(s);
const STEPS = [
  { id: "brand", t: "Brand", s: "Name and tagline" }, { id: "handle", t: "Handle", s: "Choose your @" }, { id: "platforms", t: "Platforms", s: "Where you’ll show up" },
  { id: "look", t: "Look", s: "Color, type, mark" }, { id: "voice", t: "Voice", s: "Tone and bio" }, { id: "stack", t: "Stack", s: "Repo, deploy, tooling" }, { id: "services", t: "Services", s: "Bindings, hosting, domain" },
  { id: "automation", t: "Automation", s: "Actions, MCP, skills" }, { id: "agents", t: "Agents", s: "Paperclip company" }, { id: "design", t: "Design system", s: "Tokens, brand book, components" }, { id: "export", t: "Deploy & export", s: "Publish, set up, export" }
];
const sel = () => G.selected(d);
const hFor = (pid) => G.handleFor(d, pid), bFor = (pid) => G.bioFor(d, pid);
const toggleCards = (list, items) => `<div class="plat-grid">${items.map((x) => `<label class="plat"><input type="checkbox" data-toggle="${list}:${x.id}" ${d[list].includes(x.id) ? "checked" : ""} ${x.locked ? "disabled" : ""}><b>${esc(x.name)}</b><small>${esc(x.why)}</small></label>`).join("")}</div>`;
const chipPick = (path, options, current) => `<div class="chips">${options.map(([v, l]) => `<button class="chip" type="button" data-set="${path}=${esc(v)}" aria-pressed="${String(v) === String(current)}">${esc(l)}</button>`).join("")}</div>`;

/* ---------- step views ---------- */
const views = {
  brand: () => `<h1>Name the brand</h1><p class="lede">Start with what people will call you. Everything in the bundle is built from these lines.</p>
    <div class="field"><label for="f-name">Brand name</label><input id="f-name" type="text" data-bind="brand.name" value="${esc(d.brand.name)}" autocomplete="off"></div>
    <div class="field"><label for="f-tag">Tagline</label><input id="f-tag" type="text" data-bind="brand.tagline" value="${esc(d.brand.tagline)}" maxlength="90"><span class="help">One line, under 90 characters.</span></div>
    <div class="row"><div class="field"><label for="f-cat">Category</label><select id="f-cat" data-bind="brand.category">${G.CATEGORIES.map((c) => `<option ${c === d.brand.category ? "selected" : ""}>${esc(c)}</option>`).join("")}</select></div>
      <div class="field"><span class="lbl">Slug</span><div data-region="slug"></div><span class="help">Used for file names, the repo, and the Worker.</span></div></div>
    <div class="field"><label for="f-kw">Keywords</label><div class="list-edit"><input id="f-kw" type="text" placeholder="Add a word and press Enter" data-add="keywords"></div>
      <div class="chips" data-region="keywords" style="margin-top:8px"></div><span class="help">Up to five. They seed handle ideas.</span></div>`,
  handle: () => `<h1>Choose your handle</h1><p class="lede">Pick one primary @ to use everywhere. Where a platform’s rules don’t fit it, override that platform only.</p>
    <span class="lbl">Ideas from your name</span><div class="chips" data-region="candidates" style="margin:8px 0 16px"></div>
    <div class="field"><label for="f-handle">Primary handle</label><input id="f-handle" type="text" data-bind="handle.primary" value="${esc(d.handle.primary)}" autocomplete="off" spellcheck="false"></div>
    <h2>Fit check per platform</h2><div class="table-wrap"><table><thead><tr><th>Platform</th><th>Handle</th><th>Status</th><th>Override</th></tr></thead><tbody data-region="handle-table"></tbody></table></div>`,
  platforms: () => `<h1>Pick your platforms</h1><p class="lede">Each one gets a profile sheet and a line in your account checklist. You create the accounts; the kit fills in the fields.</p>
    <div class="actions" style="margin:0 0 18px"><button class="btn ghost" type="button" data-act="plat-all">Select all</button><button class="btn ghost" type="button" data-act="plat-none">Clear</button></div>
    <div class="groups">${G.GROUPS.map((g) => `<section><h2>${g}</h2><div class="plat-grid">${G.PLATFORMS.filter((p) => p.group === g).map((p) => `<label class="plat"><input type="checkbox" data-toggle="platforms:${p.id}" ${d.platforms.includes(p.id) ? "checked" : ""}><b>${esc(p.name)}</b><small>Handle ${p.min}–${p.max} · bio ${p.bio}<br>Avatar ${p.avatar}${p.banner ? ` · banner ${p.banner}` : ""}</small></label>`).join("")}</div></section>`).join("")}</div>
    <p class="help" style="margin-top:16px">Limits come from bitkit’s platform catalog, last reviewed 8 Nov 2026. Check each platform’s current rules before launch.</p>`,
  look: () => `<h1>Set the look</h1><p class="lede">Five colors, two typefaces, one mark. The preview updates as you go.</p>
    <span class="lbl">Start from a preset</span><div class="chips" style="margin:8px 0 18px">${G.PRESETS.map((p, i) => `<button class="chip" type="button" data-preset="${i}"><span class="dot" style="background:${p.primary}"></span>${esc(p.name)}</button>`).join("")}</div>
    <div class="swatches">${["primary", "secondary", "accent", "ink", "paper"].map((k) => `<div class="swatch"><div class="well" data-well="${k}" style="background:${d.palette[k]}"><input type="color" aria-label="${k} color" data-color="${k}" value="${validHex(d.palette[k]) ? d.palette[k] : "#000000"}"></div>
      <div class="meta"><span>${k[0].toUpperCase() + k.slice(1)}</span><input type="text" aria-label="${k} hex" data-hex="${k}" value="${esc(d.palette[k])}" spellcheck="false"></div></div>`).join("")}</div>
    <div class="contrast" data-region="contrast"></div>
    <h2>Type</h2><div class="row">${[["heading", "Headings"], ["body", "Body"]].map(([k, l]) => `<div class="field"><label for="f-${k}">${l}</label><select id="f-${k}" data-bind="type.${k}">${G.FONTS.map((f) => `<option ${f.name === d.type[k] ? "selected" : ""}>${esc(f.name)}</option>`).join("")}</select></div>`).join("")}</div>
    <h2>Mark and shape</h2><div class="row">
      <div class="field"><label for="f-gly">Monogram letters</label><input id="f-gly" type="text" maxlength="3" data-bind="mark.glyphs" value="${esc(d.mark.glyphs)}"></div>
      <div class="field"><span class="lbl">Mark shape</span>${chipPick("mark.kind", [["seal", "Seal"], ["circle", "Circle"], ["square", "Square"]], d.mark.kind)}</div>
      <div class="field"><label for="f-rad">Corner radius <span data-region="radius"></span></label><input id="f-rad" type="range" min="0" max="28" step="1" data-bind="shape.radius" data-num value="${d.shape.radius}"></div></div>`,
  voice: () => `<h1>Find the voice</h1><p class="lede">Set where the brand sits on three scales, then write the bio every profile starts from.</p>
    ${[["formality", "Formal", "Casual"], ["playfulness", "Serious", "Playful"], ["boldness", "Reserved", "Bold"]].map(([k, a, b]) => `<div class="slider-row"><span>${a}</span><input type="range" min="0" max="1" step="0.05" aria-label="${a} to ${b}" data-bind="voice.${k}" data-num value="${d.voice[k]}"><span>${b}</span></div>`).join("")}
    <div class="row" style="margin-top:18px">${[["do", "We say"], ["dont", "We avoid"]].map(([k, l]) => `<div class="field"><span class="lbl">${l}</span><div class="list-edit"><input type="text" aria-label="Add to ${l}" data-add="${k}" placeholder="Add and press Enter"></div><div class="chips" data-region="list-${k}" style="margin-top:8px"></div></div>`).join("")}</div>
    <div class="field"><label for="f-bio">Bio</label><textarea id="f-bio" data-bind="voice.bio">${esc(d.voice.bio)}</textarea><div class="counter" data-region="bio-counter"></div><span class="help">Over-limit bios are trimmed at a word break in each profile sheet.</span></div>
    <details><summary>Write a different bio for one platform</summary>${sel().map((p) => `<div class="field" style="margin-top:12px"><label for="bio-${p.id}">${esc(p.name)} bio (limit ${p.bio})</label><textarea id="bio-${p.id}" data-bio="${p.id}" placeholder="Uses the main bio">${esc(d.voice.bios[p.id] || "")}</textarea></div>`).join("") || `<p class="help">Pick platforms first.</p>`}</details>`,
  stack: () => `<h1>Pick the stack</h1><p class="lede">Where the code lives, where the brand site deploys, and the tooling around it. You create the repository and the Cloudflare account yourself.</p>
    <h2>Repository</h2><div class="row"><div class="field"><label for="f-owner">GitHub owner</label><input id="f-owner" type="text" data-bind="repo.owner" value="${esc(d.repo.owner)}" spellcheck="false"></div>
      <div class="field"><label for="f-repo">Repository name</label><input id="f-repo" type="text" data-bind="repo.name" value="${esc(d.repo.name)}" spellcheck="false"></div></div>
    <h2>Cloudflare deploy</h2><div class="row"><div class="field"><label for="f-worker">Worker name</label><input id="f-worker" type="text" data-bind="deploy.worker" value="${esc(d.deploy.worker)}" spellcheck="false"><span class="help">The Worker in cloudflare.config.ts: API routes plus the brand site.</span></div>
      <div class="field"><label for="f-domain">Custom domain (optional)</label><input id="f-domain" type="text" data-bind="deploy.domain" value="${esc(d.deploy.domain)}" placeholder="brand.example.com" spellcheck="false"></div></div>
    <p class="help">Sites run on the bitkit platform as Workers for Platforms tenants: <code>just deploy-tenant</code> publishes into the tenant namespace, and the site is live at its bitkit.sh hostname.</p>
    <h2>Dev experience</h2>${toggleCards("devex", G.DEVEX)}`,
  services: () => `<h1>Select services</h1><p class="lede">Pick the Cloudflare services the site’s Worker binds to. bitkit writes them into <code>cloudflare.config.ts</code> for the <code>cf</code> CLI and, on the platform, provisions them per tenant.</p>
    <h2>Bindings</h2>${toggleCards("services", G.SERVICES.map((x) => ({ ...x, why: `env.${x.binding}: ${x.why}` })))}
    <h2>Hosting</h2>${chipPick("hosting.model", G.HOSTING.map((h) => [h.id, h.name]), d.hosting.model)}<p class="help" data-region="hosting-why"></p>
    <div class="row" style="margin-top:12px"><div class="field"><label for="f-ns">Dispatch namespace</label><input id="f-ns" type="text" data-bind="hosting.namespace" value="${esc(d.hosting.namespace)}" spellcheck="false"><span class="help">Workers for Platforms namespace holding tenant Workers.</span></div>
      <div class="field"><label for="f-zone">Platform zone</label><input id="f-zone" type="text" data-bind="hosting.platformZone" value="${esc(d.hosting.platformZone)}" spellcheck="false"><span class="help">Tenants get &lt;slug&gt;.this-zone until a custom domain is attached.</span></div></div>
    <h2>Domain</h2>
    <div class="field"><label for="f-dq">Search for</label><input id="f-dq" type="text" data-bind="domain.query" value="${esc(d.domain.query)}" spellcheck="false"></div>
    <span class="lbl">Ideas to check</span><div class="chips" data-region="domain-ideas" style="margin:8px 0 14px"></div>
    <div data-region="domain-results"></div>
    <p class="help">Search runs in your Cloudflare account with the cf CLI, or ask Claude in the chat to search; results land in this table. You register the domain yourself.</p>
    <pre class="cmd" data-region="domain-cmd"></pre>`,
  automation: () => `<h1>Wire up automation</h1><p class="lede">Workflows for GitHub Actions, MCP servers for Claude and other clients, and skills generated from your kit.</p>
    <h2>GitHub Actions</h2>${toggleCards("ci", G.WORKFLOWS)}<p class="help">Actions are pinned to their latest majors: ${Object.values(G.V.actions).map(esc).join(", ")}. Deploy workflows read secrets you add to the repository.</p>
    <h2>MCP servers</h2>${toggleCards("mcp", G.MCP)}<p class="help">Written to <code>.mcp.json</code>. Each server asks you to sign in the first time you use it.</p>
    <h2>Agent skills</h2>${toggleCards("skills", G.SKILLS)}`,
  agents: () => `<h1>Staff the company</h1><p class="lede">A Paperclip company in the open Agent Companies format. Agents prepare and build; they never create accounts or deploy to production without your approval.</p>
    <div class="row"><div class="field"><span class="lbl">Company type</span>${chipPick("agents.purpose", [["brand", "Runs this brand"], ["studio", "A studio that makes kits"]], d.agents.purpose)}</div>
      <div class="field"><span class="lbl">Size</span>${chipPick("agents.size", [["lean", "Lean, 4 agents"], ["full", "Full, 10 agents"]], d.agents.size)}</div></div>
    <div class="row"><div class="field"><label for="f-budget">Monthly budget per agent (cents)</label><input id="f-budget" type="text" inputmode="numeric" data-bind="agents.budgetCents" data-num value="${d.agents.budgetCents}"></div>
      <div class="field"><label for="f-tz">Routine time zone</label><input id="f-tz" type="text" data-bind="agents.timezone" value="${esc(d.agents.timezone)}"></div></div>
    <h2>Org chart</h2><div data-region="org"></div>
    <p class="help">Imports with <code>paperclipai company import ./company</code>. New agents need board approval, heartbeats start off, and routines start paused.</p>`,
  design: () => `<h1>Create your design system</h1><p class="lede">bitkit turns the kit into a Claude Design System: tokens for light and dark, a brand book, components with live previews, and the mark. You refine it in Claude; the kit site mirrors it.</p>
    <label class="plat" style="max-width:460px"><input type="checkbox" data-toggle="modules:design-system" ${d.modules.includes("design-system") ? "checked" : ""}><b>Include the design system in the bundle</b><small>Writes design-system/project/ in the Design System format.</small></label>
    <h2>Tokens</h2><div data-region="ds-tokens"></div>
    <h2>Files</h2><ul class="files" data-region="ds-files"></ul>
    <div class="actions"><button class="btn wax" type="button" data-act="ds-claude">Create in Claude</button><button class="btn ghost" type="button" data-act="ds-zip">Download design system</button></div>
    <p class="help" data-region="ds-hint"></p>
    <h2>Or hand it to your agent</h2><div data-region="agent-prompt"></div>`,
  export: () => `<h1>Deploy &amp; export</h1><p class="lede">Publish the kit for a one-line setup, download the bundle, or both. You create every platform account yourself.</p>
    <p class="help" data-region="account"></p>
    <div class="actions" style="margin-top:0"><button class="btn wax" type="button" data-act="publish" ${HOSTED ? "" : "hidden"}>Publish kit</button></div>
    ${toggleCards("modules", G.MODULES)}
    <div data-region="export-problems" style="margin-top:16px"></div>
    <div class="actions"><button class="btn ${HOSTED ? "ghost" : "wax"}" type="button" data-act="dl-zip">Download bundle (.zip)</button><button class="btn ghost" type="button" data-act="dl-json">bitkit.kit.json</button><button class="btn ghost" type="button" data-act="dl-md">BRAND.md</button><button class="btn ghost" type="button" data-act="dl-accounts">ACCOUNTS.md</button></div>
    <div class="toast" data-region="toast" role="status"></div>
    <h2>One-line setup</h2><div data-region="setup"></div>
    <h2>Prompt for Claude</h2><div data-region="agent-prompt"></div>
    <h2>Bring back a kit</h2><div class="actions" style="margin-top:0"><label class="btn ghost" for="f-import">Import bitkit.kit.json</label><input id="f-import" type="file" accept="application/json,.json" hidden><button class="btn ghost" type="button" data-act="reset">Start over</button></div>`
};

/* ---------- regions ---------- */
const regions = {
  slug: () => `<code>${esc(d.brand.slug || "none")}</code>`,
  keywords: () => d.brand.keywords.map((w, i) => `<button class="chip" type="button" data-del="keywords:${i}" aria-label="Remove ${esc(w)}">${esc(w)}<span class="x" aria-hidden="true">×</span></button>`).join("") || `<span class="help">No keywords yet.</span>`,
  candidates: () => G.candidates(d).map((h) => `<button class="chip" type="button" data-pick="${esc(h)}" aria-pressed="${h === d.handle.primary}">@${esc(h)}</button>`).join(""),
  "handle-table": () => (sel().length ? sel() : G.PLATFORMS).map((p) => { const h = hFor(p.id), c = checkHandle(p, h);
    return `<tr><td>${esc(p.name)}</td><td><code>@${esc(h)}</code></td><td class="status ${c.ok ? "ok" : "bad"}">${c.ok ? "✓" : "✕"} ${esc(c.msg)}</td><td><input type="text" aria-label="${esc(p.name)} override" data-override="${p.id}" value="${esc(d.handle.overrides[p.id] || "")}" placeholder="Use primary"></td></tr>`; }).join(""),
  contrast: () => [["Ink on paper", "ink", "paper"], ["Paper on primary", "paper", "primary"], ["Ink on secondary", "ink", "secondary"], ["Ink on accent", "ink", "accent"]].map(([l, a, b]) => {
    if (!validHex(d.palette[a]) || !validHex(d.palette[b])) return `<span class="bad">${l}: invalid color</span>`;
    const r = contrast(d.palette[a], d.palette[b]); return `<span class="${r >= 4.5 ? "ok" : r >= 3 ? "warn" : "bad"}">${l} ${r.toFixed(2)}:1, ${r >= 4.5 ? "passes AA" : r >= 3 ? "large text only" : "fails AA"}</span>`; }).join(""),
  radius: () => `${d.shape.radius}px`,
  "list-do": () => d.voice.do.map((w, i) => `<button class="chip" type="button" data-del="do:${i}">${esc(w)}<span class="x" aria-hidden="true">×</span></button>`).join(""),
  "list-dont": () => d.voice.dont.map((w, i) => `<button class="chip" type="button" data-del="dont:${i}">${esc(w)}<span class="x" aria-hidden="true">×</span></button>`).join(""),
  "bio-counter": () => sel().map((p) => { const n = bFor(p.id).length; return `<span class="${n > p.bio ? "bad" : "ok"}">${esc(p.name)} ${n}/${p.bio}</span>`; }).join("") || `<span>No platforms selected</span>`,
  org: () => { const roles = G.ROLES.filter((r) => r.sizes.includes(d.agents.size)), keep = new Set(roles.map((r) => r.slug));
    const boss = (r) => { let b = r.reportsTo; while (b && !keep.has(b)) b = G.ROLES.find((x) => x.slug === b)?.reportsTo ?? null; return b; };
    const tree = (parent, depth) => roles.filter((r) => boss(r) === parent).map((r) => `<li style="--depth:${depth}"><b>${esc(r.name)}</b> <span class="help">${esc(r.title)}</span>${roles.some((x) => boss(x) === r.slug) ? `<ul>${tree(r.slug, depth + 1)}</ul>` : ""}</li>`).join("");
    return `<ul class="org">${tree(null, 0)}</ul>`; },
  "export-problems": () => { const ps = G.problems(d); return ps.length ? `<p class="bad" style="margin:0 0 6px;font-weight:600">Fix these before exporting:</p><ul class="problems">${ps.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : `<p class="ok" style="margin:0">Ready: ${Object.keys(gen().files).length} files.</p>`; },
  "hosting-why": () => esc(G.HOSTING.find((h) => h.id === d.hosting.model)?.why || ""),
  "domain-ideas": () => { const base = G.slugify(d.domain.query || d.brand.name).replace(/-/g, ""); return [base + ".com", base + ".co", base + ".coffee", base + ".cafe", "get" + base + ".com", base + ".shop"].map((n) => `<button class="chip" type="button" data-domain="${esc(n)}" aria-pressed="${n === d.deploy.domain}">${esc(n)}</button>`).join(""); },
  "domain-results": () => { const r = d.domain.results; if (!r.length) return `<div class="empty">No checked results yet.</div>`;
    return `<div class="table-wrap"><table><thead><tr><th>Domain</th><th>Status</th><th>First year</th><th>Renewal</th><th></th></tr></thead><tbody>${r.map((x) => `<tr><td><code>${esc(x.name)}</code></td><td class="status ${x.registrable ? "ok" : "bad"}">${x.registrable ? "Available" : esc((x.reason || "unavailable").replace(/_/g, " "))}</td><td>${x.registration_cost ? "$" + esc(x.registration_cost) : ""}</td><td>${x.renewal_cost ? "$" + esc(x.renewal_cost) : ""}</td><td>${x.registrable ? `<button class="chip" type="button" data-domain="${esc(x.name)}" aria-pressed="${x.name === d.deploy.domain}">${x.name === d.deploy.domain ? "Chosen" : "Use"}</button>` : ""}</td></tr>`).join("")}</tbody></table></div><p class="help">Checked ${esc(d.domain.checkedAt || "")}${d.domain.account ? " in " + esc(d.domain.account) : ""}. Prices in USD from Cloudflare Registrar; recheck before buying.</p>`; },
  "domain-cmd": () => esc(`npx cf@latest registrar registrations search --query "${d.domain.query || d.brand.name}" --limit 12\nnpx cf@latest registrar registrations check --domains ${(d.domain.results.filter((x) => x.registrable).slice(0, 4).map((x) => x.name).join(" ")) || "name.com name.co"}`),
  "ds-tokens": () => { const f = gen().files["design-system/project/tokens.json"]; if (!f) return `<p class="help">Turn on the design system above.</p>`; const t = JSON.parse(f);
    return `<div class="table-wrap"><table><thead><tr><th>Token</th><th>Light</th><th>Dark</th><th>Use</th></tr></thead><tbody>${t.color.tokens.map((x) => `<tr><td><code>${esc(x.name)}</code></td><td><span class="dot" style="background:${esc(x.value.light)}"></span><code>${esc(x.value.light)}</code></td><td><span class="dot" style="background:${esc(x.value.dark)}"></span><code>${esc(x.value.dark)}</code></td><td class="help" style="white-space:normal">${esc(x.usage)}</td></tr>`).join("")}</tbody></table></div><p class="help">Type: ${esc(t.type.families.heading.split(",")[0])} for headings, ${esc(t.type.families.body.split(",")[0])} for text, ${t.type.groups.reduce((a, g) => a + g.styles.length, 0)} styles. Radii ${t.radius.tokens.map((x) => esc(x.value)).join(", ")}.</p>`; },
  "ds-files": () => Object.keys(gen().files).filter((p) => p.startsWith("design-system/")).sort().map((p) => `<li><code>${esc(p.replace("design-system/", ""))}</code></li>`).join("") || `<li class="muted">None yet</li>`,
  "ds-hint": () => HOSTED ? (d.publish.id ? "Opens Claude with a prompt to build the system from your published kit." : "Publishes the kit first, then opens Claude with a prompt to build the system from it.") : window.claude?.use ? "In this chat, ask Claude: “Create my design system from the kit.” Claude reads this kit and builds it." : "Opens Claude with a prompt; attach the downloaded design system files there.",
  "agent-prompt": () => { const p = agentPrompt(); return `<div class="prompt-box"><code>${esc(p)}</code><button class="btn" type="button" data-act="copy-prompt">Copy prompt</button></div><p class="help">Paste it into Claude, Claude Code, or any agent. ${d.publish.id ? "It builds this kit’s design system and sends it back." : "Publish the kit to get a prompt for this kit; this one connects the agent first."}</p>`; },
  account: () => !HOSTED ? "" : ME ? `Signed in as ${esc(ME.email)}. <a href="#" data-signout>Sign out</a>` : "You customize freely; bitkit asks you to sign in or create an account only when you publish and connect Claude.",
  setup: () => d.publish.id
    ? `<pre class="cmd">${esc(d.publish.setup || `curl -fsSL https://app.bitkit.sh/setup/${d.publish.id} | sh`)}</pre><p class="help">Published ${esc(d.publish.publishedAt)}. Anyone with this command can download the kit, so share it only with the owner. To read the script first: <code>${esc((d.publish.setup || `curl -fsSL https://app.bitkit.sh/setup/${d.publish.id} | sh`).replace(/ \| sh$/, " -o bitkit-setup.sh"))}</code></p>`
    : `<p class="help" style="margin:0">Not published yet. Publishing sends only bitkit.kit.json to bitkit.sh and returns a command that downloads, verifies, and unpacks this bundle on any machine. Ask Claude in the chat to publish it, or run <code>just publish</code> from the downloaded bundle.</p>`,
  toast: () => esc(toast),
  sync: () => esc(syncState)
};
let genCache = null;
const gen = () => (genCache ??= G.generate(d, new Date(), { source: GEN_SOURCE }));
function refresh({ fromRemote = false } = {}) {
  genCache = null;
  d.brand.slug = G.slugify(d.brand.name);
  document.querySelectorAll("[data-region]").forEach((el) => { const f = regions[el.dataset.region]; if (f) el.innerHTML = f(); });
  renderSteps(); renderPreview(); loadBrandFonts();
  try { localStorage.setItem(STORE, JSON.stringify(d)); } catch {}
  if (!fromRemote) queueSync();
}
function renderSteps() {
  $("#steps").innerHTML = STEPS.map((s, i) => `<button class="step ${i < step ? "done" : ""}" type="button" data-step="${i}" ${i === step ? 'aria-current="step"' : ""}><span class="n">${i < step ? "✓" : i + 1}</span><span><b>${s.t}</b><small>${s.s}</small></span></button>`).join("");
  const nav = $("#steps"), cur = nav.querySelector("[aria-current]");
  if (cur && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = cur.offsetLeft - (nav.clientWidth - cur.offsetWidth) / 2;
}
function renderPanel() {
  $("#panel").innerHTML = views[STEPS[step].id]() + `<div class="nav"><button class="btn ghost" type="button" data-act="prev" ${step === 0 ? "disabled" : ""}>Back</button>${step < STEPS.length - 1 ? `<button class="btn" type="button" data-act="next">Next: ${STEPS[step + 1].t}</button>` : ""}</div>`;
  refresh();
}
let fontHref = "";
function loadBrandFonts() {
  const href = `https://fonts.googleapis.com/css2?${[...new Set([d.type.heading, d.type.body])].map((f) => "family=" + f.replace(/ /g, "+") + ":wght@400;600;700").join("&")}&display=swap`;
  if (href !== fontHref) { fontHref = href; $("#brand-fonts").href = href; }
}
function renderPreview() {
  for (const [id, tab] of [["tab-book", "book"], ["tab-prof", "prof"], ["tab-files", "files"]]) $("#" + id).setAttribute("aria-selected", String(previewTab === tab));
  const p = d.palette;
  if (previewTab !== "files" && !["primary", "paper", "ink", "secondary", "accent"].every((k) => validHex(p[k]))) { $("#preview").innerHTML = `<div class="empty">Fix the palette hex values to see the preview.</div>`; return; }
  if (previewTab === "book") {
    $("#preview").innerHTML = `<div class="specimen" style="background:${p.paper};color:${p.ink};font-family:${esc(font(d.type.body))}">
      <div class="spec-hero"><div class="mark">${G.markSvg(d, 112)}</div><h2 class="spec-name" style="font-family:${esc(font(d.type.heading))}">${esc(d.brand.name || "Your brand")}</h2><p class="spec-tag">${esc(d.brand.tagline)}</p></div>
      <div class="spec-body" style="border-top:1px solid ${mix(p.ink, p.paper, 0.85)}"><div class="spec-chips">${["primary", "secondary", "accent", "ink", "paper"].map((k) => `<div style="background:${p[k]};color:${onColor(p[k])}">${k}</div>`).join("")}</div>
      <div class="spec-type"><p style="font-family:${esc(font(d.type.heading))};font-size:1.4rem;font-weight:700;line-height:1.15">${esc(d.type.heading)}</p><p style="font-size:.92rem;opacity:.85">${esc(d.type.body)} for body copy. ${esc(trimBio(d.voice.bio, 110))}</p></div>
      <span class="spec-btn" style="background:${p.primary};color:${onColor(p.primary)};border-radius:${d.shape.radius}px">Visit @${esc(d.handle.primary)}</span></div></div>`;
  } else if (previewTab === "prof") {
    $("#preview").innerHTML = sel().length ? `<div class="profiles">${sel().map((pl) => { const h = hFor(pl.id), c = checkHandle(pl, h);
      return `<article class="profile"><div class="mark">${G.markSvg(d, 48)}</div><div><b>${esc(d.brand.name)}</b><span class="handle">${esc(pl.name)} · @${esc(h)} ${c.ok ? "" : `<span class="bad">(${esc(c.msg)})</span>`}</span><p>${esc(trimBio(bFor(pl.id), pl.bio))}</p><div class="src">${esc(pl.url.replace("{h}", h))}</div></div></article>`; }).join("")}</div>` : `<div class="empty">Pick platforms to see profile previews.</div>`;
  } else {
    const files = gen().files, paths = Object.keys(files).sort();
    if (!files[openFile]) openFile = "README.md";
    $("#preview").innerHTML = `<div class="files-pane"><div class="tree" role="listbox" aria-label="Bundle files">${paths.map((f) => `<button type="button" role="option" data-file="${esc(f)}" aria-selected="${f === openFile}" style="--depth:${f.split("/").length - 1}">${esc(f.split("/").pop())}<span class="dir">${esc(f.split("/").slice(0, -1).join("/"))}</span></button>`).join("")}</div>
      <div class="viewer"><div class="viewer-head"><code>${esc(openFile)}</code><span class="help">${files[openFile].length.toLocaleString()} chars</span></div><pre>${esc(files[openFile])}</pre></div></div>`;
  }
}

/* ---------- downloads ---------- */
async function offer(filename, data) {
  try {
    const dl = window.claude?.use ? await window.claude.use("downloads") : null;
    if (dl) { await dl.save({ filename, data }); toast = `Saved ${filename}.`; return; }
  } catch (e) {
    if (e?.code === "declined") { toast = "Download cancelled."; return; }
    if (e?.code === "rate_limited") { toast = "A download prompt is already open. Finish that one first."; return; }
  }
  const url = URL.createObjectURL(data instanceof Blob ? data : new Blob([data]));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename }); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
  toast = `Downloaded ${filename}.`;
}
async function exportAs(kind) {
  if (G.problems(d).length) { toast = "Fix the listed problems first."; refresh(); return; }
  const { kit, files } = G.generate(d, new Date(), { source: GEN_SOURCE }), slug = kit.brand.slug;
  if (kind === "json") await offer("bitkit.kit.json", files["bitkit.kit.json"]);
  else if (kind === "md") await offer("BRAND.md", files["brand/BRAND.md"]);
  else if (kind === "ds") {
    if (!window.JSZip) { toast = "The zip library didn’t load."; refresh(); return; }
    const z = new JSZip(); for (const [p, c] of Object.entries(files)) if (p.startsWith("design-system/")) z.file(`${slug}-design-system/${p.slice(14)}`, c);
    await offer(`${slug}-design-system.zip`, await z.generateAsync({ type: "blob" }));
  }
  else if (kind === "accounts") { if (files["ACCOUNTS.md"]) await offer("ACCOUNTS.md", files["ACCOUNTS.md"]); else toast = "Turn on the Account checklist module first."; }
  else {
    if (!window.JSZip) { toast = "The zip library didn’t load. Download bitkit.kit.json and regenerate later."; refresh(); return; }
    const z = new JSZip(), root = z.folder(`${slug}-identity-kit`);
    for (const [p, c] of Object.entries(files)) root.file(p, c, p.endsWith(".sh") ? { unixPermissions: "755" } : {});
    await offer(`${slug}-identity-kit.zip`, await z.generateAsync({ type: "blob", platform: "UNIX" }));
  }
  refresh();
}

const agentPrompt = () => d.publish.id ? `Fetch and follow the instructions to build my bitkit brand kit from https://app.bitkit.sh/agent-setup/${d.publish.id}.md` : "Fetch and follow the instructions to set me up for bitkit from https://app.bitkit.sh/agent-setup/prompt.md";
async function copyPrompt(btn) {
  const t = agentPrompt(), label = btn.textContent;
  try { await navigator.clipboard.writeText(t); btn.textContent = "Copied"; }
  catch { const r = document.createRange(); r.selectNodeContents(btn.previousElementSibling); const s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = "Selected, press copy"; }
  setTimeout(() => (btn.textContent = label), 1800);
}

/* ---------- hosted on app.bitkit.sh: publish and hand off to Claude ---------- */
const HOSTED = location.hostname === "app.bitkit.sh";
let ME = null;
async function loadMe() { if (!HOSTED) return; try { const r = await fetch("/auth/me", { credentials: "same-origin" }); ME = r.ok ? (await r.json()).user : null; } catch { ME = null; } refresh(); }
document.addEventListener("click", async (e) => { if (!e.target.closest?.("[data-signout]")) return; e.preventDefault(); await fetch("/auth/logout", { method: "POST" }); ME = null; refresh(); });
async function publishKit() {
  if (G.problems(d).length) { toast = "Fix the listed problems first."; refresh(); return false; }
  toast = "Publishing…"; refresh();
  try {
    const res = await fetch("/api/kits", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(d) });
    const j = await res.json();
    if (res.status === 401 && j.login) { toast = "Sign in or create your account to publish. Your kit is saved."; refresh(); location.href = `/auth/login?return=${encodeURIComponent("/?step=export&publish=1")}`; return false; }
    if (!res.ok) throw new Error(j.problems ? j.problems.join(" ") : j.error || res.status);
    d.publish = { id: j.id, setup: j.setup, publishedAt: new Date().toISOString().slice(0, 10) };
    toast = `Published. Your edit key for Claude is ${j.key}. Save it now; bitkit shows it only once.`; refresh(); return true;
  } catch (e) { toast = `Publishing didn’t work: ${e.message}.`; refresh(); return false; }
}
async function createInClaude() {
  if (window.claude?.use && !HOSTED) { toast = "Ask Claude in this chat: “Create my design system from the kit.”"; refresh(); return; }
  if (HOSTED && !d.publish.id && !(await publishKit())) return;
  if (!d.modules.includes("design-system")) { d.modules.push("design-system"); refresh(); }
  const src = d.publish.id ? `https://app.bitkit.sh/kits/${d.publish.id}.tar.gz` : "the design-system folder I'm attaching";
  const q = `Create a Claude Design System titled "${d.brand.name}" from my bitkit kit: ${src}. Use the files in design-system/project/ exactly (tokens.json, README.md, components), upload assets/Logos/mark.svg as a Logos asset, and write the index last.`;
  window.open(`https://claude.ai/new?q=${encodeURIComponent(q)}`, "_blank", "noopener");
}

/* ---------- Claude: shared kit doc + in-page requests ---------- */
let kitRef = null, writeTimer = null, writing = false, pending = false, sample = null;
function queueSync() { if (!kitRef) return; clearTimeout(writeTimer); writeTimer = setTimeout(flush, 900); }
async function flush() {
  if (!kitRef) return; if (writing) { pending = true; return; }
  const body = JSON.stringify(d); if (body === lastSynced) return;
  writing = true;
  try { await kitRef.set({ kit: JSON.parse(body), by: "page", at: Date.now() }); lastSynced = body; syncState = "Synced with Claude"; }
  catch (e) { syncState = e?.code === "not_granted" ? "Claude sync is off for this view" : "Sync paused; changes stay in this browser"; }
  finally { writing = false; const el = $('[data-region="sync"]'); if (el) el.textContent = syncState; if (pending) { pending = false; flush(); } }
}
async function connectClaude() {
  if (!window.claude?.use) return;
  const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
  if (db && user) {
    const id = await user.id();
    if (id) {
      kitRef = db.collection(`data/users/${id}`).doc("kit");
      syncState = "Connecting to Claude…"; $('[data-region="sync"]').textContent = syncState;
      const timer = setTimeout(() => { syncState = "Claude sync didn’t answer; changes stay in this browser"; $('[data-region="sync"]').textContent = syncState; }, 10000);
      kitRef.onSnapshot((snap) => {
        clearTimeout(timer);
        if (!snap.exists) { syncState = "Synced with Claude"; flush(); return; }
        const data = snap.data(), body = JSON.stringify(data?.kit ?? null);
        if (data?.kit && body !== lastSynced && body !== JSON.stringify(d)) {
          d = G.normalize(data.kit); lastSynced = JSON.stringify(d);
          if (data.by === "claude") toast = data.note ? `Claude: ${data.note}` : "Claude updated the kit.";
          renderPanel_fromRemote();
        } else lastSynced = body;
        syncState = "Synced with Claude"; const el = $('[data-region="sync"]'); if (el) el.textContent = syncState;
      }, () => { syncState = "Sync paused; changes stay in this browser"; const el = $('[data-region="sync"]'); if (el) el.textContent = syncState; });
    }
  }
  sample = await window.claude.use("sample");
  if (sample) $("#ask-box").hidden = false;
}
function renderPanel_fromRemote() {
  $("#panel").innerHTML = views[STEPS[step].id]() + `<div class="nav"><button class="btn ghost" type="button" data-act="prev" ${step === 0 ? "disabled" : ""}>Back</button>${step < STEPS.length - 1 ? `<button class="btn" type="button" data-act="next">Next: ${STEPS[step + 1].t}</button>` : ""}</div>`;
  refresh({ fromRemote: true });
  $("#ask-status").textContent = toast;
}
const ALLOWED = () => ({ platforms: G.PLATFORMS.map((p) => p.id), fonts: G.FONTS.map((f) => f.name), markKinds: ["seal", "circle", "square"], devex: G.DEVEX.map((x) => x.id), ci: G.WORKFLOWS.map((x) => x.id), mcp: G.MCP.map((x) => x.id), skills: G.SKILLS.map((x) => x.id), modules: G.MODULES.map((x) => x.id), services: G.SERVICES.map((x) => x.id), hostingModels: G.HOSTING.map((x) => x.id), agentSizes: ["lean", "full"], agentPurposes: ["brand", "studio"] });
function merge(base, patch) {
  if (Array.isArray(patch) || typeof patch !== "object" || patch === null) return patch;
  const out = { ...(base || {}) }; for (const [k, v] of Object.entries(patch)) out[k] = merge(base?.[k], v); return out;
}
async function askClaude() {
  const q = $("#ask").value.trim(); if (!q || !sample) return;
  const btn = $("#ask-btn"); btn.disabled = true; $("#ask-status").textContent = "Asking Claude…";
  try {
    const res = await sample.json([{ role: "user", content: `You edit a brand identity kit for the bitkit builder. Return only JSON of the form {"changes": <object>, "summary": "<one sentence>"}.\n"changes" is a partial copy of the draft below holding only the fields to change; arrays replace whole arrays. Use only these allowed values where they apply: ${JSON.stringify(ALLOWED())}. Colors are 6-digit hex. Never add fields that create, sign in to, or post on accounts.\n\nDraft:\n${JSON.stringify(d)}\n\nRequest: ${q}` }], { modelTier: "default" });
    if (!res || typeof res.changes !== "object") throw new Error("no changes came back");
    d = G.normalize(merge(d, res.changes));
    toast = res.summary ? `Claude: ${res.summary}` : "Claude updated the kit."; $("#ask").value = "";
    renderPanel(); $("#ask-status").textContent = toast;
  } catch (e) {
    $("#ask-status").textContent = e?.code === "not_granted" ? "Claude requests are off for this view." : e?.code === "rate_limited" ? "Too many requests; try again in a minute." : `That didn’t apply: ${e?.message || "unknown error"}.`;
  } finally { btn.disabled = false; }
}

/* ---------- events ---------- */
function setPath(path, val) { const ks = path.split("."); let o = d; while (ks.length > 1) o = o[ks.shift()]; o[ks[0]] = val; }
document.addEventListener("input", (e) => {
  const t = e.target;
  if (t.dataset.bind) { let v = "num" in t.dataset ? Number(t.value) : t.value; if (t.dataset.bind === "handle.primary") v = v.trim().replace(/^@/, ""); if ("num" in t.dataset && !Number.isFinite(v)) return; setPath(t.dataset.bind, v); refresh(); }
  else if (t.dataset.override) { const v = t.value.trim().replace(/^@/, ""); if (v) d.handle.overrides[t.dataset.override] = v; else delete d.handle.overrides[t.dataset.override]; refresh(); const a = $(`[data-override="${t.dataset.override}"]`); if (a) { a.focus(); a.setSelectionRange(a.value.length, a.value.length); } }
  else if (t.dataset.bio) { if (t.value.trim()) d.voice.bios[t.dataset.bio] = t.value; else delete d.voice.bios[t.dataset.bio]; refresh(); }
  else if (t.dataset.color) { d.palette[t.dataset.color] = t.value; $(`[data-hex="${t.dataset.color}"]`).value = t.value; $(`[data-well="${t.dataset.color}"]`).style.background = t.value; refresh(); }
  else if (t.dataset.hex) { const v = t.value.trim().startsWith("#") ? t.value.trim() : "#" + t.value.trim(); d.palette[t.dataset.hex] = v; if (validHex(v)) { $(`[data-color="${t.dataset.hex}"]`).value = v; $(`[data-well="${t.dataset.hex}"]`).style.background = v; } refresh(); }
});
document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset.toggle) { const [list, id] = t.dataset.toggle.split(":"); d[list] = t.checked ? [...new Set([...d[list], id])] : d[list].filter((x) => x !== id); refresh(); }
  if (t.id === "f-import" && t.files?.[0]) t.files[0].text().then((txt) => { try {
    const j = JSON.parse(txt); if (j.schema !== "bitkit.kit/v1") throw new Error("not a bitkit.kit/v1 file");
    d = G.normalize({ ...j, platforms: (j.platforms || []).map((p) => (typeof p === "string" ? p : p.id)), palette: Object.fromEntries(["primary", "secondary", "accent", "ink", "paper"].map((n) => [n, j.palette?.[n]])), mark: { kind: j.mark?.kind, glyphs: j.mark?.glyphs } });
    toast = `Imported ${d.brand.name}.`; renderPanel(); } catch (err) { toast = `That file didn’t import: ${err.message}.`; refresh(); } });
});
document.addEventListener("keydown", (e) => {
  const t = e.target;
  if (e.key === "Enter" && t.dataset.add) { e.preventDefault(); const v = t.value.trim(); if (!v) return; if (t.dataset.add === "keywords") { if (d.brand.keywords.length < 5) d.brand.keywords.push(v); } else d.voice[t.dataset.add].push(v); t.value = ""; refresh(); }
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && t.id === "ask") askClaude();
});
document.addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.step) { step = Number(b.dataset.step); renderPanel(); $("#panel")?.scrollIntoView?.({ block: "start" }); return; }
  if (b.dataset.pick) { d.handle.primary = b.dataset.pick; renderPanel(); return; }
  if (b.dataset.del) { const [k, i] = b.dataset.del.split(":"); (k === "keywords" ? d.brand.keywords : d.voice[k]).splice(Number(i), 1); refresh(); return; }
  if (b.dataset.preset) { const { name, ...pal } = G.PRESETS[Number(b.dataset.preset)]; d.palette = pal; renderPanel(); return; }
  if (b.dataset.set) { const [path, v] = b.dataset.set.split("="); setPath(path, v); renderPanel(); return; }
  if (b.dataset.file) { openFile = b.dataset.file; renderPreview(); return; }
  if (b.dataset.domain) { d.deploy.domain = d.deploy.domain === b.dataset.domain ? "" : b.dataset.domain; refresh(); return; }
  const act = b.dataset.act;
  if (act === "next") { step = Math.min(step + 1, STEPS.length - 1); renderPanel(); $("#panel")?.scrollIntoView?.({ block: "start" }); }
  else if (act === "prev") { step = Math.max(step - 1, 0); renderPanel(); }
  else if (act === "plat-all") { d.platforms = G.PLATFORMS.map((p) => p.id); renderPanel(); }
  else if (act === "plat-none") { d.platforms = []; renderPanel(); }
  else if (act?.startsWith("dl-")) exportAs(act.slice(3));
  else if (act === "publish") publishKit();
  else if (act === "copy-prompt") copyPrompt(b);
  else if (act === "ds-zip") exportAs("ds");
  else if (act === "ds-claude") createInClaude();
  else if (act === "reset") { d = G.normalize(G.blank()); toast = "Started a fresh kit."; step = 0; renderPanel(); }
});
for (const [id, tab] of [["tab-book", "book"], ["tab-prof", "prof"], ["tab-files", "files"]]) $("#" + id).addEventListener("click", () => { previewTab = tab; renderPreview(); });
$("#ask-btn").addEventListener("click", askClaude);
$("#theme-btn").addEventListener("click", () => { const r = document.documentElement, dark = r.dataset.theme ? r.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; r.dataset.theme = dark ? "light" : "dark"; });
$("#app-mark").innerHTML = G.markSvg({ ...G.blank(), palette: { ...G.PRESETS[0] }, mark: { kind: "seal", glyphs: "b" }, type: { heading: "Bricolage Grotesque" } }, 30);
{ const q = new URLSearchParams(location.search); if (HOSTED && q.get("step") === "export") step = STEPS.length - 1;
  renderPanel(); connectClaude();
  if (HOSTED) loadMe().then(() => { if (q.get("publish") === "1" && ME) { history.replaceState(null, "", "/"); publishKit(); } }); }
