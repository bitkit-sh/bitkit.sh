"use strict";
/* bitkit generator: pure functions from a draft kit to a file map. No DOM access, so it runs in the page, in Bun, and in tests. */
const BITKIT = (() => {
  const REVIEWED = "2026-11-08";
  const V = { wrangler: "4.152.0", oxlint: "1.89.0", biome: "2.6.3", vitest: "4.1.12", poolWorkers: "0.23.0", lefthook: "2.2.2", paperclip: "2026.1023.0", bun: "1.4", node: "26", compat: "2026-11-08", cf: "latest", vite: "8.3.5", vitePlugin: "2.0.0-beta.v.4", typescript: "7.0.2",
    actions: { checkout: "actions/checkout@v7", bun: "oven-sh/setup-bun@v2", wrangler: "cloudflare/wrangler-action@v4", mise: "jdx/mise-action@v5", node: "actions/setup-node@v7" } };

  const PLATFORMS = [
    { id: "instagram", name: "Instagram", group: "Social", min: 1, max: 30, pattern: /^[a-z0-9._]+$/, rule: "lowercase letters, numbers, periods, underscores", bio: 150, avatar: "320×320", banner: null, url: "https://instagram.com/{h}", signup: "https://www.instagram.com/accounts/emailsignup/" },
    { id: "threads", name: "Threads", group: "Social", min: 1, max: 30, pattern: /^[a-z0-9._]+$/, rule: "same as Instagram", bio: 150, avatar: "320×320", banner: null, url: "https://threads.net/@{h}", signup: "https://www.threads.net/" },
    { id: "x", name: "X", group: "Social", min: 4, max: 15, pattern: /^[A-Za-z0-9_]+$/, rule: "letters, numbers, underscores", bio: 160, avatar: "400×400", banner: "1500×500", url: "https://x.com/{h}", signup: "https://x.com/i/flow/signup" },
    { id: "tiktok", name: "TikTok", group: "Social", min: 2, max: 24, pattern: /^[a-z0-9._]+$/, rule: "lowercase letters, numbers, periods, underscores", bio: 80, avatar: "200×200", banner: null, url: "https://tiktok.com/@{h}", signup: "https://www.tiktok.com/signup" },
    { id: "bluesky", name: "Bluesky", group: "Social", min: 3, max: 18, pattern: /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, rule: "lowercase letters, numbers, inner hyphens (.bsky.social)", bio: 256, avatar: "1000×1000", banner: "3000×1000", url: "https://bsky.app/profile/{h}.bsky.social", signup: "https://bsky.app/" },
    { id: "facebook", name: "Facebook Page", group: "Social", min: 5, max: 50, pattern: /^[A-Za-z0-9.]+$/, rule: "letters, numbers, periods", bio: 255, avatar: "320×320", banner: "851×315", url: "https://facebook.com/{h}", signup: "https://www.facebook.com/pages/create" },
    { id: "mastodon", name: "Mastodon", group: "Social", min: 1, max: 30, pattern: /^[A-Za-z0-9_]+$/, rule: "letters, numbers, underscores", bio: 500, avatar: "400×400", banner: "1500×500", url: "https://mastodon.social/@{h}", signup: "https://joinmastodon.org/servers" },
    { id: "reddit", name: "Reddit", group: "Social", min: 3, max: 20, pattern: /^[A-Za-z0-9_-]+$/, rule: "letters, numbers, underscores, hyphens", bio: 200, avatar: "256×256", banner: "1920×384", url: "https://reddit.com/user/{h}", signup: "https://www.reddit.com/register/" },
    { id: "linkedin", name: "LinkedIn Page", group: "Professional", min: 2, max: 100, pattern: /^[a-z0-9-]+$/, rule: "lowercase letters, numbers, hyphens", bio: 120, avatar: "400×400", banner: "1128×191", url: "https://linkedin.com/company/{h}", signup: "https://www.linkedin.com/company/setup/new/" },
    { id: "youtube", name: "YouTube", group: "Creator", min: 3, max: 30, pattern: /^[A-Za-z0-9._-]+$/, rule: "letters, numbers, periods, underscores, hyphens", bio: 1000, avatar: "800×800", banner: "2560×1440", url: "https://youtube.com/@{h}", signup: "https://www.youtube.com/create_channel" },
    { id: "twitch", name: "Twitch", group: "Creator", min: 4, max: 25, pattern: /^[a-z0-9_]+$/, rule: "lowercase letters, numbers, underscores", bio: 300, avatar: "256×256", banner: "1200×480", url: "https://twitch.tv/{h}", signup: "https://www.twitch.tv/signup" },
    { id: "pinterest", name: "Pinterest", group: "Creator", min: 3, max: 30, pattern: /^[A-Za-z0-9_]+$/, rule: "letters, numbers, underscores", bio: 500, avatar: "280×280", banner: "1600×900", url: "https://pinterest.com/{h}", signup: "https://www.pinterest.com/business/create/" },
    { id: "github", name: "GitHub", group: "Developer", min: 1, max: 39, pattern: /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/, rule: "letters, numbers, inner hyphens", bio: 160, avatar: "500×500", banner: null, url: "https://github.com/{h}", signup: "https://github.com/account/organizations/new" },
    { id: "etsy", name: "Etsy shop", group: "Commerce", min: 4, max: 20, pattern: /^[A-Za-z0-9]+$/, rule: "letters and numbers only", bio: 55, avatar: "500×500", banner: "3360×840", url: "https://etsy.com/shop/{h}", signup: "https://www.etsy.com/sell" }
  ];
  const GROUPS = ["Social", "Professional", "Creator", "Developer", "Commerce"];
  const FONTS = [
    ["Bricolage Grotesque", "system-ui, sans-serif"], ["Fraunces", "Georgia, serif"], ["Instrument Serif", "Georgia, serif"], ["DM Serif Display", "Georgia, serif"],
    ["Syne", "system-ui, sans-serif"], ["Archivo", "system-ui, sans-serif"], ["Space Grotesk", "system-ui, sans-serif"], ["Hanken Grotesk", "system-ui, sans-serif"],
    ["IBM Plex Sans", "system-ui, sans-serif"], ["Work Sans", "system-ui, sans-serif"], ["Source Serif 4", "Georgia, serif"], ["Literata", "Georgia, serif"],
    ["Manrope", "system-ui, sans-serif"], ["Atkinson Hyperlegible", "system-ui, sans-serif"]
  ].map(([name, fb]) => ({ name, fb }));
  const PRESETS = [
    { name: "Sealing wax", primary: "#8e1b2e", secondary: "#2b3a55", accent: "#e8b54a", ink: "#17161a", paper: "#f7f4f0" },
    { name: "Juniper", primary: "#2f5d50", secondary: "#a8c3a0", accent: "#e07a3f", ink: "#1b2420", paper: "#f3f5f0" },
    { name: "Harbor", primary: "#1f4e79", secondary: "#88b4d8", accent: "#f2c14e", ink: "#0f1b2a", paper: "#f2f5f9" },
    { name: "Ember", primary: "#c2410c", secondary: "#3f3a36", accent: "#facc15", ink: "#1c1917", paper: "#fbf7f2" },
    { name: "Orchid", primary: "#6d28d9", secondary: "#f0abfc", accent: "#22d3ee", ink: "#1e1b2e", paper: "#f8f7fc" }
  ];
  const CATEGORIES = ["Bakery & food", "Coffee & café", "Studio & agency", "Retail shop", "Software", "Wellness", "Creator", "Nonprofit", "Trades & services", "Other"];

  const MCP = [
    { id: "cloudflare-docs", name: "Cloudflare docs", url: "https://docs.mcp.cloudflare.com/mcp", why: "Answers from current Cloudflare documentation" },
    { id: "cloudflare-bindings", name: "Cloudflare bindings", url: "https://bindings.mcp.cloudflare.com/mcp", why: "Workers, KV, R2, D1 in your account" },
    { id: "cloudflare-builds", name: "Cloudflare builds", url: "https://builds.mcp.cloudflare.com/mcp", why: "Workers build logs" },
    { id: "cloudflare-observability", name: "Cloudflare observability", url: "https://observability.mcp.cloudflare.com/mcp", why: "Worker logs and metrics" },
    { id: "github", name: "GitHub", url: "https://api.githubcopilot.com/mcp", why: "Issues, pull requests, Actions runs" },
    { id: "context7", name: "Context7", url: "https://mcp.context7.com/mcp", why: "Current library docs" },
    { id: "mdn", name: "MDN", url: "https://mcp.mdn.mozilla.net", why: "Web platform reference" },
    { id: "figma", name: "Figma", url: "https://mcp.figma.com/mcp", why: "Design files and variables" }
  ];
  const SERVICES = [
    { id: "kv", name: "KV", binding: "CACHE", helper: "bindings.kv()", why: "Menu and page cache" },
    { id: "d1", name: "D1", binding: "DB", helper: `bindings.d1({ name: "${"{slug}"}-db" })`, why: "SQLite: orders, loyalty, forms" },
    { id: "r2", name: "R2", binding: "MEDIA", helper: `bindings.r2({ name: "${"{slug}"}-media" })`, why: "Photos and downloads" },
    { id: "queue", name: "Queues", binding: "JOBS", helper: `bindings.queue({ name: "${"{slug}"}-jobs" })`, why: "Background jobs" },
    { id: "ai", name: "Workers AI", binding: "AI", helper: "bindings.ai()", why: "Menu copy, alt text, search" },
    { id: "vectorize", name: "Vectorize", binding: "VECTORS", helper: `bindings.vectorize({ name: "${"{slug}"}-index" })`, why: "Semantic search over content" },
    { id: "images", name: "Images", binding: "IMAGES", helper: "bindings.images()", why: "Resize and transform photos" },
    { id: "browser", name: "Browser Run", binding: "BROWSER", helper: "bindings.browser()", why: "Screenshots and PDFs" },
    { id: "analytics", name: "Analytics Engine", binding: "EVENTS", helper: "bindings.analyticsEngineDataset()", why: "Visit and order events" },
    { id: "email", name: "Send Email", binding: "MAILER", helper: "bindings.sendEmail()", why: "Order and contact emails" },
    { id: "ratelimit", name: "Rate limiting", binding: "LIMITER", helper: `bindings.rateLimit({ namespace: "1001", simple: { limit: 60, period: 60 } })`, why: "Protect forms and APIs" },
    { id: "loader", name: "Dynamic Workers", binding: "LOADER", helper: "bindings.workerLoader()", why: "Run generated code in isolates on demand" }
  ];
  const HOSTING = [
    { id: "platform", name: "bitkit platform", why: "Runs in bitkit’s account as a Workers for Platforms tenant" },
    { id: "connect", name: "Owner’s account", why: "Deployed into the owner’s own account after they connect it" }
  ];
  const WORKFLOWS = [
    { id: "ci", name: "Check", why: "Lint, format, kit validation, tests on every push" },
    { id: "deploy", name: "Deploy", why: "Deploys the brand site from main" },
    { id: "preview", name: "Pull request build", why: "Runs cf build on every pull request" },
    { id: "actions-audit", name: "Workflow audit", why: "Lints workflows with actionlint and zizmor" }
  ];
  const SKILLS = [
    { id: "brand-voice", name: "Brand voice", why: "Writes copy in the kit’s voice and bio limits" },
    { id: "brand-tokens", name: "Brand tokens", why: "Applies palette, type, radius from tokens.css" },
    { id: "kit-editor", name: "Kit editor", why: "Edits bitkit.kit.json and regenerates the bundle" },
    { id: "account-launch", name: "Account launch prep", why: "Prepares profile sheets; you create the accounts" },
    { id: "domain-search", name: "Domain search", why: "Finds and checks domains with cf; the owner registers" }
  ];
  const DEVEX = [
    { id: "mise", name: "mise", why: "Pins bun, node, just, lefthook" },
    { id: "just", name: "just", why: "One task runner: check, dev, deploy" },
    { id: "lefthook", name: "lefthook", why: "Pre-commit lint and kit validation" },
    { id: "oxlint", name: "oxlint", why: "Lint" },
    { id: "biome", name: "Biome", why: "Format and lint" },
    { id: "editorconfig", name: "EditorConfig", why: "Shared whitespace rules" },
    { id: "devcontainer", name: "Dev container", why: "Reproducible workspace with mise" },
    { id: "vitest", name: "Vitest", why: "Wired beside bun test" }
  ];
  const MODULES = [
    { id: "brand", name: "Brand kit", why: "Brand book, guide, tokens, mark, profile sheets", locked: true },
    { id: "accounts", name: "Account checklist", why: "ACCOUNTS.md: what you sign up for, in order" },
    { id: "devex", name: "Dev experience", why: "Tooling and editor config" },
    { id: "deploy", name: "Cloudflare project", why: "cloudflare.config.ts, Worker, Vite, and domain scripts" },
    { id: "platform", name: "Cloudflare for Platforms", why: "platform/: dispatcher, Dynamic Workers, tenant provisioning" },
    { id: "ci", name: "GitHub Actions", why: "Workflows you picked" },
    { id: "mcp", name: "MCP config", why: ".mcp.json for Claude Code and other clients" },
    { id: "skills", name: "Agent skills", why: ".claude/skills generated from the kit" },
    { id: "agents", name: "Paperclip company", why: "company/ in agentcompanies/v1 format" },
    { id: "design-system", name: "Claude Design System", why: "design-system/project/: tokens, brand book, components for Claude" },
    { id: "a2ui", name: "A2UI wizard", why: "The same wizard as an A2UI v0.9 surface" }
  ];
  const ROLES = [
    { slug: "director", name: "Studio Director", title: "Chief Executive Officer", role: "ceo", icon: "crown", reportsTo: null, team: null, sizes: ["lean", "full"], model: "opus",
      job: "Owns the company goal, sets priorities across teams, and is the only agent that opens approval requests to the board.", triggers: "A new kit version, a blocked issue, a weekly review routine.", does: "Turns the kit into quarterly goals, sequences projects, reviews what each team ships.", produces: "Weekly status note, project priorities, approval requests.", handoff: "Brand Lead for identity work, CTO for platform work, Delivery Lead for launch work." },
    { slug: "brand-lead", name: "Brand Lead", title: "Creative Director", role: "cmo", icon: "gem", reportsTo: "director", team: "creative", sizes: ["lean", "full"], model: "sonnet", skills: ["brand-voice", "brand-tokens", "kit-editor"],
      job: "Owns bitkit.kit.json as the source of truth for name, palette, type, mark, and voice.", triggers: "Brand changes requested by the board, contrast or consistency findings.", does: "Edits the kit, runs regeneration, reviews every generated surface against the kit.", produces: "Kit changes with a short rationale, brand review notes.", handoff: "Identity Designer for marks and assets, Copywriter for words." },
    { slug: "identity-designer", name: "Identity Designer", title: "Visual Identity Designer", role: "designer", icon: "wand", reportsTo: "brand-lead", team: "creative", sizes: ["full"], model: "sonnet", skills: ["brand-tokens"],
      job: "Produces the mark, avatar, and banner assets at each platform’s sizes from the kit.", triggers: "Mark or palette changes, a new platform in the kit.", does: "Exports assets, checks contrast at small sizes, keeps assets/ in sync with tokens.", produces: "Asset files and a size table per platform.", handoff: "Brand Lead for approval." },
    { slug: "copywriter", name: "Copywriter", title: "Brand Copywriter", role: "general", icon: "message-square", reportsTo: "brand-lead", team: "creative", sizes: ["full"], model: "sonnet", skills: ["brand-voice", "account-launch"],
      job: "Writes bios, taglines, and first posts in the kit’s voice within each platform’s limits.", triggers: "Voice changes, new platforms, launch preparation.", does: "Drafts per-platform bios and launch copy, checks limits, flags conflicts with the do and avoid lists.", produces: "Copy in platforms/*.md and a launch copy doc.", handoff: "Brand Lead for review, Delivery Lead for launch." },
    { slug: "cto", name: "CTO", title: "Chief Technology Officer", role: "cto", icon: "cpu", reportsTo: "director", team: "engineering", sizes: ["full"], model: "opus", skills: ["kit-editor"],
      job: "Owns the repository, the generator, CI, and the Cloudflare deployment path.", triggers: "Failing checks, dependency or Action updates, deploy requests.", does: "Reviews engineering changes, keeps pins current, approves workflow changes.", produces: "Reviewed pull requests, upgrade plans.", handoff: "Platform Engineer for implementation, QA for verification." },
    { slug: "platform-engineer", name: "Platform Engineer", title: "Platform Engineer", role: "engineer", icon: "code", reportsTo: "cto", team: "engineering", sizes: ["lean", "full"], model: "sonnet", skills: ["kit-editor", "brand-tokens"],
      job: "Builds the brand site, scripts, and workflows generated from the kit.", triggers: "Issues in the web-presence and dev-platform projects.", does: "Implements changes with bun test and Vitest, runs just check, opens pull requests.", produces: "Pull requests with passing checks.", handoff: "QA Engineer, then CTO." },
    { slug: "edge-devops", name: "Edge DevOps", title: "Edge Deploy Engineer", role: "devops", icon: "globe", reportsTo: "cto", team: "engineering", sizes: ["full"], model: "sonnet", skills: [],
      job: "Owns cloudflare.config.ts, deploy scripts, and the deploy workflow into the Workers for Platforms namespace.", triggers: "Deploy requests, deploy workflow failures.", does: "Builds with cf build, deploys the tenant Worker after board approval, and verifies it at the tenant hostname.", produces: "A deploy log without credentials.", handoff: "Delivery Lead for launch." },
    { slug: "qa", name: "QA Engineer", title: "QA Engineer", role: "qa", icon: "bug", reportsTo: "cto", team: "engineering", sizes: ["full"], model: "sonnet",
      job: "Verifies every generated surface: brand book offline render, contrast, handle rules, bio limits.", triggers: "Pull requests, kit changes.", does: "Runs the kit validator and visual checks, files evidence-backed findings.", produces: "Pass or fail verdicts with evidence.", handoff: "Author of the change." },
    { slug: "delivery-lead", name: "Delivery Lead", title: "Launch and Delivery Lead", role: "pm", icon: "rocket", reportsTo: "director", team: "delivery", sizes: ["lean", "full"], model: "sonnet", skills: ["account-launch"],
      job: "Prepares the launch: ACCOUNTS.md, profile sheets, and the order in which the owner creates accounts.", triggers: "Kit ready for launch, new platform selected.", does: "Builds the checklist, confirms every field is ready to paste, tracks which accounts the owner reports as created.", produces: "An up-to-date ACCOUNTS.md and a launch status note.", handoff: "The board, who creates every account personally." },
    { slug: "security", name: "Security Lead", title: "Security and Trust", role: "security", icon: "shield", reportsTo: "director", team: "delivery", sizes: ["full"], model: "sonnet", skills: [],
      job: "Guards credentials and supply chain: tokens, Action pins, dependency scores.", triggers: "New dependencies, workflow edits, deploy changes.", does: "Reviews pins and permissions, checks that tokens never reach issues or logs.", produces: "Findings with severity and a fix.", handoff: "CTO for remediation." }
  ];

  /* ---------- helpers ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slugify = (s) => String(s || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/['’]/g, "").replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const compact = (s) => slugify(s).replace(/-/g, "");
  const font = (n) => { const f = FONTS.find((x) => x.name === n); return `"${n}", ${f ? f.fb : "system-ui, sans-serif"}`; };
  const validHex = (h) => /^#[0-9a-fA-F]{6}$/.test(h || "");
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const lum = (h) => rgb(h).map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }).reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0);
  const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const mix = (a, b, t) => "#" + rgb(a).map((c, i) => Math.round(c + (rgb(b)[i] - c) * t).toString(16).padStart(2, "0")).join("");
  const onColor = (bg) => (contrast(bg, "#ffffff") >= contrast(bg, "#111111") ? "#ffffff" : "#111111");
  const trimBio = (b, n) => { if (b.length <= n) return b; const cut = b.slice(0, n - 1); const sp = cut.lastIndexOf(" "); return (sp > n * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,.;:]+$/, "") + "…"; };
  const checkHandle = (p, h) => !h ? { ok: false, msg: "Empty" } : h.length < p.min ? { ok: false, msg: `Min ${p.min} characters` } : h.length > p.max ? { ok: false, msg: `Max ${p.max} characters (${h.length})` } : !p.pattern.test(h) ? { ok: false, msg: `Allowed: ${p.rule}` } : { ok: true, msg: "Fits" };
  const yamlStr = (s) => JSON.stringify(String(s ?? ""));
  const GH = (expr) => "${{ " + expr + " }}";
  const fence = (lang, body) => "```" + lang + "\n" + body + "\n```";

  function blank() {
    return {
      schema: "bitkit.kit/v1",
      brand: { name: "Cooper’s Coffee", slug: "coopers-coffee", tagline: "Small-batch coffee, roasted down the street.", category: "Coffee & café", keywords: ["coffee", "roastery", "neighborhood"] },
      handle: { primary: "cooperscoffee", overrides: {} },
      platforms: ["instagram", "tiktok", "facebook", "threads", "youtube"],
      palette: { primary: "#5a3a22", secondary: "#c9a27e", accent: "#2f6f5e", ink: "#1f1611", paper: "#faf6f1" },
      type: { heading: "DM Serif Display", body: "Work Sans", scale: 1.25 }, shape: { radius: 10 }, mark: { kind: "circle", glyphs: "C" },
      voice: { formality: 0.6, playfulness: 0.5, boldness: 0.4, do: ["Name the origin and the roast date", "Greet regulars by their usual"], dont: ["Coffee puns in every post", "Discount-first language"], bio: "Small-batch coffee roasted in the back room and poured out front. Beans roasted Tuesday and Friday, open daily from 6.", bios: {} },
      repo: { host: "github", owner: "coopers-coffee", name: "brand" },
      deploy: { worker: "coopers-coffee", domain: "" },
      domain: { query: "coopers coffee", results: [], checkedAt: "", account: "" },
      services: ["kv", "d1", "r2", "ai", "analytics"],
      hosting: { model: "platform", namespace: "bitkit-tenants", platformZone: "bitkit.sh" },
      devex: ["mise", "just", "lefthook", "oxlint", "biome", "editorconfig", "devcontainer", "vitest"],
      ci: ["ci", "deploy", "preview", "actions-audit"],
      mcp: ["cloudflare-docs", "cloudflare-bindings", "cloudflare-observability", "github", "context7"],
      skills: ["brand-voice", "brand-tokens", "kit-editor", "account-launch", "domain-search"],
      agents: { purpose: "brand", size: "lean", budgetCents: 2500, timezone: "America/Chicago" },
      publish: { id: "", setup: "", publishedAt: "" },
      modules: MODULES.map((m) => m.id).filter((id) => id !== "platform")
    };
  }
  // Fill any field a stored or imported draft lacks.
  function normalize(d) {
    const b = blank(), out = { ...b, ...d };
    for (const k of ["brand", "handle", "palette", "type", "shape", "mark", "voice", "repo", "deploy", "domain", "hosting", "agents", "publish"]) out[k] = { ...b[k], ...(d?.[k] || {}) };
    out.handle.overrides = { ...(out.handle.overrides || {}) }; out.voice.bios = { ...(out.voice.bios || {}) };
    for (const k of ["platforms", "devex", "ci", "mcp", "skills", "services", "modules", "brand.keywords", "domain.results"]) {
      const [a, c] = k.split("."); if (c) { if (!Array.isArray(out[a][c])) out[a][c] = b[a][c]; } else if (!Array.isArray(out[a])) out[a] = b[a];
    }
    if (!out.modules.includes("brand")) out.modules.unshift("brand");
    // Sites run on the bitkit platform (Workers for Platforms) or the owner’s own account; older kits may name models or skills that no longer exist.
    if (!HOSTING.some((h) => h.id === out.hosting.model)) out.hosting.model = "platform";
    out.skills = out.skills.filter((s) => s !== "cf-preview-claim");
    delete out.deploy.preview;
    out.schema = "bitkit.kit/v1";
    return out;
  }
  const selected = (d) => PLATFORMS.filter((p) => d.platforms.includes(p.id));
  const handleFor = (d, pid) => d.handle.overrides[pid] || d.handle.primary;
  const bioFor = (d, pid) => d.voice.bios[pid] || d.voice.bio;
  const darkPalette = (p) => ({ primary: mix(p.primary, "#ffffff", 0.25), secondary: mix(p.secondary, "#ffffff", 0.2), accent: p.accent, ink: mix(p.paper, "#ffffff", 0.4), paper: mix(p.ink, "#000000", 0.2) });

  function candidates(d) {
    const words = slugify(d.brand.name).split("-").filter(Boolean), base = words.join("");
    const set = new Set([base, words.slice(0, 2).join(""), words.join("_"), words.join("."), base + "hq", "the" + base, "hello" + base,
      words.map((w) => w[0]).join("") + (d.brand.keywords[0] ? compact(d.brand.keywords[0]) : "studio")]);
    return [...set].filter((h) => h && h.length >= 2).slice(0, 8);
  }
  function problems(d) {
    const out = [];
    if (!d.brand.name.trim()) out.push("Add a brand name.");
    if (!d.platforms.length) out.push("Pick at least one platform.");
    for (const p of selected(d)) { const c = checkHandle(p, handleFor(d, p.id)); if (!c.ok) out.push(`${p.name} handle: ${c.msg}.`); }
    for (const k of ["primary", "secondary", "accent", "ink", "paper"]) if (!validHex(d.palette[k])) out.push(`Palette ${k} needs a 6-digit hex value.`);
    if (d.deploy.domain && !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/.test(d.deploy.domain)) out.push("Domain must look like name.tld, lowercase.");
    if ((d.modules.includes("deploy") || d.modules.includes("platform")) && !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(d.deploy.worker)) out.push("Worker name: lowercase letters, numbers, inner hyphens, 63 characters at most.");
    if (d.modules.includes("ci") && (!d.repo.owner || !d.repo.name)) out.push("Add a repository owner and name for the workflows.");
    return out;
  }

  function markSvg(d, size = 120) {
    const p = d.palette, g = esc((d.mark.glyphs || "?").slice(0, 3)), fs = g.length > 2 ? 34 : g.length > 1 ? 42 : 54, fg = onColor(p.primary);
    let shape;
    if (d.mark.kind === "seal") {
      const pts = []; for (let i = 0; i <= 72; i++) { const t = (i / 72) * Math.PI * 2, r = 56 + 3.2 * Math.cos(t * 18); pts.push(`${(60 + r * Math.cos(t)).toFixed(2)},${(60 + r * Math.sin(t)).toFixed(2)}`); }
      shape = `<polygon points="${pts.join(" ")}" fill="${p.primary}"/><circle cx="60" cy="60" r="44" fill="none" stroke="${fg}" stroke-opacity="0.45" stroke-width="1.5"/>`;
    } else if (d.mark.kind === "circle") shape = `<circle cx="60" cy="60" r="58" fill="${p.primary}"/>`;
    else shape = `<rect x="2" y="2" width="116" height="116" rx="${Math.min(d.shape.radius * 1.5, 40)}" fill="${p.primary}"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="${esc(d.brand.name)} mark">${shape}<text x="60" y="61" text-anchor="middle" dominant-baseline="central" font-family='${font(d.type.heading).replace(/'/g, "")}' font-weight="700" font-size="${fs}" fill="${fg}" letter-spacing="-1">${g}</text></svg>`;
  }

  /* ---------- the exported kit ---------- */
  function buildKit(d, now = new Date()) {
    return {
      $schema: "./schema/bitkit.kit.v1.json", schema: "bitkit.kit/v1", generatedAt: now.toISOString().replace(/\.\d{3}Z$/, "Z"),
      brand: { ...d.brand, slug: d.brand.slug || slugify(d.brand.name) },
      handle: { primary: d.handle.primary, candidates: candidates(d), overrides: { ...d.handle.overrides } },
      platforms: selected(d).map((p) => ({ id: p.id, name: p.name, handle: handleFor(d, p.id), url: p.url.replace("{h}", handleFor(d, p.id)), signup: p.signup, bio: trimBio(bioFor(d, p.id), p.bio), bioLimit: p.bio, avatar: p.avatar, banner: p.banner })),
      palette: { ...d.palette, dark: darkPalette(d.palette) }, type: { ...d.type }, shape: { ...d.shape }, mark: { ...d.mark, svg: markSvg(d, 512) },
      voice: { formality: d.voice.formality, playfulness: d.voice.playfulness, boldness: d.voice.boldness, do: [...d.voice.do], dont: [...d.voice.dont], bio: d.voice.bio, bios: { ...d.voice.bios } },
      repo: { ...d.repo }, deploy: { ...d.deploy }, domain: { ...d.domain, results: d.domain.results.map((r) => ({ ...r })) }, services: [...d.services], hosting: { ...d.hosting }, publish: { ...d.publish }, devex: [...d.devex], ci: [...d.ci], mcp: [...d.mcp], skills: [...d.skills], agents: { ...d.agents }, modules: [...d.modules],
      reviewed: { platforms: REVIEWED }
    };
  }
  const head = (k, kind) => `Generated by bitkit from bitkit.kit.json (schema ${k.schema}) at ${k.generatedAt}. Edit the JSON, not this ${kind}.`;
  const S = (k) => k.brand.slug;
  const pct = (x) => Math.round(x * 100);

  function tokensCss(k) {
    const v = (o, pad) => Object.entries(o).filter(([n]) => n !== "dark").map(([n, c]) => `${pad}--brand-${n}: ${c};`).join("\n");
    return `/* ${head(k, "file")} */\n:root {\n${v(k.palette, "  ")}\n  --brand-font-heading: ${font(k.type.heading)};\n  --brand-font-body: ${font(k.type.body)};\n  --brand-radius: ${k.shape.radius}px;\n  --brand-scale: ${k.type.scale};\n}\n@media (prefers-color-scheme: dark) {\n  :root {\n${v(k.palette.dark, "    ")}\n  }\n}\n`;
  }
  function tokensJson(k) {
    const col = (o) => Object.fromEntries(Object.entries(o).filter(([n]) => n !== "dark").map(([n, c]) => [n, { $type: "color", $value: c }]));
    const fam = (n) => [n, ...(FONTS.find((f) => f.name === n)?.fb.split(", ") || [])];
    return JSON.stringify({ $description: head(k, "file"), color: col(k.palette), "color-dark": col(k.palette.dark),
      font: { heading: { $type: "fontFamily", $value: fam(k.type.heading) }, body: { $type: "fontFamily", $value: fam(k.type.body) } },
      radius: { base: { $type: "dimension", $value: { value: k.shape.radius, unit: "px" } } } }, null, 2) + "\n";
  }
  function brandMd(k) {
    return [`---`, `schema: ${k.schema}`, `source: ../bitkit.kit.json`, `generatedAt: ${k.generatedAt}`, `---`, ``, `# ${k.brand.name}`, ``, k.brand.tagline, ``, `## Identity`, ``,
      `| Field | Value |`, `| --- | --- |`, `| Name | ${k.brand.name} |`, `| Slug | \`${k.brand.slug}\` |`, `| Category | ${k.brand.category} |`, `| Primary handle | @${k.handle.primary} |`, `| Keywords | ${k.brand.keywords.join(", ")} |`, ``,
      `## Palette`, ``, `| Role | Light | Dark |`, `| --- | --- | --- |`, ...["primary", "secondary", "accent", "ink", "paper"].map((n) => `| ${n} | \`${k.palette[n]}\` | \`${k.palette.dark[n]}\` |`), ``,
      `Ink on paper contrast: ${contrast(k.palette.ink, k.palette.paper).toFixed(2)}:1.`, ``,
      `## Type`, ``, `- Headings: ${k.type.heading}`, `- Body: ${k.type.body}`, `- Scale ratio: ${k.type.scale}`, `- Corner radius: ${k.shape.radius}px`, ``,
      `## Mark`, ``, `A ${k.mark.kind} monogram reading “${k.mark.glyphs}” in the primary color. File: \`assets/mark.svg\`.`, ``,
      `## Voice`, ``, `- Formal ${100 - pct(k.voice.formality)}% / casual ${pct(k.voice.formality)}%`, `- Serious ${100 - pct(k.voice.playfulness)}% / playful ${pct(k.voice.playfulness)}%`, `- Reserved ${100 - pct(k.voice.boldness)}% / bold ${pct(k.voice.boldness)}%`, ``,
      `**We say:** ${k.voice.do.join("; ") || "none listed"}`, ``, `**We avoid:** ${k.voice.dont.join("; ") || "none listed"}`, ``, `### Bio`, ``, `> ${k.voice.bio}`, ``,
      `## Platforms`, ``, `| Platform | Handle | Profile |`, `| --- | --- | --- |`, ...k.platforms.map((p) => `| ${p.name} | @${p.handle} | ${p.url} |`), ``].join("\n");
  }
  function platformMd(k, p) {
    const f = (t, v) => `## ${t}\n\n${fence("text", v)}\n`;
    return [`---`, `platform: ${p.id}`, `source: ../../bitkit.kit.json`, `generatedAt: ${k.generatedAt}`, `---`, ``, `# ${p.name}: ${k.brand.name}`, ``,
      f("Handle", p.handle), f("Profile URL", p.url), f("Display name", k.brand.name), f(`Bio (limit ${p.bioLimit})`, p.bio),
      f("Link", k.deploy.domain ? `https://${k.deploy.domain}` : `https://${k.deploy.worker}.<your-subdomain>.workers.dev`),
      `## Images`, ``, `| Asset | Size (px) | Source |`, `| --- | --- | --- |`, `| Avatar | ${p.avatar} | assets/mark.svg |`, ...(p.banner ? [`| Banner | ${p.banner} | brand book hero |`] : []), ``].join("\n");
  }
  function brandBook(k) {
    const p = k.palette, d = p.dark;
    return `<!doctype html>
<${"!"}-- ${head(k, "page")} -->
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(k.brand.name)} · Brand book</title>
<style>
${tokensCss(k).replace(/^\/\*.*\*\/\n/, "")}
*{box-sizing:border-box}body{margin:0;background:var(--brand-paper);color:var(--brand-ink);font-family:var(--brand-font-body);line-height:1.55}
main{max-width:920px;margin:0 auto;padding:56px 24px 80px}
header{display:grid;gap:18px;padding-bottom:40px;border-bottom:1px solid color-mix(in srgb,var(--brand-ink) 15%,transparent)}
h1,h2{font-family:var(--brand-font-heading);letter-spacing:-.02em;line-height:1.1}
h1{font-size:clamp(2.4rem,7vw,4.2rem);margin:0}h2{font-size:1.6rem;margin:48px 0 16px}
.tag{font-size:1.2rem;opacity:.8;margin:0}.mark svg{width:140px;height:140px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.sw{border-radius:var(--brand-radius);overflow:hidden;border:1px solid color-mix(in srgb,var(--brand-ink) 12%,transparent)}
.sw div{height:110px}.sw p{margin:0;padding:10px 12px;font-size:.9rem}.sw code{font-family:ui-monospace,monospace;font-size:.85rem}
.spec{font-family:var(--brand-font-heading);font-size:clamp(1.8rem,5vw,3rem);margin:0}
.tw{overflow-x:auto}table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:10px;border-bottom:1px solid color-mix(in srgb,var(--brand-ink) 12%,transparent)}
.btn{display:inline-block;background:var(--brand-primary);color:${onColor(p.primary)};padding:12px 18px;border-radius:var(--brand-radius);text-decoration:none;font-weight:600}
blockquote{margin:0;padding:16px 20px;border-left:4px solid var(--brand-accent);background:color-mix(in srgb,var(--brand-accent) 10%,transparent);border-radius:0 var(--brand-radius) var(--brand-radius) 0}
footer{margin-top:64px;font-size:.85rem;opacity:.7}
</style></head><body><main>
<header><div class="mark">${markSvg(k, 140)}</div><h1>${esc(k.brand.name)}</h1><p class="tag">${esc(k.brand.tagline)}</p><div><a class="btn" href="${esc(k.platforms[0]?.url || "#")}">Find us @${esc(k.handle.primary)}</a></div></header>
<h2>Palette</h2><div class="grid">${["primary", "secondary", "accent", "ink", "paper"].map((n) => `<div class="sw"><div style="background:${p[n]}"></div><p>${n}<br><code>${p[n]}</code> · dark <code>${d[n]}</code></p></div>`).join("")}</div>
<h2>Type</h2><p class="spec">${esc(k.type.heading)} for headings</p><p>${esc(k.type.body)} sets the body. ${esc(k.voice.bio)}</p>
<h2>Voice</h2><blockquote>${esc(k.voice.bio)}</blockquote>
<div class="tw"><table><thead><tr><th>We say</th><th>We avoid</th></tr></thead><tbody>${Array.from({ length: Math.max(k.voice.do.length, k.voice.dont.length) }, (_, i) => `<tr><td>${esc(k.voice.do[i] || "")}</td><td>${esc(k.voice.dont[i] || "")}</td></tr>`).join("")}</tbody></table></div>
<h2>Where to find us</h2><div class="tw"><table><thead><tr><th>Platform</th><th>Handle</th><th>Avatar</th><th>Banner</th></tr></thead><tbody>${k.platforms.map((x) => `<tr><td>${esc(x.name)}</td><td><a href="${esc(x.url)}">@${esc(x.handle)}</a></td><td>${x.avatar}</td><td>${x.banner || "none"}</td></tr>`).join("")}</tbody></table></div>
<footer>Generated from bitkit.kit.json (${k.schema}) on ${k.generatedAt}.</footer>
</main></body></html>
`;
  }

  /* ---------- accounts: the owner creates every account ---------- */
  function accountsMd(k) {
    return [`# Accounts to create: ${k.brand.name}`, ``,
      `You create each account yourself, signed in as the brand owner. Nothing in this bundle signs up for, logs in to, or posts on any platform. Each row links to the platform’s own sign-up page and to the profile sheet with every field ready to paste.`, ``,
      `Platform rules were last reviewed ${k.reviewed.platforms}. Check each platform’s current rules as you go.`, ``,
      `## Checklist`, ``,
      ...k.platforms.map((p) => `- [ ] **${p.name}** as @${p.handle}: sign up at ${p.signup}, then fill the profile from [brand/platforms/${p.id}.md](brand/platforms/${p.id}.md)`), ``,
      `## Domain`, ``, ...(k.domain.results.filter((r) => r.registrable).slice(0, 5).map((r) => `- [ ] ${r.name}: ${r.registration_cost ? `$${r.registration_cost} first year, $${r.renewal_cost} renewal` : "check price"} (checked ${k.domain.checkedAt || "not yet"})`)), ...(k.domain.results.length ? [] : [`- [ ] Run \`just domains\` to search`]), `- [ ] Register your pick yourself in your Cloudflare account, then set \`deploy.domain\` in the kit`, ``,
      ...(k.modules.includes("deploy") ? [`## Cloudflare`, ``, `- [ ] Create or sign in to your Cloudflare account at https://dash.cloudflare.com/sign-up`, `- [ ] For CI deploys, create an API token scoped to Workers and add \`CLOUDFLARE_API_TOKEN\` and \`CLOUDFLARE_ACCOUNT_ID\` as repository secrets`, ``] : []),
      ...(k.modules.includes("ci") ? [`## Repository`, ``, `- [ ] Create \`${k.repo.owner}/${k.repo.name}\` on GitHub and push this bundle`, ``] : []),
      `## After each account exists`, ``, `Tell your agents which accounts are live by ticking the box above and committing. The Delivery Lead reads this file; agents never hold platform passwords.`, ``].join("\n");
  }

  /* ---------- dev experience ---------- */
  const has = (k, list, id) => k[list].includes(id);
  function devexFiles(k) {
    const f = {};
    if (has(k, "devex", "mise")) f["mise.toml"] = `# ${head(k, "file")}\n[tools]\nbun = "${V.bun}"\nnode = "${V.node}"\njust = "latest"\nlefthook = "${V.lefthook}"\n\n[settings]\nexperimental = true\n`;
    if (has(k, "devex", "editorconfig")) f[".editorconfig"] = `root = true\n\n[*]\ncharset = utf-8\nend_of_line = lf\nindent_style = space\nindent_size = 2\ninsert_final_newline = true\ntrim_trailing_whitespace = true\n\n[*.md]\ntrim_trailing_whitespace = false\n`;
    if (has(k, "devex", "biome")) f["biome.json"] = JSON.stringify({ $schema: `https://biomejs.dev/schemas/${V.biome}/schema.json`, files: { includes: ["**", "!brand/index.html", "!company/**"] }, formatter: { indentStyle: "space", indentWidth: 2, lineWidth: 100 }, linter: { enabled: true, rules: { recommended: true } } }, null, 2) + "\n";
    if (has(k, "devex", "oxlint")) f[".oxlintrc.json"] = JSON.stringify({ $schema: "./node_modules/oxlint/configuration_schema.json", categories: { correctness: "error", suspicious: "warn" }, ignorePatterns: ["brand/**", "company/**"] }, null, 2) + "\n";
    if (has(k, "devex", "lefthook")) f["lefthook.yml"] = `# ${head(k, "file")}\npre-commit:\n  parallel: true\n  commands:\n    kit:\n      glob: "bitkit.kit.json"\n      run: bun scripts/validate-kit.ts\n${has(k, "devex", "oxlint") ? `    oxlint:\n      glob: "*.{ts,js}"\n      run: bunx oxlint@${V.oxlint} {staged_files}\n` : ""}${has(k, "devex", "biome") ? `    biome:\n      glob: "*.{ts,js,json}"\n      run: bunx @biomejs/biome@${V.biome} check --no-errors-on-unmatched {staged_files}\n` : ""}`;
    if (has(k, "devex", "devcontainer")) f[".devcontainer/devcontainer.json"] = JSON.stringify({ name: `${k.brand.name} brand`, image: "mcr.microsoft.com/devcontainers/base:ubuntu", features: { "ghcr.io/devcontainers-extra/features/mise:1": {} }, postCreateCommand: "mise trust && mise install && just setup", forwardPorts: [8787] }, null, 2) + "\n";
    if (has(k, "devex", "vitest")) {
      f["vitest.config.ts"] = `// ${head(k, "file")}\nimport { defineConfig } from "vitest/config";\n\nexport default defineConfig({ test: { include: ["tests/**/*.test.ts"] } });\n`;
    }
    f["tests/kit.test.ts"] = `// Runs under bun test and Vitest.\nimport { expect, test } from "${has(k, "devex", "vitest") ? "vitest" : "bun:test"}";\nimport kit from "../bitkit.kit.json";\n\ntest("kit uses schema bitkit.kit/v1", () => {\n  expect(kit.schema).toBe("bitkit.kit/v1");\n});\n\ntest("every bio fits its platform", () => {\n  for (const p of kit.platforms) expect(p.bio.length).toBeLessThanOrEqual(p.bioLimit);\n});\n`;
    f[".gitignore"] = `node_modules/\n.wrangler/\n.cloudflare/\n.tmp/\n.dev.vars\n.env*\n!.env.example\n`;
    if (has(k, "devex", "just")) f["justfile"] = justfile(k);
    return f;
  }
  function justfile(k) {
    const L = [`# ${head(k, "file")}`, `set shell := ["sh", "-eu", "-c"]`, ``, `default:`, `    @just --list`, ``,
      `# Install pinned tools and git hooks`, `setup:`, ...(has(k, "devex", "mise") ? [`    mise install`] : []), ...(has(k, "devex", "lefthook") ? [`    bunx lefthook@${V.lefthook} install`] : []), ``,
      `# Lint, format check, kit validation, tests`, `check:`, `    bun scripts/validate-kit.ts`,
      ...(has(k, "devex", "oxlint") ? [`    bunx oxlint@${V.oxlint} .`] : []), ...(has(k, "devex", "biome") ? [`    bunx @biomejs/biome@${V.biome} ci .`] : []), `    bun test`, ``,
      ...(has(k, "devex", "vitest") ? [`# Vitest run`, `test-workers:`, `    bunx vitest@${V.vitest} run`, ``] : []),
      `# Serve the site and API locally (cf needs Node 22.18+, not Bun)`, `dev:`, `    npx cf@latest dev`, ``, `# Build and validate without uploading`, `build:`, `    npx cf@latest build`, ``, `# Generate Env types from cloudflare.config.ts and typecheck the Worker`, `typecheck:`, `    npx cf@latest workers types`, `    npx tsc --noEmit`, ``, `# Search and check domains in your Cloudflare account (read-only)`, `domains query="":`, `    sh scripts/find-domain.sh {{query}}`, ``,
      `# Deploy with your own Cloudflare account`, `deploy:`, `    bun scripts/validate-kit.ts`, `    npx cf@latest deploy`, ``, ...(k.modules.includes("platform") ? [`# Deploy into the bitkit platform namespace`, `deploy-tenant:`, `    sh scripts/deploy-tenant.sh`, ``] : []),
      `# Publish the kit to bitkit.sh and print its curl setup command`, `publish:`, `    sh scripts/publish-kit.sh`, ``, `# Lint GitHub workflows`, `audit-actions:`, `    actionlint`, `    zizmor .github/workflows`, ``];
    if (k.modules.includes("agents")) L.push(`# Preview the Paperclip company import without applying it`, `company-preview:`, `    bunx paperclipai@${V.paperclip} company import ./company --target new --dry-run`, ``);
    return L.join("\n");
  }

  /* ---------- deploy: a cf project with cloudflare.config.ts ---------- */
  const svc = (k) => SERVICES.filter((x) => k.services.includes(x.id));
  const helperFor = (k, x) => x.helper.replace("{slug}", S(k));
  function cfConfig(k, { tenant = false } = {}) {
    const env = svc(k).map((x) => `      ${x.binding}: ${helperFor(k, x)},`).join("\n");
    const domains = k.deploy.domain && !tenant ? `\n    domains: [${JSON.stringify(k.deploy.domain)}],` : "";
    return `// ${head(k, "file")}
// Typed configuration for the cf CLI (open beta): https://developers.cloudflare.com/cf/projects/cloudflare-config/
// Requires Node.js 22.18 or later; cf does not load this file under Bun.
import { bindings, defineConfig } from "cf/config";
import * as entrypoint from "./src/index.ts" with { type: "cf-worker" };

export default defineConfig(({ mode }) => ({
  worker: {
    name: ${JSON.stringify(k.deploy.worker)},
    compatibilityDate: "${V.compat}",
    entrypoint,
    assets: { notFoundHandling: "404-page", runWorkerFirst: ["/api/*"] },${domains}
    env: {
      BRAND_NAME: bindings.text(${JSON.stringify(k.brand.name)}),
      STAGE: bindings.text(mode === "production" ? "production" : "development"),
${env}
    },
  },
}));
`;
  }
  function workerSrc(k) {
    const has2 = (id) => k.services.includes(id);
    const routes = [
      has2("kv") && `    if (url.pathname === "/api/menu") {\n      const cached = await env.CACHE.get("menu", "json");\n      return Response.json(cached ?? { items: [], note: "Seed the menu with: npx cf@latest kv ..." });\n    }`,
      has2("d1") && `    if (url.pathname === "/api/signups" && request.method === "POST") {\n      const { email } = (await request.json()) as { email?: string };\n      if (!email || !email.includes("@")) return Response.json({ error: "email required" }, { status: 400 });\n      await env.DB.prepare("INSERT INTO signups (email, created_at) VALUES (?, ?)").bind(email, Date.now()).run();\n      return Response.json({ ok: true }, { status: 201 });\n    }`,
      has2("analytics") && `    env.EVENTS.writeDataPoint({ blobs: [url.pathname], indexes: [env.BRAND_NAME] });`,
      has2("ai") && `    if (url.pathname === "/api/describe" && request.method === "POST") {\n      const { item } = (await request.json()) as { item?: string };\n      const out = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", { prompt: \`Write one sentence for a café menu describing: \${item}. No exclamation marks.\` });\n      return Response.json(out);\n    }`,
      has2("loader") && `    if (url.pathname === "/api/widget") {\n      // Dynamic Worker: runs generated code in a fresh isolate with no network access.\n      const worker = env.LOADER.get("widget-v1", async () => ({\n        compatibilityDate: "${V.compat}",\n        mainModule: "widget.js",\n        modules: { "widget.js": "export default { fetch() { return new Response('hello from a dynamic worker') } }" },\n        globalOutbound: null,\n      }));\n      return worker.getEntrypoint().fetch(request);\n    }`
    ].filter(Boolean).join("\n");
    return `// ${head(k, "file")}
// API routes run first (assets.runWorkerFirst); everything else is the brand site in brand/.
export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") return Response.json({ ok: true, brand: env.BRAND_NAME, stage: env.STAGE });
${routes}
    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
`;
  }
  function deployFiles(k) {
    const f = {};
    f["package.json"] = JSON.stringify({ name: S(k), private: true, type: "module",
      scripts: { dev: "cf dev", build: "cf build", types: "cf workers types", typecheck: "cf workers types && tsc --noEmit", deploy: "cf deploy", test: "bun test" },
      devDependencies: { cf: V.cf, vite: V.vite, "@cloudflare/vite-plugin": V.vitePlugin, typescript: V.typescript } }, null, 2) + "\n";
    f["cloudflare.config.ts"] = cfConfig(k, { tenant: k.hosting.model === "platform" });
    f["vite.config.ts"] = `// ${head(k, "file")}\nimport { cloudflare } from "@cloudflare/vite-plugin";\nimport { defineConfig } from "vite";\n\n// brand/ is the static site: brand book, tokens, profile sheets.\nexport default defineConfig({\n  publicDir: "brand",\n  plugins: [cloudflare()],\n});\n`;
    f["src/index.ts"] = workerSrc(k);
    f["tsconfig.json"] = JSON.stringify({ compilerOptions: { target: "esnext", module: "esnext", moduleResolution: "bundler", strict: true, noEmit: true, skipLibCheck: true, allowImportingTsExtensions: true, types: [] }, include: ["src", "cloudflare.config.ts", ".cloudflare/types/index.d.ts"] }, null, 2) + "\n";
    if (k.services.includes("d1")) f["migrations/0001_init.sql"] = `-- ${head(k, "file")}\nCREATE TABLE IF NOT EXISTS signups (\n  email TEXT PRIMARY KEY,\n  created_at INTEGER NOT NULL\n);\n`;
    f["scripts/find-domain.sh"] = `#!/bin/sh
# ${head(k, "script")}
# Searches and checks domain names with the cf CLI, using YOUR Cloudflare account
# (sign in first: npx cf@latest auth login). Read-only: nothing is registered.
# Register the one you pick yourself in the dashboard or with cf registrar.
set -eu
QUERY="\${1:-${k.domain.query || k.brand.name}}"
npx cf@latest registrar registrations search --query "$QUERY" --limit 12
${k.domain.results.length ? `npx cf@latest registrar registrations check --domains ${k.domain.results.slice(0, 6).map((r) => r.name).join(" ")}` : `# Then confirm live availability and price:\n# npx cf@latest registrar registrations check --domains name.com name.co`}
`;
    return f;
  }

  /* ---------- Cloudflare for Platforms ---------- */
  function platformFiles(k) {
    const f = {}, ns = k.hosting.namespace, zone = k.hosting.platformZone;
    f["platform/package.json"] = JSON.stringify({ name: "bitkit-platform", private: true, type: "module", scripts: { dev: "cf dev", build: "cf build", typecheck: "cf workers types && tsc --noEmit", deploy: "cf deploy" }, devDependencies: { cf: V.cf, vite: V.vite, "@cloudflare/vite-plugin": V.vitePlugin, typescript: V.typescript } }, null, 2) + "\n";
    f["platform/tsconfig.json"] = JSON.stringify({ compilerOptions: { target: "esnext", module: "esnext", moduleResolution: "bundler", strict: true, noEmit: true, skipLibCheck: true, allowImportingTsExtensions: true, types: [] }, include: ["src", "cloudflare.config.ts", ".cloudflare/types/index.d.ts"] }, null, 2) + "\n";
    f["platform/vite.config.ts"] = `import { cloudflare } from "@cloudflare/vite-plugin";\nimport { defineConfig } from "vite";\n\nexport default defineConfig({ plugins: [cloudflare()] });\n`;
    f["platform/cloudflare.config.ts"] = `// ${head(k, "file")}
// The bitkit platform Worker: routes tenant hostnames into a Workers for Platforms
// dispatch namespace, runs Dynamic Workers, and provisions tenants with a Workflow.
import { bindings, defineConfig, exports, triggers } from "cf/config";
import * as entrypoint from "./src/index.ts" with { type: "cf-worker" };
// Owner domains attached to the platform (apex and www per tenant). cf deploy keeps only
// the domains listed here, so add a tenant domain to this file before redeploying.
import tenantDomains from "./tenant-domains.json" with { type: "json" };

export default defineConfig({
  worker: {
    name: "bitkit-platform",
    compatibilityDate: "${V.compat}",
    entrypoint,
    domains: ["${zone}", "app.${zone}", ...tenantDomains],
    observability: { enabled: true, issues: { enabled: true }, logs: { enabled: true }, traces: { enabled: true } },
    triggers: [triggers.fetch({ pattern: "*.${zone}/*", zone: "${zone}" })],
    env: {
      TENANTS: bindings.dispatchNamespace({ namespace: ${JSON.stringify(ns)} }),
      LOADER: bindings.workerLoader(),
      REGISTRY: bindings.d1({ name: "bitkit-registry" }),
      KITS: bindings.r2({ name: "bitkit-kits" }),
      ACCOUNTS: bindings.d1({ name: "bitbuilder-accounts" }),
      AUTH: bindings.worker({ worker: "bitbuilder-auth" }),
      PUBLISH_LIMIT: bindings.rateLimit({ namespace: "2001", simple: { limit: 10, period: 60 } }),
      PUBLISH_TOKEN: bindings.secret(),
      SESSION_SECRET: bindings.secret(),
      PROVISION: bindings.workflow({ name: "provision-tenant", worker: "bitkit-platform", exportName: "ProvisionTenant" }),
      PLATFORM_ZONE: bindings.text(${JSON.stringify(zone)}),
      CF_ACCOUNT_ID: bindings.secret(),
      CF_PLATFORM_TOKEN: bindings.secret(),
    },
    exports: { ProvisionTenant: exports.workflow({ name: "provision-tenant" }) },
  },
});
`;
    f["platform/src/index.ts"] = "// __HEAD__\nimport { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from \"cloudflare:workers\";\nimport bitkit from \"./generator.js\";\nimport { handleMcp } from \"./mcp.ts\";\nimport { renderKitSite } from \"./kitsite.ts\";\nimport { kitPrompt, llmsTxt, setupPrompt } from \"./agentsetup.ts\";\nimport { authRoutes, billingRoutes, sessionUser } from \"./account.ts\";\nimport { insufficientScope, OAuthResourceServer } from \"@cloudflare/workers-oauth-provider\";\n// Served by the identity Worker over a Service Binding, on this origin (the way mcp.cloudflare.com works).\nconst IDENTITY_PATHS = /^\\/(\\.well-known\\/oauth-authorization-server(\\/.*)?|authorize|token|register|revoke|oauth\\/[a-z_]+|signup|login|logout|forgot|reset|verify|account)$/;\nconst MCP_WRITES = new Set([\"update_kit\", \"submit_design_system\", \"request_deploy\"]);\nconst mcpServer = new OAuthResourceServer<Env, { userId: string; email: string }>({\n  resourceMetadata: { resource: \"https://app.bitkit.sh/mcp\", authorization_servers: [\"https://app.bitkit.sh\"], resource_name: \"bitkit\", bearer_methods_supported: [\"header\"] },\n  requiredScopes: [\"kits:read\"],\n  validateToken: (env) => (env.AUTH as unknown as { validateToken: (r: string, t: string) => Promise<any> }).validateToken,\n  handler: {\n    async fetch(request, env, ctx) {\n      if (request.method === \"POST\") {\n        const body = await request.clone().json().catch(() => null) as any;\n        const calls = (Array.isArray(body) ? body : [body]).filter((m: any) => m?.method === \"tools/call\");\n        if (calls.some((c: any) => MCP_WRITES.has(c.params?.name)) && !ctx.auth.scope.includes(\"kits:write\")) return insufficientScope(ctx.auth, [\"kits:read\", \"kits:write\"]);\n      }\n      return handleMcp(request, env, new URL(request.url).origin, ctx.props.userId);\n    },\n  },\n});\n\nconst md = (body: string) => new Response(body, { headers: { \"content-type\": \"text/markdown; charset=utf-8\", \"cache-control\": \"public, max-age=300\", \"access-control-allow-origin\": \"*\" } });\nasync function agentDocs(env: Env, url: URL): Promise<Response | null> {\n  if (url.pathname === \"/llms.txt\") return new Response(llmsTxt(), { headers: { \"content-type\": \"text/plain; charset=utf-8\", \"cache-control\": \"public, max-age=300\" } });\n  if (url.pathname === \"/agent-setup/prompt.md\") return md(setupPrompt());\n  const k = url.pathname.match(/^\\/agent-setup\\/([a-z2-7]{20})\\.md$/);\n  if (k) {\n    const row = await env.REGISTRY.prepare(\"SELECT k.name, t.hostname FROM kits k LEFT JOIN tenants t ON t.kit_id = k.id WHERE k.id = ?\").bind(k[1]).first<{ name: string; hostname: string | null }>();\n    return row ? md(kitPrompt(k[1], row.name, row.hostname ? `https://${row.hostname}` : null)) : new Response(\"Unknown kit\", { status: 404 });\n  }\n  return null;\n}\n\ntype Tenant = { slug: string; script: string; hostname: string; owner: string; status: string; setup_hash: string | null };\ntype KitRecord = { id: string; slug: string; name: string; published_at: number };\nconst APEX = \"__ZONE__\";\n// The kit API and setup scripts live on app.<zone>; every other <slug>.<zone> is a tenant.\nconst APP = `app.${APEX}`;\nexport const RESERVED_SLUGS = new Set([\"app\", \"www\", \"api\", \"admin\", \"mail\"]);\n\nconst b32 = (bytes: Uint8Array) => {\n  const a = \"abcdefghijklmnopqrstuvwxyz234567\";\n  let bits = 0, value = 0, out = \"\";\n  for (const byte of bytes) { value = (value << 8) | byte; bits += 8; while (bits >= 5) { out += a[(value >>> (bits - 5)) & 31]; bits -= 5; } }\n  return bits > 0 ? out + a[(value << (5 - bits)) & 31] : out;\n};\nconst hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, \"0\")).join(\"\");\n// Compares fixed-length digests so timing does not reveal how much of the token matched.\nconst safeEqual = async (a: string, b: string) => {\n  const [x, y] = await Promise.all([a, b].map((v) => crypto.subtle.digest(\"SHA-256\", new TextEncoder().encode(v))));\n  const u = new Uint8Array(x), w = new Uint8Array(y);\n  let diff = 0;\n  for (let i = 0; i < u.length; i++) diff |= u[i] ^ w[i];\n  return diff === 0;\n};\n\n// Builds the bundle once per kit and caches it in R2, so the checksum in the setup script always matches the bytes served.\nasync function bundle(env: Env, id: string): Promise<{ bytes: ArrayBuffer; sha: string; kit: KitRecord } | null> {\n  if (!/^[a-z2-7]{20}$/.test(id)) return null;\n  const kit = await env.REGISTRY.prepare(\"SELECT id, slug, name, published_at FROM kits WHERE id = ?\").bind(id).first<KitRecord>();\n  if (!kit) return null;\n  const cached = await env.KITS.get(`kits/${id}/bundle.tar.gz`);\n  if (cached) return { bytes: await cached.arrayBuffer(), sha: cached.customMetadata?.sha256 ?? \"\", kit };\n  const source = await env.KITS.get(`kits/${id}/bitkit.kit.json`);\n  if (!source) return null;\n  const draft = bitkit.normalize(await source.json());\n  const { files } = bitkit.generate(draft, new Date(kit.published_at));\n  const tarBytes = bitkit.tar(files, kit.slug, kit.published_at);\n  const bytes = await new Response(new Blob([tarBytes]).stream().pipeThrough(new CompressionStream(\"gzip\"))).arrayBuffer();\n  const sha = hex(await crypto.subtle.digest(\"SHA-256\", bytes));\n  await env.KITS.put(`kits/${id}/bundle.tar.gz`, bytes, { httpMetadata: { contentType: \"application/gzip\" }, customMetadata: { sha256: sha } });\n  return { bytes, sha, kit };\n}\n\nasync function apex(request: Request, env: Env, url: URL, ctx: ExecutionContext): Promise<Response> {\n  if (url.pathname === \"/api/kits\" && request.method === \"POST\") {\n    // Operators publish with the bearer token; the hosted builder publishes same-origin, rate limited per IP.\n    const auth = request.headers.get(\"authorization\") ?? \"\";\n    const operator = auth !== \"\" && (await safeEqual(auth, `Bearer ${env.PUBLISH_TOKEN}`));\n    if (!operator) {\n      if (request.headers.get(\"origin\") !== url.origin) return Response.json({ error: \"unauthorized\" }, { status: 401 });\n      const ip = request.headers.get(\"cf-connecting-ip\") ?? \"unknown\";\n      const { success } = await env.PUBLISH_LIMIT.limit({ key: ip });\n      if (!success) return Response.json({ error: \"too many publishes; try again in a minute\" }, { status: 429 });\n    }\n    const body = await request.text();\n    if (body.length > 65536) return Response.json({ error: \"kit too large (64 KB max)\" }, { status: 413 });\n    const draft = bitkit.normalize(JSON.parse(body));\n    const owner = operator ? null : (await sessionUser(request, env)).user;\n    if (!operator && !owner) return Response.json({ error: \"Sign in to publish\", login: `${url.origin}/auth/login?return=/` }, { status: 401 });\n    const problems = bitkit.problems(draft);\n    if (problems.length) return Response.json({ error: \"invalid kit\", problems }, { status: 422 });\n    const id = b32(crypto.getRandomValues(new Uint8Array(12))).slice(0, 20);\n    const publishedAt = Date.now();\n    await env.KITS.put(`kits/${id}/bitkit.kit.json`, JSON.stringify(draft), { httpMetadata: { contentType: \"application/json\" } });\n    const key = `bk_${b32(crypto.getRandomValues(new Uint8Array(20)))}`;\n    const keyHash = hex(await crypto.subtle.digest(\"SHA-256\", new TextEncoder().encode(key)));\n    await env.REGISTRY.prepare(\"INSERT INTO kits (id, slug, name, published_at, key_hash, updated_at, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?)\").bind(id, draft.brand.slug, draft.brand.name, publishedAt, keyHash, publishedAt, owner?.id ?? null).run();\n    return Response.json({ id, key, setup: `curl -fsSL ${url.origin}/setup/${id} | sh`, tarball: `${url.origin}/kits/${id}.tar.gz`, kitSite: `${url.origin}/kits/${id}/`, mcp: `${url.origin}/mcp`, publishedAt }, { status: 201 });\n  }\n  if (url.pathname === \"/mcp\" || url.pathname.startsWith(\"/.well-known/oauth-protected-resource\")) {\n    if (url.pathname === \"/.well-known/oauth-protected-resource\") return mcpServer.fetch(new Request(`${url.origin}/.well-known/oauth-protected-resource/mcp`, request), env, ctx);\n    return mcpServer.fetch(request, env, ctx);\n  }\n  if (IDENTITY_PATHS.test(url.pathname)) return env.AUTH.fetch(request);\n  const ar = await authRoutes(request, url, env); if (ar) return ar;\n  const br = await billingRoutes(request, url, env); if (br) return br;\n  const doc = request.method === \"GET\" ? await agentDocs(env, url) : null;\n  if (doc) return doc;\n  if ((url.pathname === \"/plugin.zip\" || url.pathname === \"/skill.zip\") && request.method === \"GET\") {\n    const o = await env.KITS.get(`site/plugin${url.pathname}`);\n    return o ? new Response(o.body, { headers: { \"content-type\": \"application/zip\", \"content-disposition\": `attachment; filename=\"bitkit-${url.pathname.slice(1)}\"` } }) : new Response(\"Not found\", { status: 404 });\n  }\n  const ks = url.pathname.match(/^\\/kits\\/([a-z2-7]{20})(\\/.*)$/);\n  if (ks && request.method === \"GET\") return kitSite(env, ks[1], ks[2], url.origin);\n  let m = url.pathname.match(/^\\/kits\\/([a-z2-7]+)\\.tar\\.gz$/);\n  if (m && request.method === \"GET\") {\n    const b = await bundle(env, m[1]);\n    if (!b) return new Response(\"Unknown kit\", { status: 404 });\n    return new Response(b.bytes, { headers: { \"content-type\": \"application/gzip\", \"x-bitkit-sha256\": b.sha, \"cache-control\": \"public, max-age=31536000, immutable\" } });\n  }\n  m = url.pathname.match(/^\\/setup\\/([a-z2-7]+)$/);\n  if (m && request.method === \"GET\") {\n    const b = await bundle(env, m[1]);\n    if (!b) return new Response(\"echo 'bitkit: unknown kit id' >&2; exit 1\\n\", { status: 404, headers: { \"content-type\": \"text/plain; charset=utf-8\" } });\n    const script = bitkit.setupScript({ id: b.kit.id, slug: b.kit.slug, name: b.kit.name, sha: b.sha, origin: url.origin });\n    return new Response(script, { headers: { \"content-type\": \"text/plain; charset=utf-8\", \"cache-control\": \"no-store\" } });\n  }\n  if (url.pathname === \"/\" && request.method === \"GET\") {\n    const page = await env.KITS.get(\"site/app/index.html\");\n    if (page) return new Response(page.body, { headers: { \"content-type\": \"text/html; charset=utf-8\", \"cache-control\": \"public, max-age=300\", \"x-content-type-options\": \"nosniff\" } });\n  }\n  if (url.pathname === \"/\") return new Response(`bitkit: brand identity kits\\n\\nRun a kit's setup with:\\n  curl -fsSL ${url.origin}/setup/<kit-id> | sh\\n`, { headers: { \"content-type\": \"text/plain; charset=utf-8\" } });\n  return new Response(\"Not found\", { status: 404 });\n}\n\n// Kit site: the submitted Claude Design System, or the seed generated from the kit until one arrives.\nasync function kitSite(env: Env, id: string, path: string, origin: string, siteUrl?: string): Promise<Response> {\n  if (path.startsWith(\"/assets/\")) {\n    const o = await env.KITS.get(`kits/${id}/system/project${path}`);\n    return o ? new Response(o.body, { headers: { \"content-type\": o.httpMetadata?.contentType ?? (path.endsWith(\".svg\") ? \"image/svg+xml\" : \"application/octet-stream\"), \"cache-control\": \"public, max-age=300\" } }) : new Response(\"Not found\", { status: 404 });\n  }\n  if (path !== \"/\") return Response.redirect(`${origin}/kits/${id}/`, 302);\n  const manifest = await env.KITS.get(`kits/${id}/system.json`);\n  let files: Record<string, string> = {}, source: \"claude\" | \"seed\" = \"seed\", updatedAt: string | undefined;\n  if (manifest) {\n    const mf = await manifest.json<{ files: string[]; at: string }>();\n    for (const p of mf.files) { const o = await env.KITS.get(`kits/${id}/system/${p}`); if (o) files[p] = await o.text(); }\n    source = \"claude\"; updatedAt = mf.at.slice(0, 10);\n  } else {\n    const src = await env.KITS.get(`kits/${id}/bitkit.kit.json`);\n    if (!src) return new Response(\"Unknown kit\", { status: 404 });\n    const kit = bitkit.normalize(await src.json()); kit.modules = [...new Set([...kit.modules, \"design-system\"])];\n    for (const [p, c] of Object.entries(bitkit.generate(kit).files)) if (p.startsWith(\"design-system/project/\")) files[p.slice(\"design-system/\".length)] = c;\n  }\n  return new Response(renderKitSite(files, { source, siteUrl, updatedAt }), { headers: { \"content-type\": \"text/html; charset=utf-8\", \"cache-control\": \"public, max-age=60\" } });\n}\n\nasync function page(env: Env, key: string): Promise<Response | null> {\n  const o = await env.KITS.get(key);\n  return o ? new Response(o.body, { headers: { \"content-type\": \"text/html; charset=utf-8\", \"cache-control\": \"public, max-age=300\", \"x-content-type-options\": \"nosniff\" } }) : null;\n}\n\nexport default {\n  async fetch(request, env, ctx): Promise<Response> {\n    const url = new URL(request.url);\n    // app.<zone>, the apex, and workers.dev serve the kit API; every other hostname (<slug>.<zone> or an owner domain) is a tenant.\n    const host = url.hostname;\n    if (host === APEX) return Response.redirect(`https://www.${APEX}${url.pathname}${url.search}`, 301);\n    if (host === `www.${APEX}`) {\n      const doc = request.method === \"GET\" ? await agentDocs(env, url) : null;\n      if (doc) return doc;\n      return (await page(env, \"site/www/index.html\")) ?? Response.redirect(`https://${APP}/`, 302);\n    }\n    if (host === APP || host.endsWith(\".workers.dev\")) return apex(request, env, url, ctx);\n\n    // Kit sites: kit-<slug>.<zone> or kit.<owner domain>.\n    const kitSlug = host.match(new RegExp(`^kit-([a-z0-9-]+)\\\\.${APEX.replace(\".\", \"\\\\.\")}$`))?.[1];\n    const kitOwner = host.startsWith(\"kit.\") ? host.slice(4) : null;\n    if (kitSlug || kitOwner) {\n      const t = await env.REGISTRY.prepare(\"SELECT t.slug, t.hostname, t.kit_id FROM tenants t LEFT JOIN tenant_hosts h ON h.slug = t.slug WHERE (t.slug = ?1 OR h.hostname = ?2) AND t.kit_id IS NOT NULL LIMIT 1\").bind(kitSlug ?? \"\", kitOwner ?? \"\").first<{ slug: string; hostname: string; kit_id: string }>();\n      if (t) {\n        if (url.pathname.startsWith(\"/assets/\") || url.pathname === \"/\") return kitSite(env, t.kit_id, url.pathname, url.origin, `https://${kitOwner ?? t.hostname}`);\n        return Response.redirect(`${url.origin}/`, 302);\n      }\n    }\n\n    // Dynamic Workers: preview generated code in an isolate with no outbound network.\n    if (url.pathname.startsWith(\"/_bitkit/sandbox/\")) {\n      const id = url.pathname.split(\"/\")[3];\n      const row = await env.REGISTRY.prepare(\"SELECT code FROM snippets WHERE id = ?\").bind(id).first<{ code: string }>();\n      if (!row) return new Response(\"Unknown snippet\", { status: 404 });\n      const worker = env.LOADER.get(`snippet:${id}`, async () => ({\n        compatibilityDate: \"__COMPAT__\",\n        mainModule: \"main.js\",\n        modules: { \"main.js\": row.code },\n        globalOutbound: null,\n      }));\n      return worker.getEntrypoint().fetch(request);\n    }\n\n    // Tenant routing: <slug>.__ZONE__ plus any custom hostnames mapped in tenant_hosts.\n    const tenant = await env.REGISTRY.prepare(\"SELECT t.* FROM tenants t LEFT JOIN tenant_hosts h ON h.slug = t.slug WHERE (t.hostname = ?1 OR h.hostname = ?1) AND t.status = 'active' LIMIT 1\").bind(host).first<Tenant>();\n    if (!tenant) return new Response(\"No site here yet\", { status: 404 });\n\n    // EmDash's first-run setup makes the first visitor the admin, so the platform gates it:\n    // only a browser holding the owner's one-time setup cookie reaches the setup routes.\n    const setupPath = url.pathname.startsWith(\"/_emdash/admin/setup\") || (url.pathname.startsWith(\"/_emdash/api/setup\") && url.pathname !== \"/_emdash/api/setup/status\");\n    if (url.pathname === \"/_bitkit/setup\") {\n      const token = url.searchParams.get(\"token\") ?? \"\";\n      if (!tenant.setup_hash || hex(await crypto.subtle.digest(\"SHA-256\", new TextEncoder().encode(token))) !== tenant.setup_hash) return new Response(\"This setup link is not valid.\", { status: 403 });\n      return new Response(null, { status: 302, headers: { location: \"/_emdash/admin\", \"set-cookie\": `bitkit_setup=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400` } });\n    }\n    if (setupPath) {\n      const cookie = request.headers.get(\"cookie\")?.match(/(?:^|;\\s*)bitkit_setup=([^;]+)/)?.[1] ?? \"\";\n      const okSetup = tenant.setup_hash && hex(await crypto.subtle.digest(\"SHA-256\", new TextEncoder().encode(cookie))) === tenant.setup_hash;\n      if (!okSetup) return new Response(\"Setup is reserved for the site owner. Open the setup link bitkit sent you.\", { status: 403, headers: { \"content-type\": \"text/plain; charset=utf-8\" } });\n    }\n    try {\n      return await env.TENANTS.get(tenant.script).fetch(request);\n    } catch (e) {\n      if (e instanceof Error && e.message.startsWith(\"Worker not found\")) return new Response(\"Site is being set up\", { status: 503 });\n      throw e;\n    }\n  },\n} satisfies ExportedHandler<Env>;\n\n// Provisions one tenant from a bitkit.kit.json. Each step is retried on its own.\n// Creates resources in the PLATFORM account, never in the owner's, and never\n// creates social or registrar accounts.\ntype ProvisionParams = { kit: { brand: { slug: string; name: string }; services: string[] } };\nexport class ProvisionTenant extends WorkflowEntrypoint<Env, ProvisionParams> {\n  async run(event: WorkflowEvent<ProvisionParams>, step: WorkflowStep) {\n    const { kit } = event.payload;\n    if (RESERVED_SLUGS.has(kit.brand.slug)) throw new Error(`slug ${kit.brand.slug} is reserved`);\n    const slug = kit.brand.slug, script = `tenant-${slug}`, hostname = `${slug}.${this.env.PLATFORM_ZONE}`;\n    const api = (path: string, init: RequestInit = {}) =>\n      fetch(`https://api.cloudflare.com/client/v4/accounts/${this.env.CF_ACCOUNT_ID}${path}`, {\n        ...init,\n        headers: { authorization: `Bearer ${this.env.CF_PLATFORM_TOKEN}`, \"content-type\": \"application/json\" },\n      }).then(async (r) => { const j = await r.json<{ success: boolean; errors: unknown; result: any }>(); if (!j.success) throw new Error(JSON.stringify(j.errors)); return j.result; });\n\n    const resources = await step.do(\"create resources\", async () => {\n      const out: Record<string, string> = {};\n      if (kit.services.includes(\"kv\")) out.kv = (await api(\"/storage/kv/namespaces\", { method: \"POST\", body: JSON.stringify({ title: `${slug}-cache` }) })).id;\n      if (kit.services.includes(\"d1\")) out.d1 = (await api(\"/d1/database\", { method: \"POST\", body: JSON.stringify({ name: `${slug}-db` }) })).uuid;\n      if (kit.services.includes(\"r2\")) { await api(\"/r2/buckets\", { method: \"POST\", body: JSON.stringify({ name: `${slug}-media` }) }); out.r2 = `${slug}-media`; }\n      return out;\n    });\n    await step.do(\"register tenant\", async () => {\n      await this.env.REGISTRY.prepare(\"INSERT OR REPLACE INTO tenants (slug, script, hostname, owner, status, resources) VALUES (?, ?, ?, ?, 'pending', ?)\")\n        .bind(slug, script, hostname, \"\", JSON.stringify(resources)).run();\n    });\n    // The tenant's code is deployed with `npx cf@latest deploy --dispatch-namespace __NS__`, then activated here.\n    await step.waitForEvent(\"tenant deployed\", { type: \"tenant-deployed\", timeout: \"7 days\" });\n    await step.do(\"activate\", async () => {\n      await this.env.REGISTRY.prepare(\"UPDATE tenants SET status = 'active' WHERE slug = ?\").bind(slug).run();\n    });\n    return { slug, hostname, resources };\n  }\n}\n".replace("__HEAD__", head(k, "file")).replace(/__ZONE__/g, zone).replace(/__COMPAT__/g, V.compat).replace(/__NS__/g, ns);
    f["platform/migrations/0001_registry.sql"] = `-- ${head(k, "file")}
CREATE TABLE IF NOT EXISTS tenants (
  slug TEXT PRIMARY KEY,
  script TEXT NOT NULL,
  hostname TEXT NOT NULL UNIQUE,
  owner TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'suspended')),
  resources TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS kits (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  published_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS snippets (
  id TEXT PRIMARY KEY,
  tenant TEXT NOT NULL REFERENCES tenants(slug),
  code TEXT NOT NULL
);
`;
    f["platform/migrations/0002_tenant_hosts.sql"] = `-- ${head(k, "file")}\n-- Custom hostnames per tenant (apex and www of an owner domain, for example).\nCREATE TABLE IF NOT EXISTS tenant_hosts (\n  hostname TEXT PRIMARY KEY,\n  slug TEXT NOT NULL REFERENCES tenants(slug) ON DELETE CASCADE\n);\nCREATE INDEX IF NOT EXISTS tenant_hosts_slug ON tenant_hosts(slug);\n`;
    f["platform/tenant-domains.json"] = JSON.stringify(k.deploy.domain && k.agents.purpose !== "studio" ? [k.deploy.domain, `www.${k.deploy.domain}`] : [], null, 2) + "\n";
    Object.assign(f, {"platform/src/md.ts":"// Minimal Markdown to HTML for brand books: headings, paragraphs, lists, tables, code, emphasis, links.\nconst esc = (s: string) => s.replace(/[&<>\"']/g, (c) => ({ \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" })[c]!);\nconst inline = (s: string) =>\n  esc(s)\n    .replace(/`([^`]+)`/g, \"<code>$1</code>\")\n    .replace(/\\*\\*([^*]+)\\*\\*/g, \"<strong>$1</strong>\")\n    .replace(/\\[([^\\]]+)\\]\\((https?:[^)\\s]+|\\/[^)\\s]*|#[^)\\s]*)\\)/g, '<a href=\"$2\">$1</a>');\n\nexport function markdown(src: string): string {\n  const lines = src.replace(/\\r/g, \"\").split(\"\\n\");\n  const out: string[] = [];\n  let i = 0;\n  if (lines[0] === \"---\") { i = lines.indexOf(\"---\", 1) + 1; }\n  while (i < lines.length) {\n    const l = lines[i];\n    if (!l.trim()) { i++; continue; }\n    if (l.startsWith(\"```\")) {\n      const body: string[] = []; i++;\n      while (i < lines.length && !lines[i].startsWith(\"```\")) body.push(lines[i++]);\n      i++; out.push(`<pre><code>${esc(body.join(\"\\n\"))}</code></pre>`); continue;\n    }\n    const h = l.match(/^(#{1,4})\\s+(.*)$/);\n    if (h) { const n = h[1].length; const id = h[2].toLowerCase().replace(/[^a-z0-9]+/g, \"-\").replace(/^-|-$/g, \"\"); out.push(`<h${n} id=\"${id}\">${inline(h[2])}</h${n}>`); i++; continue; }\n    if (l.startsWith(\"|\")) {\n      const rows: string[][] = [];\n      while (i < lines.length && lines[i].startsWith(\"|\")) { rows.push(lines[i].split(\"|\").slice(1, -1).map((c) => c.trim())); i++; }\n      const [head, , ...body] = rows;\n      out.push(`<div class=\"tw\"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join(\"\")}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join(\"\")}</tr>`).join(\"\")}</tbody></table></div>`);\n      continue;\n    }\n    if (/^\\s*[-*]\\s+/.test(l)) {\n      const items: string[] = [];\n      while (i < lines.length && /^\\s*[-*]\\s+/.test(lines[i])) items.push(lines[i++].replace(/^\\s*[-*]\\s+(\\[[ x]\\]\\s+)?/, \"\"));\n      out.push(`<ul>${items.map((x) => `<li>${inline(x)}</li>`).join(\"\")}</ul>`); continue;\n    }\n    if (l.startsWith(\">\")) { const q: string[] = []; while (i < lines.length && lines[i].startsWith(\">\")) q.push(lines[i++].replace(/^>\\s?/, \"\")); out.push(`<blockquote>${inline(q.join(\" \"))}</blockquote>`); continue; }\n    const p: string[] = [];\n    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\\s|```|\\||\\s*[-*]\\s|>)/.test(lines[i])) p.push(lines[i++]);\n    out.push(`<p>${inline(p.join(\" \"))}</p>`);\n  }\n  return out.join(\"\\n\");\n}\nexport { esc };\n","platform/src/kitsite.ts":"// Read-only kit site: renders a tenant's design system (submitted from Claude, or the generated seed).\nimport { esc, markdown } from \"./md.ts\";\n\ntype Files = Record<string, string>;\ntype Token = { name: string; value: string | Record<string, string>; usage?: string };\n\nexport function renderKitSite(files: Files, opts: { source: \"claude\" | \"seed\"; siteUrl?: string; updatedAt?: string }): string {\n  const get = (p: string) => files[`project/${p}`] ?? files[p];\n  let tokens: any = {};\n  try { tokens = JSON.parse(get(\"tokens.json\") ?? \"{}\"); } catch { tokens = {}; }\n  let index: any = {};\n  try { index = JSON.parse(get(\"design-system.json\") ?? \"{}\"); } catch { index = {}; }\n  const title = index.title || tokens.name || \"Design system\";\n  const themes: { id: string; name: string }[] = tokens.color?.themes ?? [{ id: \"light\", name: \"Light\" }];\n  const colors: Token[] = tokens.color?.tokens ?? [];\n  const val = (t: Token, theme: string) => (typeof t.value === \"string\" ? t.value : t.value[theme] ?? t.value[themes[0].id]);\n  const cssVars = (theme: string) => colors.map((t) => `--${t.name}:${val(t, theme)};`).join(\"\") +\n    [...(tokens.spacing?.tokens ?? []), ...(tokens.radius?.tokens ?? [])].map((t: Token) => `--${t.name}:${t.value};`).join(\"\") +\n    Object.entries(tokens.type?.families ?? {}).map(([k, v]) => `--font-${k}:${v};`).join(\"\");\n  const comps = [...new Set(Object.keys(files).map((p) => p.replace(/^project\\//, \"\").match(/^components\\/([^/]+)\\//)?.[1]).filter(Boolean) as string[])].filter((c) => c !== \"Cover\");\n  const fontsHref = Object.values(tokens.type?.families ?? {}).map((f: any) => String(f).match(/^\"([^\"]+)\"/)?.[1]).filter((f) => f && !/^(ui-|system-ui|Georgia)/.test(f!))\n    .map((f) => `family=${f!.replace(/ /g, \"+\")}:wght@400;600;700`).join(\"&\");\n  const preview = (html: string, h: number) => {\n    const doc = `<!doctype html><html><head><meta charset=\"utf-8\">${fontsHref ? `<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?${fontsHref}&display=swap\">` : \"\"}<style>:root{${cssVars(themes[0].id)}}</style></head><body>${html.replace(/^<!--[^>]*-->\\s*/, \"\")}</body></html>`;\n    return `<iframe class=\"pv\" sandbox=\"allow-same-origin\" loading=\"lazy\" style=\"height:${h}px\" srcdoc=\"${esc(doc)}\"></iframe>`;\n  };\n  const height = (html: string, d: number) => Number(html.match(/height=(\\d+)/)?.[1] ?? d);\n  const cover = get(\"components/Cover/preview.html\");\n  const readme = get(\"README.md\") ?? `# ${title}\\n`;\n  const t0 = themes[0].id, t1 = themes[1]?.id;\n  return `<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>${esc(title)} · Design system</title>${fontsHref ? `<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin><link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?${fontsHref}&display=swap\">` : \"\"}\n<style>\n:root{${cssVars(t0)}color-scheme:light}\n${t1 ? `@media (prefers-color-scheme: dark){:root:not([data-theme=${t0}]){${cssVars(t1)}color-scheme:dark}}:root[data-theme=${t1}]{${cssVars(t1)}color-scheme:dark}` : \"\"}\n*{box-sizing:border-box}body{margin:0;background:var(--paper,#fff);color:var(--ink,#111);font:16px/1.55 var(--font-body,system-ui,sans-serif)}\n.wrap{max-width:1040px;margin:0 auto;padding:clamp(16px,4vw,40px)}\nheader{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px clamp(16px,4vw,40px);border-bottom:1px solid var(--line,#ddd);position:sticky;top:0;background:var(--paper,#fff);z-index:2}\nheader b{font:700 18px/1 var(--font-heading,inherit)}header nav{display:flex;gap:14px;flex-wrap:wrap;font-size:14px}a{color:var(--primary,#06c)}\n.btn{border:1px solid var(--line,#ccc);background:var(--raised,#fff);color:var(--ink,#111);border-radius:999px;padding:6px 12px;cursor:pointer;font:inherit;font-size:13px}\nh1,h2,h3{font-family:var(--font-heading,inherit);line-height:1.15;letter-spacing:-.01em}h2{margin-top:2.2em}\n.card{background:var(--raised,#fff);border:1px solid var(--line,#ddd);border-radius:var(--radius-l,16px);overflow:hidden;margin:16px 0}\n.card .meta{padding:14px 16px;border-top:1px solid var(--line,#ddd)}.pv{display:block;width:100%;border:0;background:var(--paper,#fff)}\n.tw{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:14px}th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line,#ddd);vertical-align:top}\n.sw{display:inline-block;width:18px;height:18px;border-radius:5px;border:1px solid var(--line,#ccc);vertical-align:-4px;margin-right:6px}\ncode{font:13px ui-monospace,Menlo,monospace}pre{overflow-x:auto;background:var(--raised,#f6f6f6);padding:12px;border-radius:8px}\nblockquote{margin:0;padding:12px 16px;border-left:4px solid var(--accent,#999);background:var(--raised,#f6f6f6)}\n.note{font-size:13px;color:var(--ink-muted,#666)}\n</style></head><body>\n<header><b>${esc(title)}</b><nav><a href=\"#brand\">Brand book</a><a href=\"#tokens\">Tokens</a>${comps.length ? `<a href=\"#components\">Components</a>` : \"\"}${opts.siteUrl ? `<a href=\"${esc(opts.siteUrl)}\">Website</a>` : \"\"}<button class=\"btn\" type=\"button\" onclick=\"var r=document.documentElement;r.dataset.theme=(r.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'${t1 ?? t0}':'${t0}'))==='${t0}'?'${t1 ?? t0}':'${t0}'\">Theme</button></nav></header>\n<main class=\"wrap\">\n${cover ? `<div class=\"card\">${preview(cover, height(cover, 320))}</div>` : \"\"}\n<section id=\"brand\">${markdown(readme)}</section>\n<section id=\"tokens\"><h2>Tokens</h2>\n<h3>Color</h3><div class=\"tw\"><table><thead><tr><th>Token</th>${themes.map((t) => `<th>${esc(t.name)}</th>`).join(\"\")}<th>Use</th></tr></thead><tbody>\n${colors.map((t) => `<tr><td><code>${esc(t.name)}</code></td>${themes.map((th) => `<td><span class=\"sw\" style=\"background:${esc(val(t, th.id))}\"></span><code>${esc(val(t, th.id))}</code></td>`).join(\"\")}<td>${esc(t.usage ?? \"\")}</td></tr>`).join(\"\")}\n</tbody></table></div>\n<h3>Type</h3>${(tokens.type?.groups ?? []).map((g: any) => g.styles.map((s: any) => `<p style=\"margin:10px 0;font-family:var(--font-${esc(g.family)});font-size:${esc(s.fontSize)};line-height:${esc(String(s.lineHeight))};font-weight:${esc(String(s.fontWeight))}\">${esc(s.name)} · ${esc(title)}</p>`).join(\"\")).join(\"\")}\n<h3>Spacing and radius</h3><div class=\"tw\"><table><tbody>${[...(tokens.spacing?.tokens ?? []), ...(tokens.radius?.tokens ?? [])].map((t: Token) => `<tr><td><code>${esc(t.name)}</code></td><td><code>${esc(String(t.value))}</code></td><td>${esc(t.usage ?? \"\")}</td></tr>`).join(\"\")}</tbody></table></div>\n</section>\n${comps.length ? `<section id=\"components\"><h2>Components</h2>${comps.map((c) => { const pv = get(`components/${c}/preview.html`); const rd = get(`components/${c}/README.md`); return `<div class=\"card\">${pv ? preview(pv, height(pv, 120)) : \"\"}<div class=\"meta\"><h3 style=\"margin:0 0 6px\">${esc(c)}</h3>${rd ? markdown(rd) : \"\"}</div></div>`; }).join(\"\")}</section>` : \"\"}\n<p class=\"note\">${opts.source === \"claude\" ? \"Built in Claude\" : \"Generated from the bitkit kit; build it out in Claude\"}${opts.updatedAt ? ` · updated ${esc(opts.updatedAt)}` : \"\"}. Served by bitkit.</p>\n</main></body></html>`;\n}\n","platform/src/mcp.ts":"// bitkit MCP server: stateless Streamable HTTP (JSON responses), so any MCP client can use it.\n// Reads need only the kit id (an unguessable 20-character id). Writes also need the kit's edit key.\nimport bitkit from \"./generator.js\";\n\ntype Ctx = { env: Env; origin: string; headerKey: string | null; userId: string | null };\ntype Tool = { name: string; description: string; inputSchema: object; run: (args: any, ctx: Ctx) => Promise<unknown> };\nconst VERSIONS = [\"2026-07-28\", \"2025-11-25\", \"2025-06-18\", \"2025-03-26\"];\nconst KIT = { type: \"string\", pattern: \"^[a-z2-7]{20}$\", description: \"Kit id from the bitkit setup command, e.g. gmzz7vbo5w3pvb3iix7q\" };\nconst KEY = { type: \"string\", description: \"The kit's edit key. Omit it when the connector sends the key in an x-bitkit-key or x-auth-token header.\" };\n\nconst hex = async (s: string) => [...new Uint8Array(await crypto.subtle.digest(\"SHA-256\", new TextEncoder().encode(s)))].map((b) => b.toString(16).padStart(2, \"0\")).join(\"\");\nasync function loadKit(env: Env, id: string) {\n  if (!/^[a-z2-7]{20}$/.test(id)) throw new Error(\"kit_id must be 20 characters a-z and 2-7\");\n  const row = await env.REGISTRY.prepare(\"SELECT id, slug, name, published_at, key_hash, owner_id FROM kits WHERE id = ?\").bind(id).first<{ id: string; slug: string; name: string; published_at: number; key_hash: string | null; owner_id: string | null }>();\n  const obj = row && (await env.KITS.get(`kits/${id}/bitkit.kit.json`));\n  if (!row || !obj) throw new Error(\"No kit with that id\");\n  return { row, kit: bitkit.normalize(await obj.json()) };\n}\nasync function authorize(env: Env, id: string, key: string | undefined, headerKey: string | null = null, userId: string | null = null) {\n  key = key || headerKey || undefined;\n  const { row, kit } = await loadKit(env, id);\n  if (userId && row.owner_id === userId) return { row, kit };\n  if (!row.key_hash || typeof key !== \"string\" || (await hex(key)) !== row.key_hash) throw new Error(userId ? \"This kit belongs to another account, and the edit key does not match\" : \"Sign in to bitkit, or send the kit's edit key\");\n  if (userId && !row.owner_id) await env.REGISTRY.prepare(\"UPDATE kits SET owner_id = ? WHERE id = ? AND owner_id IS NULL\").bind(userId, id).run();\n  return { row, kit };\n}\nconst merge = (a: any, b: any): any => (b && typeof b === \"object\" && !Array.isArray(b) ? Object.fromEntries([...new Set([...Object.keys(a ?? {}), ...Object.keys(b)])].map((k) => [k, k in b ? merge(a?.[k], b[k]) : a[k]])) : b);\nconst safePath = (p: string) => typeof p === \"string\" && p.startsWith(\"project/\") && !p.includes(\"..\") && !p.includes(\"\\\\\") && /^[A-Za-z0-9_./~-]+$/.test(p);\n\nexport const TOOLS: Tool[] = [\n  { name: \"get_kit\", description: \"Read a bitkit kit (bitkit.kit.json): brand, handles, platforms, palette, type, voice, services, and modules.\",\n    inputSchema: { type: \"object\", properties: { kit_id: KIT }, required: [\"kit_id\"] },\n    run: async ({ kit_id }, { env }) => (await loadKit(env, kit_id)).kit },\n  { name: \"get_design_seed\", description: \"Get the starting files for the kit's Claude Design System (project/tokens.json, project/README.md, components, the mark). Create the design system from these files exactly, then refine it with the owner.\",\n    inputSchema: { type: \"object\", properties: { kit_id: KIT }, required: [\"kit_id\"] },\n    run: async ({ kit_id }, { env }) => { const { kit } = await loadKit(env, kit_id); kit.modules = [...new Set([...kit.modules, \"design-system\"])];\n      const files = bitkit.generate(kit).files; return Object.fromEntries(Object.entries(files).filter(([p]) => p.startsWith(\"design-system/project/\")).map(([p, c]) => [p.slice(\"design-system/\".length), c])); } },\n  { name: \"update_kit\", description: \"Change a kit. Pass only the fields to change; arrays replace whole arrays. Returns the updated kit or the problems that blocked it.\",\n    inputSchema: { type: \"object\", properties: { kit_id: KIT, key: KEY, changes: { type: \"object\", description: \"Partial bitkit.kit.json\" } }, required: [\"kit_id\", \"changes\"] },\n    run: async ({ kit_id, key, changes }, { env, headerKey, userId }) => { const { kit } = await authorize(env, kit_id, key, headerKey, userId); const next = bitkit.normalize(merge(kit, changes));\n      const problems = bitkit.problems(next); if (problems.length) return { updated: false, problems };\n      await env.KITS.put(`kits/${kit_id}/bitkit.kit.json`, JSON.stringify(next), { httpMetadata: { contentType: \"application/json\" } });\n      await env.KITS.delete(`kits/${kit_id}/bundle.tar.gz`);\n      await env.REGISTRY.prepare(\"UPDATE kits SET name = ?, updated_at = ? WHERE id = ?\").bind(next.brand.name, Date.now(), kit_id).run();\n      return { updated: true, kit: next }; } },\n  { name: \"submit_design_system\", description: \"Hand the finished Claude Design System back to bitkit. Send every file under project/ (tokens.json, README.md, design-system.json, components/*/README.md and preview.html) as text, and binary assets (images, fonts) as base64. bitkit then serves it at the kit site.\",\n    inputSchema: { type: \"object\", properties: { kit_id: KIT, key: KEY,\n      files: { type: \"object\", additionalProperties: { type: \"string\" }, description: \"Map of project/... path to file text\" },\n      assets: { type: \"object\", additionalProperties: { type: \"string\" }, description: \"Map of project/assets/... path to base64 bytes\" } }, required: [\"kit_id\", \"files\"] },\n    run: async ({ kit_id, key, files, assets = {} }, { env, origin, headerKey, userId }) => { await authorize(env, kit_id, key, headerKey, userId);\n      const all = { ...files, ...assets }; const bad = Object.keys(all).filter((p) => !safePath(p));\n      if (bad.length) return { stored: false, problem: `Paths must start with project/ and use letters, digits, and ./_-~: ${bad.slice(0, 5).join(\", \")}` };\n      if (!files[\"project/tokens.json\"] && !files[\"project/README.md\"]) return { stored: false, problem: \"Include at least project/README.md or project/tokens.json\" };\n      const size = Object.values(all).reduce((n: number, v: any) => n + String(v).length, 0); if (size > 4_000_000) return { stored: false, problem: \"Over 4 MB; send large assets in a second call\" };\n      for (const [p, t] of Object.entries(files)) await env.KITS.put(`kits/${kit_id}/system/${p}`, String(t));\n      for (const [p, b] of Object.entries(assets)) await env.KITS.put(`kits/${kit_id}/system/${p}`, Uint8Array.from(atob(String(b)), (c) => c.charCodeAt(0)));\n      const manifest = { files: Object.keys(files), assets: Object.keys(assets), at: new Date().toISOString() };\n      await env.KITS.put(`kits/${kit_id}/system.json`, JSON.stringify(manifest), { httpMetadata: { contentType: \"application/json\" } });\n      return { stored: true, files: manifest.files.length, assets: manifest.assets.length, kit_site: `${origin}/kits/${kit_id}/` }; } },\n  { name: \"kit_status\", description: \"Where a kit lives: setup command, kit site, website, and deploy status.\",\n    inputSchema: { type: \"object\", properties: { kit_id: KIT }, required: [\"kit_id\"] },\n    run: async ({ kit_id }, { env, origin }) => { const { kit } = await loadKit(env, kit_id);\n      const tenant = await env.REGISTRY.prepare(\"SELECT slug, hostname, status FROM tenants WHERE kit_id = ?\").bind(kit_id).first<{ slug: string; hostname: string; status: string }>();\n      const req = await env.REGISTRY.prepare(\"SELECT status, created_at FROM deploy_requests WHERE kit_id = ? ORDER BY created_at DESC LIMIT 1\").bind(kit_id).first<{ status: string; created_at: number }>();\n      const system = await env.KITS.head(`kits/${kit_id}/system.json`);\n      return { brand: kit.brand.name, setup: `curl -fsSL ${origin}/setup/${kit_id} | sh`, kit_site: `${origin}/kits/${kit_id}/`, design_system: system ? \"submitted\" : \"seed only\",\n        website: tenant ? `https://${tenant.hostname}` : null, tenant_status: tenant?.status ?? \"not deployed\", deploy_request: req ?? null }; } },\n  { name: \"request_deploy\", description: \"Ask bitkit to deploy the kit's website on the owner's behalf (EmDash marketing site on bitkit's Cloudflare platform). Never creates social or registrar accounts.\",\n    inputSchema: { type: \"object\", properties: { kit_id: KIT, key: KEY }, required: [\"kit_id\"] },\n    run: async ({ kit_id, key }, { env, headerKey, userId }) => { await authorize(env, kit_id, key, headerKey, userId);\n      await env.REGISTRY.prepare(\"INSERT INTO deploy_requests (kit_id, status, created_at) VALUES (?, 'requested', ?)\").bind(kit_id, Date.now()).run();\n      return { requested: true, note: \"Queued. kit_status shows progress.\" }; } }\n];\n\nconst INSTRUCTIONS = \"bitkit builds brand identity kits. Start with get_kit, then get_design_seed to create the owner's Claude Design System from those files exactly. When the owner is happy, send the system back with submit_design_system and offer request_deploy. Write tools need the kit's edit key. If the connector sends it in a header, omit the key argument; otherwise ask the owner for it and never repeat it back. Never create, sign in to, or post from social or registrar accounts; the owner does that.\";\n\nconst WRITES = new Set([\"update_kit\", \"submit_design_system\", \"request_deploy\"]);\nexport async function handleMcp(request: Request, env: Env, origin: string, userId: string | null = null): Promise<Response> {\n  if (request.method === \"GET\" || request.method === \"DELETE\") return new Response(null, { status: 405, headers: { allow: \"POST\" } });\n  if (request.method !== \"POST\") return new Response(null, { status: 405 });\n  const headerKey = request.headers.get(\"x-bitkit-key\") ?? request.headers.get(\"x-auth-token\");\n  let msg: any; try { msg = await request.json(); } catch { return Response.json({ jsonrpc: \"2.0\", id: null, error: { code: -32700, message: \"Parse error\" } }, { status: 400 }); }\n  // Sign in when needed: a write with no credentials gets an HTTP 401 so the client starts OAuth.\n  const calls = (Array.isArray(msg) ? msg : [msg]).filter((x: any) => x?.method === \"tools/call\");\n  if (!userId && !headerKey && calls.some((c: any) => WRITES.has(c.params?.name) && !c.params?.arguments?.key)) {\n    return new Response(JSON.stringify({ jsonrpc: \"2.0\", id: calls[0].id ?? null, error: { code: -32001, message: \"Sign in to bitkit to change this kit\" } }), { status: 401, headers: { \"content-type\": \"application/json\", \"www-authenticate\": `Bearer resource_metadata=\"${origin}/.well-known/oauth-protected-resource\"` } });\n  }\n  const one = async (m: any) => {\n    if (m.id === undefined) return null; // notification\n    const ok = (result: unknown) => ({ jsonrpc: \"2.0\", id: m.id, result });\n    if (m.method === \"initialize\") {\n      const v = VERSIONS.includes(m.params?.protocolVersion) ? m.params.protocolVersion : VERSIONS[0];\n      return ok({ protocolVersion: v, capabilities: { tools: { listChanged: false } }, serverInfo: { name: \"bitkit\", title: \"bitkit\", version: \"0.1.0\" }, instructions: INSTRUCTIONS });\n    }\n    if (m.method === \"ping\") return ok({});\n    if (m.method === \"tools/list\") return ok({ tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });\n    if (m.method === \"tools/call\") {\n      const t = TOOLS.find((x) => x.name === m.params?.name);\n      if (!t) return { jsonrpc: \"2.0\", id: m.id, error: { code: -32602, message: `Unknown tool ${m.params?.name}` } };\n      try { const out = await t.run(m.params?.arguments ?? {}, { env, origin, headerKey, userId }); return ok({ content: [{ type: \"text\", text: JSON.stringify(out, null, 2) }], structuredContent: out && typeof out === \"object\" && !Array.isArray(out) ? out : { result: out } }); }\n      catch (e) { return ok({ content: [{ type: \"text\", text: e instanceof Error ? e.message : String(e) }], isError: true }); }\n    }\n    return { jsonrpc: \"2.0\", id: m.id, error: { code: -32601, message: `Method not found: ${m.method}` } };\n  };\n  const res = Array.isArray(msg) ? (await Promise.all(msg.map(one))).filter(Boolean) : await one(msg);\n  if (res === null || (Array.isArray(res) && !res.length)) return new Response(null, { status: 202 });\n  return Response.json(res, { headers: { \"cache-control\": \"no-store\" } });\n}\n","platform/migrations/0003_keys_and_deploys.sql":"-- Edit keys for MCP writes, kit links for tenants, and deploy requests.\nALTER TABLE kits ADD COLUMN key_hash TEXT;\nALTER TABLE kits ADD COLUMN updated_at INTEGER;\nALTER TABLE tenants ADD COLUMN kit_id TEXT;\nCREATE TABLE IF NOT EXISTS deploy_requests (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  kit_id TEXT NOT NULL REFERENCES kits(id),\n  status TEXT NOT NULL CHECK (status IN ('requested', 'building', 'live', 'failed')),\n  created_at INTEGER NOT NULL\n);\n"});
    f["platform/migrations/0004_tenant_setup.sql"] = "-- One-time owner setup links for EmDash sites.\nALTER TABLE tenants ADD COLUMN setup_hash TEXT;\n";
    f["platform/src/agentsetup.ts"] = "// Agent setup prompts, in the style of developers.cloudflare.com/agent-setup:\n// a one-line prompt the user pastes into their agent, which fetches these instructions.\nconst MCP = \"https://app.bitkit.sh/mcp\";\nconst SKILL_ZIP = \"https://app.bitkit.sh/skill.zip\";\n\nexport const ONE_LINE = \"Fetch and follow the instructions to set me up for bitkit from https://app.bitkit.sh/agent-setup/prompt.md\";\nexport const kitOneLine = (id: string) => `Fetch and follow the instructions to build my bitkit brand kit from https://app.bitkit.sh/agent-setup/${id}.md`;\n\nconst connect = `## Connect bitkit\n\nbitkit uses OAuth, like Cloudflare's MCP servers: the first time the agent connects, the user signs in to their bitkit account in the browser (or creates one) and approves access. They stay signed in for 30 days.\n\n### Claude Code\n\nRun this yourself:\n\n\\`\\`\\`sh\nclaude mcp add --transport http --scope user bitkit ${MCP}\nmkdir -p ~/.claude/skills && curl -fsSL ${SKILL_ZIP} -o /tmp/bitkit-skill.zip && unzip -o /tmp/bitkit-skill.zip -d ~/.claude/skills && rm /tmp/bitkit-skill.zip\n\\`\\`\\`\n\nThen tell the user to run \\`/mcp\\`, choose bitkit, and authenticate.\n\n### Claude (web, desktop, or mobile)\n\nYou cannot change these settings yourself. Walk the user through it:\n\n1. Settings → Connectors → Add custom connector. Name: bitkit. URL: \\`${MCP}\\`.\n2. Authentication: Sign in when needed. OAuth client: Use Claude's published identity. No request headers.\n3. Click Connect, then sign in to bitkit (or create an account) and allow access.\n\n### Other MCP clients (Codex, Cursor, VS Code, OpenCode)\n\nAdd a remote (HTTP) MCP server named \\`bitkit\\` at \\`${MCP}\\`. OAuth starts automatically on first use.`;\n\nconst rules = `## Rules\n\n- Never ask for or handle the user's password; they sign in on bitkit's own page.\n- Never create, sign in to, or post from social or registrar accounts, and never register domains or accept terms for the user. The user does those; their kit's ACCOUNTS.md lists each step.`;\n\nexport function setupPrompt(): string {\n  return `These are official instructions from bitkit (https://www.bitkit.sh) to connect your agent to bitkit, which turns a brand into one kit: brand book, design system, website, and launch checklist, hosted on Cloudflare.\n\nComplete these steps yourself where your agent allows it. Where it does not, guide the user step by step.\n\n${connect}\n\n## Then\n\nAsk the user for their kit id: the 20-character id in their setup command (\\`curl -fsSL https://app.bitkit.sh/setup/<kit_id> | sh\\`). With it, fetch https://app.bitkit.sh/agent-setup/<kit_id>.md and follow those instructions.\n\nIf they have no kit yet, send them to https://app.bitkit.sh to make one.\n\n${rules}\n\nOnce done, tell the user: \"bitkit is connected. Give me your kit id and I will build your design system.\"\n`;\n}\n\nexport function kitPrompt(id: string, name: string, site: string | null): string {\n  return `These are official instructions from bitkit (https://www.bitkit.sh) for building the design system for **${name}** (kit \\`${id}\\`). Complete them yourself.\n\n## 1. Make sure bitkit is connected\n\nIf the \\`bitkit\\` tools (\\`get_kit\\`, \\`get_design_seed\\`, \\`submit_design_system\\`) are not available, follow the \"Connect bitkit\" steps in https://app.bitkit.sh/agent-setup/prompt.md first.\n\nIf you have no bitkit tools and cannot add them, read the kit from https://app.bitkit.sh/kits/${id}.tar.gz instead and give the user the finished files to upload at the end.\n\n## 2. Build the design system\n\n1. Call \\`get_kit\\` and \\`get_design_seed\\` with kit_id \\`${id}\\`.\n2. Create a design system titled \"${name}\" from the seed files exactly: \\`project/tokens.json\\` (keep every value), \\`project/README.md\\`, the components, and the cover. Use \\`project/assets/Logos/mark.svg\\` as the logo. In Claude, use the Design System artifact type; elsewhere, write the files into a \\`design-system/\\` folder.\n3. Show it to the user and refine it together. Keep text at 4.5:1 contrast in every theme.\n\n## 3. Hand it back\n\nWhen the user is happy, call \\`submit_design_system\\` with kit_id \\`${id}\\`, every file under \\`project/\\` as text, and binary assets as base64. Report the kit site link it returns (currently https://app.bitkit.sh/kits/${id}/).\n\nThen offer \\`request_deploy\\` to publish the website${site ? ` (now at ${site})` : \"\"}, and use \\`kit_status\\` to report progress.\n\n${rules}\n`;\n}\n\nexport function llmsTxt(): string {\n  return `# bitkit\n\n> bitkit turns a brand into one kit (bitkit.kit.json): brand book, Claude Design System, EmDash website, profile sheets, and a launch checklist, hosted on Cloudflare.\n\n## Agent setup\n\n- [Setup prompt](https://app.bitkit.sh/agent-setup/prompt.md): connect an agent (Claude Code, Claude, other MCP clients) to bitkit\n- [Kit prompt](https://app.bitkit.sh/agent-setup/{kit_id}.md): build and hand back one kit's design system\n\n## Tools\n\n- [MCP server](${MCP}): get_kit, get_design_seed, update_kit, submit_design_system, kit_status, request_deploy\n- [Claude plugin](https://app.bitkit.sh/plugin.zip) and [skill](${SKILL_ZIP})\n- [Kit schema](https://bitkit.sh/schemas/bitkit.kit.v1.json)\n\n## Apps\n\n- [Builder](https://app.bitkit.sh/): customize and publish a kit\n- [Setup command](https://app.bitkit.sh/setup/{kit_id}): \\`curl -fsSL https://app.bitkit.sh/setup/<kit_id> | sh\\`\n`;\n}\n";
    f["platform/src/account.ts"] = "// Accounts on app.bitkit.sh. The identity Worker (bitbuilder-auth) owns sign-up, sign-in, and the\n// 30-day session cookie; this module verifies that cookie locally (HS256, shared SESSION_SECRET),\n// so no request needs a session lookup. Stripe billing uses the account's billing profile.\nimport { verifyToken } from \"./crypto.ts\";\n\nexport type User = { id: string; email: string; name: string };\nconst read = (req: Request, name: string) => req.headers.get(\"cookie\")?.match(new RegExp(`(?:^|;\\\\s*)${name}=([^;]+)`))?.[1];\nconst safeReturn = (p: string | null) => (p && p.startsWith(\"/\") && !p.startsWith(\"//\") ? p : \"/\");\n\nexport async function sessionUser(req: Request, env: Env): Promise<{ user: User | null; setCookies: string[] }> {\n  const s = await verifyToken<{ sub: string; email: string; name: string }>(read(req, \"bk_session\"), env.SESSION_SECRET);\n  return { user: s ? { id: s.sub, email: s.email, name: s.name } : null, setCookies: [] };\n}\n\nexport async function authRoutes(req: Request, url: URL, env: Env): Promise<Response | null> {\n  if (url.pathname === \"/auth/login\") return Response.redirect(`${url.origin}/login?return=${encodeURIComponent(safeReturn(url.searchParams.get(\"return\")))}`, 302);\n  if (url.pathname === \"/auth/me\") {\n    const { user } = await sessionUser(req, env);\n    return Response.json({ user }, { status: user ? 200 : 401, headers: { \"cache-control\": \"no-store\" } });\n  }\n  if (url.pathname === \"/auth/logout\" && req.method === \"POST\")\n    return new Response(null, { status: 204, headers: { \"set-cookie\": \"bk_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0\" } });\n  return null;\n}\n\n// ---------- Stripe (REST, no SDK). Off until STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_PRO are set. ----------\ntype Billing = { STRIPE_SECRET_KEY?: string; STRIPE_WEBHOOK_SECRET?: string; STRIPE_PRICE_PRO?: string };\nconst stripe = async (env: Billing, path: string, form: Record<string, string>) => {\n  const r = await fetch(`https://api.stripe.com/v1/${path}`, { method: \"POST\", headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, \"content-type\": \"application/x-www-form-urlencoded\" }, body: new URLSearchParams(form) });\n  const j = await r.json<any>(); if (!r.ok) throw new Error(j.error?.message ?? `Stripe ${r.status}`); return j;\n};\nconst hmac = async (secret: string, data: string) => { const k = await crypto.subtle.importKey(\"raw\", new TextEncoder().encode(secret), { name: \"HMAC\", hash: \"SHA-256\" }, false, [\"sign\"]);\n  return [...new Uint8Array(await crypto.subtle.sign(\"HMAC\", k, new TextEncoder().encode(data)))].map((b) => b.toString(16).padStart(2, \"0\")).join(\"\"); };\n\nexport async function billingRoutes(req: Request, url: URL, env: Env): Promise<Response | null> {\n  if (!url.pathname.startsWith(\"/billing/\")) return null;\n  const b = env as unknown as Billing;\n  if (!b.STRIPE_SECRET_KEY) return Response.json({ error: \"Billing is not set up yet.\" }, { status: 503 });\n  if (url.pathname === \"/billing/webhook\" && req.method === \"POST\") {\n    const body = await req.text(); const sig = req.headers.get(\"stripe-signature\") ?? \"\";\n    const t = sig.match(/t=(\\d+)/)?.[1]; const v1 = [...sig.matchAll(/v1=([0-9a-f]+)/g)].map((m) => m[1]);\n    if (!t || !b.STRIPE_WEBHOOK_SECRET || Math.abs(Date.now() / 1000 - Number(t)) > 300 || !v1.includes(await hmac(b.STRIPE_WEBHOOK_SECRET, `${t}.${body}`))) return new Response(\"bad signature\", { status: 400 });\n    const evt = JSON.parse(body); const o = evt.data?.object ?? {};\n    if (/^customer\\.subscription\\.(created|updated|deleted)$/.test(evt.type)) {\n      const active = [\"active\", \"trialing\"].includes(o.status) && evt.type !== \"customer.subscription.deleted\";\n      await env.ACCOUNTS.prepare(\"UPDATE accounts SET plan = ?1, plan_status = ?2, plan_renews_at = ?3 WHERE stripe_customer_id = ?4\")\n        .bind(active ? \"pro\" : \"free\", o.status, o.current_period_end ? o.current_period_end * 1000 : null, o.customer).run();\n    }\n    return new Response(\"ok\");\n  }\n  const { user } = await sessionUser(req, env);\n  if (!user) return Response.redirect(`${url.origin}/login?return=${encodeURIComponent(url.pathname)}`, 302);\n  const a = await env.ACCOUNTS.prepare(\"SELECT * FROM accounts WHERE id = ?\").bind(user.id).first<Record<string, string | null>>();\n  if (!a) return Response.redirect(`${url.origin}/login`, 302);\n  let customer = a.stripe_customer_id;\n  if (!customer) {\n    const c = await stripe(b, \"customers\", { email: a.email!, name: a.name ?? \"\", ...(a.phone ? { phone: a.phone } : {}), \"metadata[account_id]\": user.id,\n      \"address[line1]\": a.address_line1 ?? \"\", \"address[line2]\": a.address_line2 ?? \"\", \"address[city]\": a.city ?? \"\", \"address[state]\": a.region ?? \"\", \"address[postal_code]\": a.postal_code ?? \"\", \"address[country]\": a.country ?? \"\" });\n    customer = c.id;\n    await env.ACCOUNTS.prepare(\"UPDATE accounts SET stripe_customer_id = ? WHERE id = ?\").bind(customer, user.id).run();\n  }\n  if (url.pathname === \"/billing/checkout\") {\n    const s = await stripe(b, \"checkout/sessions\", { mode: \"subscription\", customer: customer!, \"line_items[0][price]\": b.STRIPE_PRICE_PRO!, \"line_items[0][quantity]\": \"1\", client_reference_id: user.id,\n      \"automatic_tax[enabled]\": \"true\", \"customer_update[address]\": \"auto\", success_url: `${url.origin}/account?billing=success`, cancel_url: `${url.origin}/account` });\n    return Response.redirect(s.url, 303);\n  }\n  if (url.pathname === \"/billing/portal\") {\n    const s = await stripe(b, \"billing_portal/sessions\", { customer: customer!, return_url: `${url.origin}/account` });\n    return Response.redirect(s.url, 303);\n  }\n  return Response.json({ error: \"Not found\" }, { status: 404 });\n}\n";
    f["platform/src/subjects.ts"] = "// Superseded by HS256 session cookies; kept empty for compatibility.\nexport {};\n";
    f["platform/migrations/0005_kit_owners.sql"] = "-- Kits belong to accounts from the shared identity backend.\nALTER TABLE kits ADD COLUMN owner_id TEXT;\nCREATE INDEX IF NOT EXISTS kits_owner ON kits(owner_id);\n";
    f["platform/src/crypto.ts"] = "// Small Web Crypto helpers: base64url, HS256 tokens, PBKDF2 password hashes.\nconst enc = new TextEncoder();\nexport const b64u = (b: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\\+/g, \"-\").replace(/\\//g, \"_\").replace(/=+$/, \"\");\nconst unb64u = (s: string) => Uint8Array.from(atob(s.replace(/-/g, \"+\").replace(/_/g, \"/\") + \"===\".slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));\nconst hmacKey = (secret: string) => crypto.subtle.importKey(\"raw\", enc.encode(secret), { name: \"HMAC\", hash: \"SHA-256\" }, false, [\"sign\", \"verify\"]);\n\nexport async function signToken(payload: Record<string, unknown>, secret: string, ttlSeconds: number): Promise<string> {\n  const now = Math.floor(Date.now() / 1000);\n  const head = b64u(enc.encode(JSON.stringify({ alg: \"HS256\", typ: \"JWT\" })));\n  const body = b64u(enc.encode(JSON.stringify({ ...payload, iat: now, exp: now + ttlSeconds })));\n  const sig = b64u(await crypto.subtle.sign(\"HMAC\", await hmacKey(secret), enc.encode(`${head}.${body}`)));\n  return `${head}.${body}.${sig}`;\n}\n\nexport async function verifyToken<T extends Record<string, unknown>>(token: string | undefined | null, secret: string): Promise<T | null> {\n  if (!token) return null;\n  const [head, body, sig] = token.split(\".\");\n  if (!head || !body || !sig) return null;\n  try {\n    const ok = await crypto.subtle.verify(\"HMAC\", await hmacKey(secret), unb64u(sig), enc.encode(`${head}.${body}`));\n    if (!ok) return null;\n    const p = JSON.parse(new TextDecoder().decode(unb64u(body))) as T & { exp: number };\n    return p.exp > Math.floor(Date.now() / 1000) ? p : null;\n  } catch { return null; }\n}\n\n// Workers caps PBKDF2 at 100,000 iterations.\nconst ITER = 100_000;\nexport async function hashPassword(password: string): Promise<string> {\n  const salt = crypto.getRandomValues(new Uint8Array(16));\n  const key = await crypto.subtle.importKey(\"raw\", enc.encode(password), \"PBKDF2\", false, [\"deriveBits\"]);\n  const bits = await crypto.subtle.deriveBits({ name: \"PBKDF2\", hash: \"SHA-256\", salt, iterations: ITER }, key, 256);\n  return `pbkdf2-sha256$${ITER}$${b64u(salt)}$${b64u(bits)}`;\n}\nexport async function checkPassword(password: string, stored: string | null): Promise<boolean> {\n  if (!stored) return false;\n  const [scheme, iter, salt, hash] = stored.split(\"$\");\n  if (scheme !== \"pbkdf2-sha256\") return false;\n  const key = await crypto.subtle.importKey(\"raw\", enc.encode(password), \"PBKDF2\", false, [\"deriveBits\"]);\n  const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: \"PBKDF2\", hash: \"SHA-256\", salt: unb64u(salt), iterations: Number(iter) }, key, 256));\n  const want = unb64u(hash);\n  if (bits.length !== want.length) return false;\n  let diff = 0; for (let i = 0; i < bits.length; i++) diff |= bits[i] ^ want[i];\n  return diff === 0;\n}\n";
    f["platform/scripts/bootstrap.sh"] = `#!/bin/sh
# ${head(k, "script")}
# One-time setup of the bitkit platform in YOUR Cloudflare account (npx cf@latest auth login first).
# Workers for Platforms needs a paid plan with the add-on enabled.
set -eu
cd "$(dirname "$0")/.."
npx cf@latest workers-for-platforms dispatch-namespaces create --name ${JSON.stringify(ns)}
npx cf@latest d1 create bitkit-registry
npx cf@latest r2 buckets create bitkit-kits
npx cf@latest d1 migrations apply bitkit-registry
echo "Set secrets CF_ACCOUNT_ID, CF_PLATFORM_TOKEN (scoped: Workers Scripts, KV, D1, R2 edit) and PUBLISH_TOKEN, then: npx cf@latest deploy"
`;
    f["scripts/deploy-tenant.sh"] = `#!/bin/sh
# ${head(k, "script")}
# Deploys this brand's Worker into the bitkit platform's dispatch namespace.
set -eu
cd "$(dirname "$0")/.."
bun scripts/validate-kit.ts
npx cf@latest deploy --dispatch-namespace ${JSON.stringify(ns)}
`;
    f["platform/README.md"] = `# bitkit on Cloudflare for Platforms

${k.brand.name} selected the **${HOSTING.find((h) => h.id === k.hosting.model)?.name}** hosting model.

| Model | Who owns the Cloudflare account | How code gets there |
| --- | --- | --- |
${HOSTING.map((h) => `| ${h.name} | ${h.id === "platform" ? "bitkit (platform account)" : "The brand owner"} | ${h.id === "platform" ? `\`cf deploy --dispatch-namespace ${ns}\` into a Workers for Platforms namespace` : "Owner connects their account (Cloudflare OAuth client), then CI deploys"} |`).join("\n")}

## Pieces

- \`src/index.ts\` routes \`<slug>.${zone}\` (and mapped custom hostnames) to tenant Workers through the \`TENANTS\` dispatch namespace binding.
- \`LOADER\` (Dynamic Workers) runs generated snippets in fresh isolates with \`globalOutbound: null\`.
- \`ProvisionTenant\` is a Workflow: creates KV, D1, and R2 per tenant in the platform account, registers the tenant, waits for the tenant deploy, then activates it.
- \`scripts/bootstrap.sh\` creates the namespace and registry once.

## Boundaries

The platform provisions Cloudflare resources and deploys code. It never registers domains, creates social accounts, or accepts terms for an owner. Domain search (\`scripts/find-domain.sh\`) is read-only; the owner registers the domain they choose.
`;
    return f;
  }

  /* ---------- schema and validator ---------- */
  function schemaJson() {
    const hex = { type: "string", pattern: "^#[0-9a-fA-F]{6}$" };
    const pal = { type: "object", required: ["primary", "secondary", "accent", "ink", "paper"], properties: { primary: hex, secondary: hex, accent: hex, ink: hex, paper: hex } };
    return JSON.stringify({ $schema: "https://json-schema.org/draft/2020-12/schema", $id: "https://app.bitkit.sh/schemas/bitkit.kit.v1.json", title: "bitkit identity kit", type: "object",
      required: ["schema", "brand", "handle", "platforms", "palette", "type", "mark", "voice"],
      properties: {
        schema: { const: "bitkit.kit/v1" }, generatedAt: { type: "string", format: "date-time" },
        brand: { type: "object", required: ["name", "slug"], properties: { name: { type: "string", minLength: 1 }, slug: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" }, tagline: { type: "string", maxLength: 90 }, category: { type: "string" }, keywords: { type: "array", items: { type: "string" }, maxItems: 5 } } },
        handle: { type: "object", required: ["primary"], properties: { primary: { type: "string", minLength: 1 }, overrides: { type: "object", additionalProperties: { type: "string" } } } },
        platforms: { type: "array", items: { type: "object", required: ["id", "handle", "bio", "bioLimit"], properties: { id: { type: "string" }, handle: { type: "string" }, bio: { type: "string" }, bioLimit: { type: "integer" } } } },
        palette: { ...pal, properties: { ...pal.properties, dark: pal } },
        type: { type: "object", required: ["heading", "body"] }, shape: { type: "object", properties: { radius: { type: "number", minimum: 0, maximum: 64 } } },
        mark: { type: "object", required: ["kind", "glyphs"], properties: { kind: { enum: ["seal", "circle", "square"] }, glyphs: { type: "string", maxLength: 3 } } },
        voice: { type: "object", required: ["bio"], properties: { formality: { type: "number", minimum: 0, maximum: 1 }, playfulness: { type: "number", minimum: 0, maximum: 1 }, boldness: { type: "number", minimum: 0, maximum: 1 } } },
        modules: { type: "array", items: { enum: MODULES.map((m) => m.id) } }
      } }, null, 2) + "\n";
  }
  const validator = (k) => `// ${head(k, "script")}
// Dependency-free checks for bitkit.kit.json. Exits non-zero with one line per problem.
import kit from "../bitkit.kit.json" with { type: "json" };

const problems: string[] = [];
const hex = /^#[0-9a-fA-F]{6}$/;
if (kit.schema !== "bitkit.kit/v1") problems.push("schema must be bitkit.kit/v1");
if (!kit.brand?.name) problems.push("brand.name is required");
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(kit.brand?.slug ?? "")) problems.push("brand.slug must be kebab-case");
for (const role of ["primary", "secondary", "accent", "ink", "paper"] as const) {
  if (!hex.test(kit.palette?.[role] ?? "")) problems.push(\`palette.\${role} must be a 6-digit hex color\`);
}
for (const p of kit.platforms ?? []) {
  if (p.bio.length > p.bioLimit) problems.push(\`platforms.\${p.id}.bio is \${p.bio.length} characters, limit \${p.bioLimit}\`);
}
if (problems.length) {
  for (const p of problems) console.error(\`bitkit.kit.json: \${p}\`);
  process.exit(1);
}
console.log(\`bitkit.kit.json OK: \${kit.brand.name}, \${kit.platforms.length} platforms\`);
`;

  /* ---------- GitHub Actions ---------- */
  function workflows(k) {
    const f = {}, A = V.actions;
    const setup = [`      - uses: ${A.checkout}`, `        with:`, `          persist-credentials: false`, `      - uses: ${A.bun}`, `      - uses: ${A.node}`, `        with:`, `          node-version: "${V.node}"`];
    if (has(k, "ci", "ci")) f[".github/workflows/check.yml"] = [`# ${head(k, "file")}`, `name: Check`, `on:`, `  push:`, `    branches: [main]`, `  pull_request:`, `permissions:`, `  contents: read`, `jobs:`, `  check:`, `    runs-on: ubuntu-latest`, `    steps:`, ...setup,
      `      - run: bun scripts/validate-kit.ts`, ...(has(k, "devex", "oxlint") ? [`      - run: bunx oxlint@${V.oxlint} .`] : []), ...(has(k, "devex", "biome") ? [`      - run: bunx @biomejs/biome@${V.biome} ci .`] : []), `      - run: bun test`, ...(k.modules.includes("deploy") ? [`      - run: npm install`, `      - run: npx cf build`] : []), ``].join("\n");
    if (has(k, "ci", "deploy")) f[".github/workflows/deploy.yml"] = [`# ${head(k, "file")}`, `# Needs repository secrets CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID, which you create.`, `name: Deploy`, `on:`, `  push:`, `    branches: [main]`, `  workflow_dispatch:`, `permissions:`, `  contents: read`, `concurrency:`, `  group: deploy-production`, `  cancel-in-progress: false`, `jobs:`, `  deploy:`, `    runs-on: ubuntu-latest`, `    environment: production`, `    steps:`, ...setup,
      `      - run: bun scripts/validate-kit.ts`, `      - run: npm install`, ...(k.hosting.model === "platform" ? [`      - run: npx cf deploy --dispatch-namespace ${k.hosting.namespace}`] : [`      - run: npx cf deploy`]), `        env:`, `          CLOUDFLARE_API_TOKEN: ${GH("secrets.CLOUDFLARE_API_TOKEN")}`, `          CLOUDFLARE_ACCOUNT_ID: ${GH("secrets.CLOUDFLARE_ACCOUNT_ID")}`, ``].join("\n");
    if (has(k, "ci", "preview")) f[".github/workflows/pr-build.yml"] = [`# ${head(k, "file")}`, `name: Pull request build`, `on:`, `  pull_request:`, `permissions:`, `  contents: read`, `jobs:`, `  build:`, `    runs-on: ubuntu-latest`, `    steps:`, ...setup, `      - run: npm install`, `      - run: npx cf build`, `      - run: npx cf deploy --dry-run`, ``].join("\n");
    if (has(k, "ci", "actions-audit")) f[".github/workflows/actions-audit.yml"] = [`# ${head(k, "file")}`, `name: Workflow audit`, `on:`, `  pull_request:`, `    paths: [".github/workflows/**"]`, `permissions:`, `  contents: read`, `jobs:`, `  audit:`, `    runs-on: ubuntu-latest`, `    steps:`,
      `      - uses: ${A.checkout}`, `        with:`, `          persist-credentials: false`, `      - uses: ${A.mise}`, `        with:`, `          install_args: actionlint zizmor`, `          mise_toml: |`, `            [tools]`, `            actionlint = "latest"`, `            zizmor = "latest"`, `      - run: actionlint`, `      - run: zizmor .github/workflows`, ``].join("\n");
    return f;
  }

  /* ---------- MCP ---------- */
  function mcpFiles(k) {
    const servers = Object.fromEntries(MCP.filter((m) => k.mcp.includes(m.id)).map((m) => [m.id, { type: "http", url: m.url }]));
    return { ".mcp.json": JSON.stringify({ mcpServers: servers }, null, 2) + "\n" };
  }

  /* ---------- skills ---------- */
  function skillFiles(k, root = ".claude/skills") {
    const f = {}, s = S(k), sk = (id, desc, body) => { f[`${root}/${id}/SKILL.md`] = `---\nname: ${id}\ndescription: ${yamlStr(desc)}\n---\n\n${body}\n`; };
    if (has(k, "skills", "brand-voice")) sk(`${s}-brand-voice`, `Write any public copy for ${k.brand.name} (bios, posts, captions, site text) in the brand voice from bitkit.kit.json. Use whenever text will appear under the brand's name.`,
      `# ${k.brand.name} voice\n\nRead \`bitkit.kit.json\` first; it wins over this file if they differ.\n\n- Scales (0 formal/serious/reserved, 1 casual/playful/bold): formality ${k.voice.formality}, playfulness ${k.voice.playfulness}, boldness ${k.voice.boldness}.\n- We say: ${k.voice.do.join("; ") || "none listed"}.\n- We avoid: ${k.voice.dont.join("; ") || "none listed"}.\n- Bio limits per platform live in \`platforms[].bioLimit\`; never exceed them.\n\nWhen copy for a platform changes, update \`voice.bios.<platform>\` in the kit and regenerate rather than editing generated files.`);
    if (has(k, "skills", "brand-tokens")) sk(`${s}-brand-tokens`, `Apply ${k.brand.name}'s palette, typefaces, radius, and mark to any UI, document, or image. Use when styling anything for the brand.`,
      `# ${k.brand.name} tokens\n\nUse \`brand/tokens.css\` custom properties (\`--brand-primary\`, \`--brand-ink\`, \`--brand-paper\`, \`--brand-font-heading\`, \`--brand-radius\`) instead of literal values. \`brand/tokens.json\` carries the same values in the Design Tokens format.\n\n- Text on paper uses ink. Text on primary uses ${onColor(k.palette.primary)}.\n- Keep body text at a contrast ratio of 4.5:1 or more; check new pairs before using them.\n- The mark is \`brand/assets/mark.svg\`; do not redraw it.`);
    if (has(k, "skills", "kit-editor")) sk("bitkit-kit-editor", `Edit bitkit.kit.json (the single source of truth for this brand) and regenerate the bundle. Use when asked to change the brand name, handle, platforms, palette, type, voice, tooling, workflows, MCP servers, skills, or agents.`,
      `# Editing the kit\n\n1. Change only \`bitkit.kit.json\`. Every other generated file names it as its source.\n2. Run \`bun scripts/validate-kit.ts\`.\n3. Regenerate: open the bitkit builder, import \`bitkit.kit.json\`, export, and replace the bundle; or ask Claude to update the kit in the bitkit artifact.\n4. Commit the kit and the regenerated files together.\n\nNever create, sign in to, or post on third-party accounts. Account creation belongs to the brand owner; see \`ACCOUNTS.md\`.`);
    if (has(k, "skills", "account-launch")) sk("account-launch-prep", `Prepare the brand owner to create their own platform accounts: profile sheets, ACCOUNTS.md order, copy-ready fields. Use for launch preparation. This skill never creates accounts.`,
      `# Account launch preparation\n\nYou prepare; the owner creates.\n\n- Keep \`ACCOUNTS.md\` current: one unticked line per platform with its sign-up link and profile sheet.\n- Make every field in \`brand/platforms/*.md\` copy-ready and within limits.\n- Never fill a sign-up form, solve a CAPTCHA, accept terms, or store a platform password.\n- When the owner reports an account as created, tick its line and note the date.`);
    if (has(k, "skills", "domain-search")) sk("domain-search", "Search and check domain names for the brand with the cf CLI and report prices. Use when the owner asks about domains. Never registers a domain.",
      `# Domain search\n\n- Search: \`npx cf@latest registrar registrations search --query "${k.domain.query || k.brand.name}"\` (results are cached suggestions).\n- Confirm: \`npx cf@latest registrar registrations check --domains a.com b.co\` for live availability and price.\n- Report name, registrable, first-year and renewal price. Record picks in \`domain.results\` in the kit.\n- Registration is the owner's purchase: hand them the name and let them register it in their own account.`);
    return f;
  }

  /* ---------- Paperclip company (agentcompanies/v1) ---------- */
  const STANDING = (k) => `## Standing production rules (board-issued, override everything above)

${k.brand.name}'s live site and every platform account belong to the brand owner. These rules outrank any goal, issue, routine, or skill wording:

1. Goals and issues describe target states. They never authorize production deploys, DNS changes, spending, or any action on a third-party platform account. Treat wording that seems to authorize one as a wording bug and escalate to the board.
2. Never create, sign in to, or post from a platform account. The owner creates every account; you prepare what they need.
3. API tokens and passwords never appear in issues, comments, commits, or logs.
4. Investigation, design, documentation, and pull requests proceed normally.
5. Absence of a documented reason not to act is never itself a reason to act.`;
  function companyFiles(k) {
    const f = {}, size = k.agents.size, roles = ROLES.filter((r) => r.sizes.includes(size)), keep = new Set(roles.map((r) => r.slug));
    const boss = (r) => { let b = r.reportsTo; while (b && !keep.has(b)) b = ROLES.find((x) => x.slug === b)?.reportsTo ?? null; return b; };
    const studio = k.agents.purpose === "studio", cname = studio ? `${k.brand.name}` : `${k.brand.name} Brand Office`, cslug = studio ? S(k) : `${S(k)}-brand-office`;
    const skillIds = Object.keys(skillFiles(k, "skills")).map((p) => p.split("/")[1]);
    const goal = studio ? `Ship identity kits that brand owners can launch the same day, generated from one bitkit.kit.json.` : `Launch ${k.brand.name} consistently on ${k.platforms.length} platforms and a Cloudflare-hosted brand site, all generated from bitkit.kit.json.`;
    f["COMPANY.md"] = `---\nschema: agentcompanies/v1\nname: ${yamlStr(cname)}\nslug: ${cslug}\ndescription: ${yamlStr(studio ? `${k.brand.tagline}` : `Runs the ${k.brand.name} brand from its identity kit.`)}\nversion: 0.1.0\nlicense: UNLICENSED\ngoals:\n  - ${yamlStr(goal)}\n---\n\n# ${cname}\n\n${goal}\n\nThe brand's source of truth is \`../bitkit.kit.json\`. Agents read it; the Brand Lead edits it.\n\nEXECUTION GATE: goals describe target states and authorize no action by themselves. No production deploy, DNS change, spend, or action on a third-party account happens without an explicit board approval card naming the exact action. Every platform account is created by the brand owner.\n\nGenerated by bitkit from bitkit.kit.json at ${k.generatedAt}. Format: [Agent Companies](https://agentcompanies.io/specification). Runtime: [Paperclip](https://github.com/paperclipai/paperclip).\n`;
    const teams = { creative: "Creative", engineering: "Engineering", delivery: "Delivery and Trust" };
    for (const [t, name] of Object.entries(teams)) {
      const members = roles.filter((r) => r.team === t); if (!members.length) continue;
      const mgr = members.find((r) => !members.some((m) => m.slug === boss(r))) || members[0];
      f[`teams/${t}/TEAM.md`] = `---\nname: ${yamlStr(name)}\nslug: ${t}\nmanager: ../../agents/${mgr.slug}/AGENTS.md\nincludes:\n${members.filter((m) => m !== mgr).map((m) => `  - ../../agents/${m.slug}/AGENTS.md`).join("\n") || "  []"}\n---\n\n# ${name}\n\n${members.map((m) => `- ${m.name}: ${m.job}`).join("\n")}\n`;
    }
    for (const r of roles) {
      const sk = (r.skills || []).map((id) => skillIds.find((x) => x === id || x.endsWith(`-${id}`) || (id === "kit-editor" && x === "bitkit-kit-editor") || (id === "account-launch" && x === "account-launch-prep"))).filter(Boolean);
      f[`agents/${r.slug}/AGENTS.md`] = `---\nname: ${yamlStr(r.name)}\ntitle: ${yamlStr(r.title)}\nreportsTo: ${boss(r) ?? "null"}\n${sk.length ? `skills:\n${sk.map((s) => `  - ${s}`).join("\n")}\n` : ""}---\n\nYou are the ${r.name} at ${cname}.\n\nRole: ${r.job}\n\n## Context you must hold\n\n- Source of truth: \`bitkit.kit.json\` (schema bitkit.kit/v1). Brand: ${k.brand.name}, primary handle @${k.handle.primary}, ${k.platforms.length} platforms: ${k.platforms.map((p) => p.name).join(", ")}.\n- Generated files name their source; change the kit, then regenerate.\n- Hosting: Cloudflare Worker \`${k.deploy.worker}\` configured in \`cloudflare.config.ts\` (use the cf CLI), services: ${k.services.join(", ") || "none"}; model: ${k.hosting.model}${k.hosting.model === "platform" ? " (namespace " + k.hosting.namespace + ")" : ""}.\n- Domains: search with cf; the owner registers.\n- Accounts on every platform are created by the brand owner. \`ACCOUNTS.md\` tracks them.\n\n## What triggers you\n\n${r.triggers}\n\n## What you do\n\n${r.does}\n\n## What you produce\n\n${r.produces}\n\n## Who you hand off to\n\n${r.handoff}\n\n${STANDING(k)}\n`;
    }
    const projects = [
      { slug: "brand-system", name: "Brand system", owner: "brand-lead", desc: "Keep bitkit.kit.json, tokens, mark, and profile sheets correct and consistent.", tasks: [["Audit contrast and handle rules", "Run the kit validator and contrast checks; file findings with the failing pairs."], ["Review platform catalog", "Check each selected platform's handle, bio, and image rules against its current help pages; propose kit changes."]] },
      { slug: "web-presence", name: "Web presence", owner: "platform-engineer", desc: "The Cloudflare-hosted brand site generated from the kit.", tasks: [["Check the brand site", "Run just dev and verify the brand book renders offline-safe and passes contrast."], ["Prepare production deploy", "PRODUCTION GATE: investigation and design only until a board approval card names the exact deploy. Confirm wrangler.jsonc and deploy secrets are ready."]] },
      { slug: "dev-platform", name: "Dev platform", owner: "platform-engineer", desc: "Tooling, workflows, MCP config, and skills in the repository.", tasks: [["Verify pins", `Confirm Action majors (${Object.values(V.actions).join(", ")}) and tool versions are current and at least 14 days old; open a pull request for updates.`]] },
      { slug: "account-launch", name: "Account launch", owner: "delivery-lead", desc: "Everything the owner needs to create accounts personally.", tasks: [["Prepare ACCOUNTS.md", "Make sure every selected platform has a sign-up link and a complete profile sheet. Do not create any account."]] }
    ];
    if (studio) projects.push({ slug: "kit-builder", name: "Kit builder", owner: "cto", desc: "The bitkit wizard (web and A2UI) and its generators.", tasks: [["Keep generators byte-stable", "Add a test that two exports of the same kit differ only in generatedAt."]] });
    const own = (o) => (keep.has(o) ? o : roles.find((r) => r.role === "ceo").slug);
    for (const p of projects) {
      f[`projects/${p.slug}/PROJECT.md`] = `---\nname: ${yamlStr(p.name)}\ndescription: ${yamlStr(p.desc)}\nowner: ${own(p.owner)}\n---\n\n${p.desc}\n`;
      p.tasks.forEach(([t, body]) => { f[`projects/${p.slug}/tasks/${slugify(t)}/TASK.md`] = `---\nname: ${yamlStr(t)}\nproject: ${p.slug}\n---\n\n${body}\n`; });
    }
    const routines = [["weekly-brand-review", "Weekly brand review", "brand-system", "0 9 * * 1", "Compare live profiles the owner reports against the kit and list drift."], ["weekly-pin-review", "Weekly pin review", "dev-platform", "0 10 * * 1", "Check Action majors and tool pins; propose updates older than 14 days."]];
    for (const [slug, name, proj, , body] of routines) f[`tasks/${slug}/TASK.md`] = `---\nname: ${yamlStr(name)}\nproject: ${proj}\nrecurring: true\n---\n\n${body}\n`;
    Object.assign(f, skillFiles(k, "skills"));
    const agentsExt = roles.map((r) => `  ${r.slug}:\n    role: ${r.role}\n    icon: ${r.icon}\n    adapter:\n      type: claude_local\n      config:\n        model: ${r.model}\n    runtime:\n      heartbeat:\n        enabled: false\n        wakeOnDemand: true\n    budgetMonthlyCents: ${k.agents.budgetCents}\n    inputs:\n      env:\n        GH_TOKEN:\n          kind: secret\n          requirement: optional\n        CLAUDE_CODE_OAUTH_TOKEN:\n          kind: secret\n          requirement: optional`).join("\n");
    f[".paperclip.yaml"] = `# Paperclip vendor extension. Routines arrive paused; the board enables them.\nschema: paperclip/v1\ncompany:\n  logoPath: assets/mark.svg\n  requireBoardApprovalForNewAgents: true\nagents:\n${agentsExt}\nprojects:\n${projects.map((p) => `  ${p.slug}:\n    leadAgentSlug: ${own(p.owner)}\n    status: planned`).join("\n")}\nroutines:\n${routines.map(([slug, , , cron]) => `  ${slug}:\n    status: paused\n    triggers:\n      - kind: schedule\n        enabled: false\n        cronExpression: ${yamlStr(cron)}\n        timezone: ${k.agents.timezone}`).join("\n")}\n`;
    f["assets/mark.svg"] = k.mark.svg + "\n";
    f["README.md"] = `# ${cname}\n\n${goal}\n\n## Org chart\n\n| Agent | Title | Reports to | Skills |\n| --- | --- | --- | --- |\n${roles.map((r) => `| ${r.name} | ${r.title} | ${boss(r) ?? "board"} | ${(r.skills || []).join(", ") || "none"} |`).join("\n")}\n\n## Import\n\n${fence("sh", `bunx paperclipai@${V.paperclip} company import ./company --target new --dry-run\nbunx paperclipai@${V.paperclip} company import ./company --target new`)}\n\nAfter import: seed the \`GH_TOKEN\` and \`CLAUDE_CODE_OAUTH_TOKEN\` secrets, approve each agent, then enable routines when you want them. No Cloudflare or platform credentials belong in this company.\n`;
    const out = {}; for (const [p, v] of Object.entries(f)) out[`company/${p}`] = v; return out;
  }

  /* ---------- A2UI ---------- */
  function a2uiFiles(k) {
    const V9 = "v0.9", CAT = "https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json", sid = `bitkit_${S(k).replace(/-/g, "_")}`;
    const C = [], tabs = [], add = (c) => (C.push(c), c.id);
    const txt = (id, text, variant) => add({ id, component: "Text", text, ...(variant ? { variant } : {}) });
    const field = (id, label, path) => add({ id, component: "TextField", label, value: { path } });
    const section = (id, title, kids) => (add({ id: `${id}_col`, component: "Column", children: kids }), tabs.push({ title, child: `${id}_col` }));
    section("brand", "Brand", [field("f_name", "Brand name", "/kit/brand/name"), field("f_tag", "Tagline", "/kit/brand/tagline"), field("f_handle", "Primary handle", "/kit/handle/primary")]);
    section("platforms", "Platforms", [add({ id: "f_plat", component: "ChoicePicker", label: "Platforms", variant: "multipleSelection", displayStyle: "chips", options: PLATFORMS.map((p) => ({ label: p.name, value: p.id })), value: { path: "/kit/platforms" } })]);
    section("look", "Look", ["primary", "secondary", "accent", "ink", "paper"].map((n) => field(`f_${n}`, `${n} color (hex)`, `/kit/palette/${n}`)).concat([field("f_glyphs", "Monogram letters", "/kit/mark/glyphs")]));
    section("voice", "Voice", [add({ id: "f_form", component: "Slider", label: "Formal to casual", min: 0, max: 1, value: { path: "/kit/voice/formality" } }), add({ id: "f_play", component: "Slider", label: "Serious to playful", min: 0, max: 1, value: { path: "/kit/voice/playfulness" } }), field("f_bio", "Bio", "/kit/voice/bio")]);
    section("stack", "Dev kit", [
      add({ id: "f_svc", component: "ChoicePicker", label: "Cloudflare services", variant: "multipleSelection", displayStyle: "chips", options: SERVICES.map((m) => ({ label: m.name, value: m.id })), value: { path: "/kit/services" } }),
      field("f_domain", "Domain (you register it)", "/kit/deploy/domain"),
      add({ id: "f_mods", component: "ChoicePicker", label: "Bundle modules", variant: "multipleSelection", options: MODULES.map((m) => ({ label: m.name, value: m.id })), value: { path: "/kit/modules" } }),
      add({ id: "f_ci", component: "ChoicePicker", label: "GitHub Actions", variant: "multipleSelection", options: WORKFLOWS.map((m) => ({ label: m.name, value: m.id })), value: { path: "/kit/ci" } }),
      add({ id: "f_mcp", component: "ChoicePicker", label: "MCP servers", variant: "multipleSelection", options: MCP.map((m) => ({ label: m.name, value: m.id })), value: { path: "/kit/mcp" } }),
      add({ id: "f_sk", component: "ChoicePicker", label: "Agent skills", variant: "multipleSelection", options: SKILLS.map((m) => ({ label: m.name, value: m.id })), value: { path: "/kit/skills" } })]);
    txt("export_label", "Export bundle"); add({ id: "export_btn", component: "Button", child: "export_label", variant: "primary", action: { event: { name: "bitkit.export", context: { kit: { path: "/kit" } } } } });
    txt("title", `# ${k.brand.name} identity kit`, "h2"); txt("note", "Edits change the kit. Account creation stays with you.", "caption");
    add({ id: "tabs", component: "Tabs", tabs });
    C.unshift({ id: "root", component: "Card", child: "main" }, { id: "main", component: "Column", children: ["title", "note", "tabs", "export_btn"] });
    const draft = JSON.parse(JSON.stringify({ brand: k.brand, handle: { primary: k.handle.primary }, platforms: k.platforms.map((p) => p.id), palette: Object.fromEntries(["primary", "secondary", "accent", "ink", "paper"].map((n) => [n, k.palette[n]])), mark: { glyphs: k.mark.glyphs }, voice: { formality: k.voice.formality, playfulness: k.voice.playfulness, bio: k.voice.bio }, modules: k.modules, ci: k.ci, mcp: k.mcp, skills: k.skills, services: k.services, deploy: { domain: k.deploy.domain } }));
    const jsonl = [
      { version: V9, createSurface: { surfaceId: sid, catalogId: CAT, sendDataModel: true, theme: { primaryColor: k.palette.primary, agentDisplayName: "bitkit" } } },
      { version: V9, updateComponents: { surfaceId: sid, components: C } },
      { version: V9, updateDataModel: { surfaceId: sid, value: { kit: draft } } }
    ].map((m) => JSON.stringify(m)).join("\n") + "\n";
    return { "a2ui/wizard.jsonl": jsonl, "a2ui/README.md": `# A2UI wizard\n\n\`wizard.jsonl\` is the bitkit wizard as an [A2UI](https://a2ui.org) ${V9} surface on the Basic Catalog, so any A2UI renderer (web, mobile, desktop) can show it without running code.\n\n1. The agent streams the three messages: \`createSurface\`, \`updateComponents\`, \`updateDataModel\`.\n2. Inputs bind to \`/kit/...\` in the data model; \`sendDataModel\` is on, so edits travel back with actions.\n3. **Export bundle** sends the \`bitkit.export\` event with the edited kit. The agent merges it into \`bitkit.kit.json\`, regenerates the bundle with the same generators as the web builder, and replies with \`updateDataModel\`.\n\nThe Basic Catalog has no color picker or live preview; the web builder covers those. Account creation is never an action in this surface.\n` };
  }

  /* ---------- Claude Design System seed (the Design System artifact type's project/ files) ---------- */
  function designSystemFiles(k) {
    const p = k.palette, d = p.dark, base = "design-system/project/";
    const surface2 = (x, y, t) => mix(x, y, t);
    const colors = [
      ["paper", p.paper, d.paper, "Page background."],
      ["raised", surface2(p.paper, "#ffffff", 0.6), surface2(d.paper, d.ink, 0.06), "Cards, panels, and menus on paper."],
      ["ink", p.ink, d.ink, "Text and icons on paper and raised."],
      ["ink-muted", mix(p.ink, p.paper, 0.35), mix(d.ink, d.paper, 0.35), "Secondary text on paper; keep it at 4.5:1 or more."],
      ["line", mix(p.ink, p.paper, 0.85), mix(d.ink, d.paper, 0.82), "Borders and dividers."],
      ["primary", p.primary, d.primary, "Primary buttons, links, the mark, focus rings."],
      ["on-primary", onColor(p.primary), onColor(d.primary), "Text and icons on primary."],
      ["secondary", p.secondary, d.secondary, "Supporting fills and illustrations."],
      ["accent", p.accent, d.accent, "Highlights and badges; pair with text, never alone."]
    ];
    const fam = (n) => `"${n}", ${(FONTS.find((f) => f.name === n)?.fb) || "system-ui, sans-serif"}`;
    const s = k.type.scale, px = (n) => `${Math.round(16 * Math.pow(s, n))}px`, lh = (n) => `${Math.round(16 * Math.pow(s, n) * (n > 1 ? 1.15 : 1.5))}px`;
    const r = k.shape.radius;
    const tokens = {
      name: k.brand.name, version: 1,
      meta: { source: "bitkit.kit.json", generatedAt: k.generatedAt },
      color: { themes: [{ id: "light", name: "Light" }, { id: "dark", name: "Dark" }], tokens: colors.map(([name, light, dark, usage]) => ({ name, value: { light, dark }, usage })) },
      type: {
        fonts: [],
        families: { heading: fam(k.type.heading), body: fam(k.type.body), mono: "ui-monospace, \"SF Mono\", Menlo, monospace" },
        groups: [
          { name: "Display", family: "heading", styles: [{ name: "hero", fontSize: px(4), lineHeight: lh(4), fontWeight: 700 }, { name: "title", fontSize: px(2), lineHeight: lh(2), fontWeight: 700 }] },
          { name: "Text", family: "body", styles: [{ name: "lede", fontSize: px(1), lineHeight: lh(1), fontWeight: 400 }, { name: "body", fontSize: "16px", lineHeight: "24px", fontWeight: 400 }, { name: "label", fontSize: "14px", lineHeight: "20px", fontWeight: 600 }, { name: "fine", fontSize: "12px", lineHeight: "16px", fontWeight: 400 }] },
          { name: "Mono", family: "mono", styles: [{ name: "handle", fontSize: "14px", lineHeight: "20px", fontWeight: 500 }] }
        ]
      },
      spacing: { tokens: [["space-2", "8px", "Gaps inside controls."], ["space-4", "16px", "Card padding, gaps between controls."], ["space-6", "24px", "Gaps between cards."], ["space-10", "40px", "Section padding."]].map(([name, value, usage]) => ({ name, value, usage })) },
      radius: { tokens: [["radius-s", `${Math.max(2, Math.round(r / 2))}px`, "Chips and small controls."], ["radius-m", `${r}px`, "Buttons, inputs, cards."], ["radius-l", `${Math.round(r * 1.6)}px`, "Panels and dialogs."]].map(([name, value, usage]) => ({ name, value, usage })) }
    };
    const v = (name, light) => `var(--${name}, ${light})`;
    const C = Object.fromEntries(colors.map(([n, l]) => [n, v(n, l)]));
    const doc = (body, extra = "") => `<style>body{margin:0;font-family:${fam(k.type.body).replace(/"/g, "'")};color:${C.ink};background:${C.paper}}${extra}</style>\n${body}\n`;
    const files = {};
    files[base + "design-system.json"] = JSON.stringify({ v: 3, layout: "files", createdOnFiles: { v: 1, at: k.generatedAt }, title: k.brand.name, namespace: k.brand.slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(""), libraries: [], sections: {}, groups: ["Logos"], assetGroups: { Logos: { name: "Logos", tile: "l", order: [], files: {} } }, blobs: {}, docs: { readme: "project/README.md", sections: [] }, lastChange: { by: "bitkit", at: k.generatedAt, via: "bitkit generator", note: "Seeded from bitkit.kit.json." } }, null, 2) + "\n";
    files[base + "tokens.json"] = JSON.stringify(tokens, null, 2) + "\n";
    files[base + "README.md"] = [`# ${k.brand.name}`, ``, k.brand.tagline, ``, `This design system is generated from \`bitkit.kit.json\` and edited in Claude. The live site is ${k.deploy.domain ? `https://${k.deploy.domain}` : "the brand site"}; this reference lives at ${k.deploy.domain ? `https://kit.${k.deploy.domain}` : "the kit site"}.`, ``,
      `## Content`, ``, `- Voice: ${k.voice.formality < 0.5 ? "more formal" : "more casual"}, ${k.voice.playfulness < 0.5 ? "more serious" : "more playful"}, ${k.voice.boldness < 0.5 ? "more reserved" : "bolder"}.`, ...k.voice.do.map((x) => `- Say: ${x}.`), ...k.voice.dont.map((x) => `- Avoid: ${x}.`), `- Bio: ${k.voice.bio}`, ``,
      `## Color`, ``, `- \`paper\` is the page; \`raised\` holds cards and panels; text is \`ink\`, secondary text \`ink-muted\`.`, `- \`primary\` is the one strong color: primary buttons, links, the mark, focus rings. Text on it is \`on-primary\`.`, `- \`accent\` highlights and always travels with a word.`, `- Light and dark themes define the same tokens. Ink on paper: ${contrast(p.ink, p.paper).toFixed(1)}:1 light, ${contrast(d.ink, d.paper).toFixed(1)}:1 dark.`, ``,
      `## Type`, ``, `- ${k.type.heading} for headings (\`hero\`, \`title\`), ${k.type.body} for text (\`lede\`, \`body\`, \`label\`, \`fine\`), mono for handles and identifiers.`, `- Sentence case everywhere. Handles stay as written: \`@${k.handle.primary}\`.`, ``,
      `## Shape and space`, ``, `- Radii: \`radius-s\` chips, \`radius-m\` buttons and cards, \`radius-l\` panels.`, `- Spacing: \`space-2\` inside controls, \`space-4\` card padding, \`space-6\` between cards, \`space-10\` sections.`, ``,
      `## Iconography and mark`, ``, `- The mark is a ${k.mark.kind} monogram reading “${k.mark.glyphs}” in \`primary\` (\`assets/Logos/mark.svg\`). Never redraw or recolor it.`, ``,
      `## Where the brand lives`, ``, `| Platform | Handle |`, `| --- | --- |`, ...k.platforms.map((x) => `| ${x.name} | @${x.handle} |`), ``].join("\n");
    files[base + "components/Button/README.md"] = `Buttons start an action and name it with a verb in sentence case.\n\n- Primary: \`primary\` fill, \`on-primary\` text, \`radius-m\`. One per view.\n- Secondary: \`raised\` fill, \`line\` border, \`ink\` text.\n- The consumer provides the label and the click handler.\n`;
    files[base + "components/Button/preview.html"] = `<!-- @dsCard group="Actions" height=88 -->\n` + doc(`<div class="row"><button class="b p">Order ahead</button><button class="b s">See the menu</button></div>`, `.row{display:flex;gap:12px;padding:20px;flex-wrap:wrap}.b{font:600 15px/1 inherit;padding:12px 18px;border-radius:${r}px;cursor:pointer}.p{background:${C.primary};color:${C["on-primary"]};border:0}.s{background:${C.raised};color:${C.ink};border:1px solid ${C.line}}`);
    files[base + "components/ProfileCard/README.md"] = `A profile card previews how the brand appears on one platform: mark, name, handle, and the bio at that platform's limit.\n\n- \`raised\` card, \`line\` border, \`radius-l\`.\n- Handle in mono; bio in \`body\`, trimmed at a word break.\n- The consumer provides the platform name, handle, and bio.\n`;
    const pf = k.platforms[0];
    files[base + "components/ProfileCard/preview.html"] = `<!-- @dsCard group="Social" height=160 -->\n` + doc(`<article class="c"><div class="m">${markSvg(k, 56)}</div><div><b>${esc(k.brand.name)}</b><div class="h">${esc(pf ? pf.name : "Profile")} · @${esc(pf ? pf.handle : k.handle.primary)}</div><p>${esc(pf ? pf.bio : k.voice.bio)}</p></div></article>`, `.c{display:grid;grid-template-columns:56px 1fr;gap:14px;margin:16px;padding:16px;background:${C.raised};border:1px solid ${C.line};border-radius:${Math.round(r * 1.6)}px}.h{font:500 13px ui-monospace,Menlo,monospace;color:${C["ink-muted"]}}p{margin:6px 0 0;font-size:14px;line-height:20px}`);
    files[base + "components/Cover/preview.html"] = `<!-- @dsCard group="Cover" height=320 -->\n` + doc(`<section class="cv"><div class="m">${markSvg(k, 96)}</div><h1>${esc(k.brand.name)}</h1><p>${esc(k.brand.tagline)}</p><div class="sw">${["primary", "secondary", "accent", "ink", "paper"].map((n) => `<i style="background:${p[n]}" title="${n}"></i>`).join("")}</div></section>`, `.cv{min-height:320px;box-sizing:border-box;padding:40px;display:grid;align-content:end;gap:10px;background:${C.paper}}h1{margin:0;font:700 ${px(4)}/1.05 ${fam(k.type.heading).replace(/"/g, "'")};letter-spacing:-.02em}p{margin:0;font-size:${px(1)};color:${C["ink-muted"]}}.sw{display:flex;gap:6px;margin-top:8px}.sw i{width:36px;height:36px;border-radius:${Math.max(2, Math.round(r / 2))}px;border:1px solid ${C.line}}`);
    files[base + "assets/Logos/mark.svg"] = k.mark.svg + "\n";
    files[base + "assets/Logos/README.md"] = `The ${k.brand.name} mark. Upload \`mark.svg\` as an asset when creating the design system in Claude; use it as is.\n`;
    files["design-system/CREATE-IN-CLAUDE.md"] = `# Create the ${k.brand.name} design system in Claude\n\nIn Claude, ask:\n\n> Create a Claude Design System titled "${k.brand.name}" from the files in \`design-system/project/\` of my bitkit kit. Upload \`assets/Logos/mark.svg\` as a Logos asset, keep every token value exactly, and write the index last.\n\nThen run \`just publish\` and ask Claude to sync the system to ${k.deploy.domain ? `https://kit.${k.deploy.domain}` : "your kit site"}.\n`;
    return files;
  }

  /* ---------- tar + setup script (used by the platform and tests) ---------- */
  function tar(files, root, mtime = 0) {
    const enc = new TextEncoder(), chunks = [];
    const oct = (n, len) => n.toString(8).padStart(len - 1, "0") + "\0";
    for (const [p, c] of Object.entries(files).sort(([a], [b]) => (a < b ? -1 : 1))) {
      const body = enc.encode(c), h = new Uint8Array(512);
      let nm = `${root}/${p}`, prefix = "";
      if (enc.encode(nm).length > 100) { const i = nm.lastIndexOf("/", 154); prefix = nm.slice(0, i); nm = nm.slice(i + 1); }
      const put = (str, off, len) => h.set(enc.encode(str).subarray(0, len), off);
      put(nm, 0, 100); put(oct(p.endsWith(".sh") ? 0o755 : 0o644, 8), 100, 8); put(oct(0, 8), 108, 8); put(oct(0, 8), 116, 8);
      put(oct(body.length, 12), 124, 12); put(oct(Math.floor(mtime / 1000), 12), 136, 12); h.fill(32, 148, 156); put("0", 156, 1);
      put("ustar\0", 257, 6); put("00", 263, 2); put("bitkit", 265, 32); put("bitkit", 297, 32); put(prefix, 345, 155);
      let sum = 0; for (const b of h) sum += b;
      put(sum.toString(8).padStart(6, "0") + "\0 ", 148, 8);
      chunks.push(h, body);
      const pad = (512 - (body.length % 512)) % 512; if (pad) chunks.push(new Uint8Array(pad));
    }
    chunks.push(new Uint8Array(1024));
    const out = new Uint8Array(chunks.reduce((a, c) => a + c.length, 0)); let o = 0;
    for (const c of chunks) { out.set(c, o); o += c.length; }
    return out;
  }
  function setupScript({ id, slug, name, sha, origin = "https://app.bitkit.sh" }) {
    const q = (s) => "'" + String(s).replace(/'/g, "'\\''") + "'";
    return `#!/bin/sh
# bitkit setup: ${name.replace(/\n/g, " ")} (kit ${id})
#
#   curl -fsSL ${origin}/setup/${id} | sh
#   curl -fsSL ${origin}/setup/${id} | sh -s -- my-folder
#
# Read it first if you like:
#   curl -fsSL ${origin}/setup/${id} -o bitkit-setup.sh && less bitkit-setup.sh && sh bitkit-setup.sh
#
# What it does: downloads the kit bundle, checks its SHA-256, unpacks it into a new
# folder, runs git init, and installs pinned tools if mise is present.
# What it never does: use sudo, create accounts, register domains, or deploy anything.
set -eu

main() {
  ORIGIN="\${BITKIT_ORIGIN:-${origin}}"
  KIT=${q(id)}
  SHA=${q(sha)}
  DIR="\${1:-${slug}}"

  need() { command -v "$1" >/dev/null 2>&1 || { echo "bitkit: this setup needs $1" >&2; exit 1; }; }
  need curl
  need tar
  if command -v sha256sum >/dev/null 2>&1; then sum() { sha256sum "$1" | cut -d ' ' -f 1; }
  elif command -v shasum >/dev/null 2>&1; then sum() { shasum -a 256 "$1" | cut -d ' ' -f 1; }
  else echo "bitkit: this setup needs sha256sum or shasum" >&2; exit 1; fi

  if [ -e "$DIR" ]; then
    echo "bitkit: $DIR already exists. Pick another folder: curl -fsSL $ORIGIN/setup/$KIT | sh -s -- other-folder" >&2
    exit 1
  fi

  WORK=".bitkit-$KIT.partial"
  rm -rf "$WORK"
  mkdir "$WORK"
  trap 'rm -rf "$WORK"' EXIT INT TERM

  echo "bitkit: downloading ${name.replace(/"/g, "")}"
  curl -fsSL "$ORIGIN/kits/$KIT.tar.gz" -o "$WORK/kit.tar.gz"
  GOT="$(sum "$WORK/kit.tar.gz")"
  if [ "$GOT" != "$SHA" ]; then
    echo "bitkit: checksum mismatch (expected $SHA, got $GOT). Nothing was unpacked." >&2
    exit 1
  fi

  mkdir "$DIR"
  tar -xzf "$WORK/kit.tar.gz" -C "$DIR" --strip-components=1
  cd "$DIR"

  if command -v git >/dev/null 2>&1 && [ ! -d .git ]; then git init -q && git add -A; fi
  if command -v mise >/dev/null 2>&1; then
    mise trust -q . >/dev/null 2>&1 || true
    mise install || echo "bitkit: mise install did not finish; rerun it in $DIR" >&2
  else
    echo "bitkit: mise not found. Install it from https://mise.jdx.dev, then run: mise install"
  fi
  if command -v just >/dev/null 2>&1 && command -v bun >/dev/null 2>&1; then just setup || true; fi

  cat <<NEXT

bitkit: ready in $DIR
  cd $DIR
  just check      validate the kit and run tests
  just dev        local site with cf
  just domains    search domains (read-only)
  open ACCOUNTS.md and create each account yourself
NEXT
}

main "$@"
`;
  }
  function publishFiles(k) {
    return { "scripts/publish-kit.sh": `#!/bin/sh
# ${head(k, "script")}
# Publishes bitkit.kit.json to bitkit.sh and prints the one-line setup command.
# Needs BITKIT_TOKEN (issued by the bitkit operator). Sends only the kit JSON.
set -eu
cd "$(dirname "$0")/.."
: "\${BITKIT_TOKEN:?set BITKIT_TOKEN first}"
curl -fsS -X POST "\${BITKIT_ORIGIN:-https://app.bitkit.sh}/api/kits" \\
  -H "authorization: Bearer $BITKIT_TOKEN" -H "content-type: application/json" \\
  --data-binary @bitkit.kit.json
echo
` };
  }

  /* ---------- README / CLAUDE.md ---------- */
  function readme(k, files) {
    const mods = MODULES.filter((m) => k.modules.includes(m.id));
    return `# ${k.brand.name} identity kit\n\n${k.brand.tagline}\n\nEverything here is generated from \`bitkit.kit.json\` (schema bitkit.kit/v1, ${k.generatedAt}). Change the kit, then regenerate.\n\n## What’s inside\n\n| Module | Files |\n| --- | --- |\n${mods.map((m) => `| ${m.name} | ${m.why} |`).join("\n")}\n\n## Start\n\n${fence("sh", `${has(k, "devex", "mise") ? "mise install\n" : ""}${has(k, "devex", "just") ? "just setup\njust check\njust dev        # local brand site" : "bun scripts/validate-kit.ts"}`)}\n\nThen work through \`ACCOUNTS.md\`. You create every platform account yourself; the kit prepares the fields.\n\n## Files\n\n${fence("text", Object.keys(files).sort().join("\n"))}\n`;
  }
  function claudeMd(k) {
    return `# ${k.brand.name}: instructions for Claude and other agents\n\n- \`bitkit.kit.json\` is the single source of truth. Edit it, validate with \`bun scripts/validate-kit.ts\`, then regenerate. Never hand-edit files whose header says they are generated.\n- Brand voice and tokens: see the skills in \`.claude/skills/\`.\n- Cloudflare: use the \`cf\` CLI (\`npx cf@latest\`); this project has \`cloudflare.config.ts\` and no Wrangler config.\n- Commands: ${has(k, "devex", "just") ? "`just check`, `just dev`, `just build`, `just domains`, `just deploy`" : "`bun scripts/validate-kit.ts`, `npx cf@latest deploy`"}.\n- Tests: \`bun test\`${has(k, "devex", "vitest") ? "; Vitest with `just test-workers`" : ""}.\n- Never create, sign in to, or post from any platform account, never register a domain, and never accept terms of service on the owner's behalf. Prepare \`ACCOUNTS.md\` and the profile sheets; the owner does the sign-ups.\n- API tokens are credentials. Keep them out of commits, issues, and logs.\n- Scratch files go in \`.tmp/\`.\n`;
  }

  /* ---------- everything ---------- */
  function generate(d, now = new Date(), opts = {}) {
    const k = buildKit(d, now), f = {}, m = (id) => k.modules.includes(id);
    f["bitkit.kit.json"] = JSON.stringify(k, null, 2) + "\n";
    f["schema/bitkit.kit.v1.json"] = schemaJson();
    f["scripts/validate-kit.ts"] = validator(k);
    f["brand/index.html"] = brandBook(k); f["brand/BRAND.md"] = brandMd(k); f["brand/tokens.css"] = tokensCss(k); f["brand/tokens.json"] = tokensJson(k); f["brand/assets/mark.svg"] = k.mark.svg + "\n";
    for (const p of k.platforms) f[`brand/platforms/${p.id}.md`] = platformMd(k, p);
    if (m("accounts")) f["ACCOUNTS.md"] = accountsMd(k);
    if (m("devex")) Object.assign(f, devexFiles(k));
    if (m("deploy")) Object.assign(f, deployFiles(k));
    if (m("platform")) { Object.assign(f, platformFiles(k));
      f["platform/src/generator.js"] = opts.source ? `// bitkit generator, copied from the builder at ${k.generatedAt}. Regenerate rather than edit.\n${opts.source.replace(/if \(typeof module !== "undefined"\) module\.exports = BITKIT;\s*$/, "")}\nexport default BITKIT;\n` : "// Export from the bitkit builder to embed the generator here.\nexport default null;\n";
      f["platform/src/generator.d.ts"] = "declare const BITKIT: {\n  normalize(d: unknown): any;\n  problems(d: any): string[];\n  generate(d: any, now?: Date, opts?: { source?: string }): { kit: any; files: Record<string, string> };\n  tar(files: Record<string, string>, root: string, mtime?: number): Uint8Array<ArrayBuffer>;\n  setupScript(o: { id: string; slug: string; name: string; sha: string; origin?: string }): string;\n};\nexport default BITKIT;\n"; }
    if (m("deploy")) Object.assign(f, publishFiles(k));
    if (m("ci")) Object.assign(f, workflows(k));
    if (m("mcp")) Object.assign(f, mcpFiles(k));
    if (m("skills")) Object.assign(f, skillFiles(k));
    if (m("agents")) Object.assign(f, companyFiles(k));
    if (m("a2ui")) Object.assign(f, a2uiFiles(k));
    if (m("design-system")) Object.assign(f, designSystemFiles(k));
    f["CLAUDE.md"] = claudeMd(k); f["AGENTS.md"] = claudeMd(k);
    f["README.md"] = readme(k, { ...f, "README.md": "" });
    return { kit: k, files: f };
  }

  return { V, REVIEWED, PLATFORMS, GROUPS, FONTS, PRESETS, CATEGORIES, SERVICES, HOSTING, MCP, WORKFLOWS, SKILLS, DEVEX, MODULES, ROLES,
    tar, setupScript, designSystemFiles, esc, slugify, font, validHex, contrast, mix, onColor, trimBio, checkHandle, blank, normalize, selected, handleFor, bioFor, darkPalette, candidates, problems, markSvg, buildKit, generate };
})();
if (typeof module !== "undefined") module.exports = BITKIT;
