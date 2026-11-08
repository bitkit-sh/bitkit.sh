// bitkit generator, copied from the builder at 2026-11-08T20:00:00Z. Regenerate rather than edit.
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
    { id: "handoff", name: "Hand off", why: "Preview on a temporary account; the owner claims it and owns everything" },
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
    { id: "cf-preview-claim", name: "Preview and claim", why: "Temporary Cloudflare previews with safe claim links" },
    { id: "domain-search", name: "Domain search", why: "Finds and checks domains with cf; the owner registers" }
  ];
  const DEVEX = [
    { id: "mise", name: "mise", why: "Pins bun, node, just, lefthook" },
    { id: "just", name: "just", why: "One task runner: check, dev, preview, deploy" },
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
    { id: "deploy", name: "Cloudflare project", why: "cloudflare.config.ts, Worker, Vite, domain and preview scripts" },
    { id: "platform", name: "Cloudflare for Platforms", why: "platform/: dispatcher, Dynamic Workers, tenant provisioning" },
    { id: "ci", name: "GitHub Actions", why: "Workflows you picked" },
    { id: "mcp", name: "MCP config", why: ".mcp.json for Claude Code and other clients" },
    { id: "skills", name: "Agent skills", why: ".claude/skills generated from the kit" },
    { id: "agents", name: "Paperclip company", why: "company/ in agentcompanies/v1 format" },
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
    { slug: "cto", name: "CTO", title: "Chief Technology Officer", role: "cto", icon: "cpu", reportsTo: "director", team: "engineering", sizes: ["full"], model: "opus", skills: ["kit-editor", "cf-preview-claim"],
      job: "Owns the repository, the generator, CI, and the Cloudflare deployment path.", triggers: "Failing checks, dependency or Action updates, deploy requests.", does: "Reviews engineering changes, keeps pins current, approves workflow changes.", produces: "Reviewed pull requests, upgrade plans.", handoff: "Platform Engineer for implementation, QA for verification." },
    { slug: "platform-engineer", name: "Platform Engineer", title: "Platform Engineer", role: "engineer", icon: "code", reportsTo: "cto", team: "engineering", sizes: ["lean", "full"], model: "sonnet", skills: ["kit-editor", "brand-tokens", "cf-preview-claim"],
      job: "Builds the brand site, scripts, and workflows generated from the kit.", triggers: "Issues in the web-presence and dev-platform projects.", does: "Implements changes with bun test and Vitest, runs just check, opens pull requests.", produces: "Pull requests with passing checks.", handoff: "QA Engineer, then CTO." },
    { slug: "edge-devops", name: "Edge DevOps", title: "Edge Deploy Engineer", role: "devops", icon: "globe", reportsTo: "cto", team: "engineering", sizes: ["full"], model: "sonnet", skills: ["cf-preview-claim"],
      job: "Runs temporary previews and owns wrangler.jsonc, deploy scripts, and the deploy workflow.", triggers: "Preview requests, deploy workflow failures.", does: "Deploys previews with wrangler deploy --temporary from an isolated config directory, verifies them, hands the claim link only to the brand owner.", produces: "Preview URLs and a deploy log without credentials.", handoff: "Delivery Lead for the claim handoff." },
    { slug: "qa", name: "QA Engineer", title: "QA Engineer", role: "qa", icon: "bug", reportsTo: "cto", team: "engineering", sizes: ["full"], model: "sonnet",
      job: "Verifies every generated surface: brand book offline render, contrast, handle rules, bio limits.", triggers: "Pull requests, kit changes.", does: "Runs the kit validator and visual checks, files evidence-backed findings.", produces: "Pass or fail verdicts with evidence.", handoff: "Author of the change." },
    { slug: "delivery-lead", name: "Delivery Lead", title: "Launch and Delivery Lead", role: "pm", icon: "rocket", reportsTo: "director", team: "delivery", sizes: ["lean", "full"], model: "sonnet", skills: ["account-launch"],
      job: "Prepares the launch: ACCOUNTS.md, profile sheets, and the order in which the owner creates accounts.", triggers: "Kit ready for launch, new platform selected.", does: "Builds the checklist, confirms every field is ready to paste, tracks which accounts the owner reports as created.", produces: "An up-to-date ACCOUNTS.md and a launch status note.", handoff: "The board, who creates every account personally." },
    { slug: "security", name: "Security Lead", title: "Security and Trust", role: "security", icon: "shield", reportsTo: "director", team: "delivery", sizes: ["full"], model: "sonnet", skills: ["cf-preview-claim"],
      job: "Guards credentials and supply chain: claim links, tokens, Action pins, dependency scores.", triggers: "New dependencies, workflow edits, preview handoffs.", does: "Reviews pins and permissions, checks that claim links and tokens never reach issues or logs.", produces: "Findings with severity and a fix.", handoff: "CTO for remediation." }
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
      deploy: { worker: "coopers-coffee", domain: "", preview: "temporary" },
      domain: { query: "coopers coffee", results: [], checkedAt: "", account: "" },
      services: ["kv", "d1", "r2", "ai", "analytics"],
      hosting: { model: "platform", namespace: "bitkit-tenants", platformZone: "bitkit.sh" },
      devex: ["mise", "just", "lefthook", "oxlint", "biome", "editorconfig", "devcontainer", "vitest"],
      ci: ["ci", "deploy", "preview", "actions-audit"],
      mcp: ["cloudflare-docs", "cloudflare-bindings", "cloudflare-observability", "github", "context7"],
      skills: ["brand-voice", "brand-tokens", "kit-editor", "account-launch", "cf-preview-claim", "domain-search"],
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
      ...(k.modules.includes("deploy") ? [`## Cloudflare`, ``, `- [ ] Create or sign in to your Cloudflare account at https://dash.cloudflare.com/sign-up`, `- [ ] Optional: run \`just preview\` for a temporary preview, then claim it yourself within 60 minutes`, `- [ ] For CI deploys, create an API token scoped to Workers and add \`CLOUDFLARE_API_TOKEN\` and \`CLOUDFLARE_ACCOUNT_ID\` as repository secrets`, ``] : []),
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
    f[".gitignore"] = `node_modules/\n.wrangler/\n.tmp/\n.dev.vars\n.env*\n!.env.example\n`;
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
      `# Temporary Cloudflare preview with a claim link (no login needed)`, `preview:`, `    sh scripts/preview-temporary.sh`, ``,
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
    f["cloudflare.config.ts"] = cfConfig(k);
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
    f["scripts/preview-temporary.sh"] = `#!/bin/sh
# ${head(k, "script")}
# Previews brand/ on a Cloudflare temporary account. cf has no temporary mode yet,
# so this one step uses Wrangler with flags (it never reads cloudflare.config.ts).
# Wrangler only allows --temporary without credentials, so env vars are cleared
# and the config directory is isolated. The claim URL works like a password:
# open it yourself within 60 minutes; never paste it into issues or logs.
set -eu
cd "$(dirname "$0")/.."
bun scripts/validate-kit.ts
mkdir -p .tmp/wrangler-temporary
env -u CLOUDFLARE_API_TOKEN -u CLOUDFLARE_API_KEY -u CLOUDFLARE_ACCOUNT_ID \\
  XDG_CONFIG_HOME="$PWD/.tmp/wrangler-temporary" \\
  npx wrangler@${V.wrangler} deploy --temporary --name "${k.deploy.worker}-preview" --assets ./brand --compatibility-date ${V.compat}
`;
    f["scripts/provision-preview.ts"] = PROVISION(k);
    return f;
  }
  const PROVISION = (k) => `// ${head(k, "script")}
// Platform path for temporary previews, following
// https://developers.cloudflare.com/workers/platform/claim-deployments/
// Run only after the brand owner accepts Cloudflare's Terms of Service and Privacy Policy:
//   BITKIT_OWNER_ACCEPTED_CF_TERMS=yes bun scripts/provision-preview.ts
// Writes credentials to .tmp/preview.json (mode 600). Never log the token or claim URL.
import { createHash } from "node:crypto";
import { chmod, mkdir, writeFile } from "node:fs/promises";

const API = "https://api.cloudflare.com/client/v4/provisioning/previews";
if (process.env.BITKIT_OWNER_ACCEPTED_CF_TERMS !== "yes") {
  console.error("The brand owner must accept https://www.cloudflare.com/terms/ and https://www.cloudflare.com/privacypolicy/ first.");
  process.exit(2);
}
const sha = (b: Uint8Array) => createHash("sha256").update(b).digest();
function solve(seed: string, k: number, g: number): string {
  const s = Buffer.from(seed, "base64url");
  if (s.length !== 32 || !Number.isInteger(k) || k <= 0 || !Number.isInteger(g) || g <= 0 || k * g > 64_000_000) throw new Error("challenge out of bounds");
  let h = sha(s);
  const cps = [h];
  for (let i = 0; i < k; i++) { for (let j = 0; j < g; j++) h = sha(h); cps.push(h); }
  return Buffer.concat(cps).toString("base64");
}
const ch = await (await fetch(\`\${API}/challenge\`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" })).json();
if (!ch.success) throw new Error("challenge request failed");
const { challengeToken, seed, k, g } = ch.result;
const created = await (await fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
  termsOfService: "https://www.cloudflare.com/terms/", privacyPolicy: "https://www.cloudflare.com/privacypolicy/", acceptTermsOfService: "yes",
  challengeToken, solution: { checkpoints: solve(seed, k, g) } }) })).json();
const r = created.result;
if (!created.success || !r?.account?.id || !r?.account?.apiToken || !r?.claim?.url || !r?.claim?.expiresAt) throw new Error("temporary account was not created");
await mkdir(".tmp", { recursive: true });
await writeFile(".tmp/preview.json", JSON.stringify(r, null, 2));
await chmod(".tmp/preview.json", 0o600);
console.log(\`Temporary account \${r.account.id} ready until \${r.claim.expiresAt}. Credentials and claim URL saved to .tmp/preview.json.\`);
`;

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

export default defineConfig({
  worker: {
    name: "bitkit-platform",
    compatibilityDate: "${V.compat}",
    entrypoint,
    domains: ["app.${zone}"],
    triggers: [triggers.fetch({ pattern: "*.${zone}/*", zone: "${zone}" })],
    env: {
      TENANTS: bindings.dispatchNamespace({ namespace: ${JSON.stringify(ns)} }),
      LOADER: bindings.workerLoader(),
      REGISTRY: bindings.d1({ name: "bitkit-registry" }),
      KITS: bindings.r2({ name: "bitkit-kits" }),
      PUBLISH_TOKEN: bindings.secret(),
      PROVISION: bindings.workflow({ name: "provision-tenant", worker: "bitkit-platform", exportName: "ProvisionTenant" }),
      PLATFORM_ZONE: bindings.text(${JSON.stringify(zone)}),
      CF_ACCOUNT_ID: bindings.secret(),
      CF_PLATFORM_TOKEN: bindings.secret(),
    },
    exports: { ProvisionTenant: exports.workflow({ name: "provision-tenant" }) },
  },
});
`;
    f["platform/src/index.ts"] = "// __HEAD__\nimport { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from \"cloudflare:workers\";\nimport bitkit from \"./generator.js\";\n\ntype Tenant = { slug: string; script: string; hostname: string; owner: string; status: string };\ntype KitRecord = { id: string; slug: string; name: string; published_at: number };\nconst APEX = \"__ZONE__\";\n// The kit API and setup scripts live on app.<zone>; every other <slug>.<zone> is a tenant.\nconst APP = `app.${APEX}`;\nexport const RESERVED_SLUGS = new Set([\"app\", \"www\", \"api\", \"admin\", \"mail\"]);\n\nconst b32 = (bytes: Uint8Array) => {\n  const a = \"abcdefghijklmnopqrstuvwxyz234567\";\n  let bits = 0, value = 0, out = \"\";\n  for (const byte of bytes) { value = (value << 8) | byte; bits += 8; while (bits >= 5) { out += a[(value >>> (bits - 5)) & 31]; bits -= 5; } }\n  return bits > 0 ? out + a[(value << (5 - bits)) & 31] : out;\n};\nconst hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, \"0\")).join(\"\");\n// Compares fixed-length digests so timing does not reveal how much of the token matched.\nconst safeEqual = async (a: string, b: string) => {\n  const [x, y] = await Promise.all([a, b].map((v) => crypto.subtle.digest(\"SHA-256\", new TextEncoder().encode(v))));\n  const u = new Uint8Array(x), w = new Uint8Array(y);\n  let diff = 0;\n  for (let i = 0; i < u.length; i++) diff |= u[i] ^ w[i];\n  return diff === 0;\n};\n\n// Builds the bundle once per kit and caches it in R2, so the checksum in the setup script always matches the bytes served.\nasync function bundle(env: Env, id: string): Promise<{ bytes: ArrayBuffer; sha: string; kit: KitRecord } | null> {\n  if (!/^[a-z2-7]{20}$/.test(id)) return null;\n  const kit = await env.REGISTRY.prepare(\"SELECT id, slug, name, published_at FROM kits WHERE id = ?\").bind(id).first<KitRecord>();\n  if (!kit) return null;\n  const cached = await env.KITS.get(`kits/${id}/bundle.tar.gz`);\n  if (cached) return { bytes: await cached.arrayBuffer(), sha: cached.customMetadata?.sha256 ?? \"\", kit };\n  const source = await env.KITS.get(`kits/${id}/bitkit.kit.json`);\n  if (!source) return null;\n  const draft = bitkit.normalize(await source.json());\n  const { files } = bitkit.generate(draft, new Date(kit.published_at));\n  const tarBytes = bitkit.tar(files, kit.slug, kit.published_at);\n  const bytes = await new Response(new Blob([tarBytes]).stream().pipeThrough(new CompressionStream(\"gzip\"))).arrayBuffer();\n  const sha = hex(await crypto.subtle.digest(\"SHA-256\", bytes));\n  await env.KITS.put(`kits/${id}/bundle.tar.gz`, bytes, { httpMetadata: { contentType: \"application/gzip\" }, customMetadata: { sha256: sha } });\n  return { bytes, sha, kit };\n}\n\nasync function apex(request: Request, env: Env, url: URL): Promise<Response> {\n  if (url.pathname === \"/api/kits\" && request.method === \"POST\") {\n    const auth = request.headers.get(\"authorization\") ?? \"\";\n    if (!(await safeEqual(auth, `Bearer ${env.PUBLISH_TOKEN}`))) return Response.json({ error: \"unauthorized\" }, { status: 401 });\n    const draft = bitkit.normalize(await request.json());\n    const problems = bitkit.problems(draft);\n    if (problems.length) return Response.json({ error: \"invalid kit\", problems }, { status: 422 });\n    const id = b32(crypto.getRandomValues(new Uint8Array(12))).slice(0, 20);\n    const publishedAt = Date.now();\n    await env.KITS.put(`kits/${id}/bitkit.kit.json`, JSON.stringify(draft), { httpMetadata: { contentType: \"application/json\" } });\n    await env.REGISTRY.prepare(\"INSERT INTO kits (id, slug, name, published_at) VALUES (?, ?, ?, ?)\").bind(id, draft.brand.slug, draft.brand.name, publishedAt).run();\n    return Response.json({ id, setup: `curl -fsSL ${url.origin}/setup/${id} | sh`, tarball: `${url.origin}/kits/${id}.tar.gz`, publishedAt }, { status: 201 });\n  }\n  let m = url.pathname.match(/^\\/kits\\/([a-z2-7]+)\\.tar\\.gz$/);\n  if (m && request.method === \"GET\") {\n    const b = await bundle(env, m[1]);\n    if (!b) return new Response(\"Unknown kit\", { status: 404 });\n    return new Response(b.bytes, { headers: { \"content-type\": \"application/gzip\", \"x-bitkit-sha256\": b.sha, \"cache-control\": \"public, max-age=31536000, immutable\" } });\n  }\n  m = url.pathname.match(/^\\/setup\\/([a-z2-7]+)$/);\n  if (m && request.method === \"GET\") {\n    const b = await bundle(env, m[1]);\n    if (!b) return new Response(\"echo 'bitkit: unknown kit id' >&2; exit 1\\n\", { status: 404, headers: { \"content-type\": \"text/plain; charset=utf-8\" } });\n    const script = bitkit.setupScript({ id: b.kit.id, slug: b.kit.slug, name: b.kit.name, sha: b.sha, origin: url.origin });\n    return new Response(script, { headers: { \"content-type\": \"text/plain; charset=utf-8\", \"cache-control\": \"no-store\" } });\n  }\n  if (url.pathname === \"/\") return new Response(`bitkit: brand identity kits\\n\\nRun a kit's setup with:\\n  curl -fsSL ${url.origin}/setup/<kit-id> | sh\\n`, { headers: { \"content-type\": \"text/plain; charset=utf-8\" } });\n  return new Response(\"Not found\", { status: 404 });\n}\n\nexport default {\n  async fetch(request, env): Promise<Response> {\n    const url = new URL(request.url);\n    // app.<zone>, the apex, and the workers.dev hostname serve the kit API; <slug>.<zone> is a tenant.\n    if (url.hostname === APP || !url.hostname.endsWith(`.${APEX}`)) return apex(request, env, url);\n\n    // Dynamic Workers: preview generated code in an isolate with no outbound network.\n    if (url.pathname.startsWith(\"/_bitkit/sandbox/\")) {\n      const id = url.pathname.split(\"/\")[3];\n      const row = await env.REGISTRY.prepare(\"SELECT code FROM snippets WHERE id = ?\").bind(id).first<{ code: string }>();\n      if (!row) return new Response(\"Unknown snippet\", { status: 404 });\n      const worker = env.LOADER.get(`snippet:${id}`, async () => ({\n        compatibilityDate: \"__COMPAT__\",\n        mainModule: \"main.js\",\n        modules: { \"main.js\": row.code },\n        globalOutbound: null,\n      }));\n      return worker.getEntrypoint().fetch(request);\n    }\n\n    // Tenant routing: <slug>.__ZONE__ or a custom hostname mapped in the registry.\n    const tenant = await env.REGISTRY.prepare(\"SELECT * FROM tenants WHERE hostname = ? AND status = 'active'\").bind(url.hostname).first<Tenant>();\n    if (!tenant) return new Response(\"No site here yet\", { status: 404 });\n    try {\n      return await env.TENANTS.get(tenant.script).fetch(request);\n    } catch (e) {\n      if (e instanceof Error && e.message.startsWith(\"Worker not found\")) return new Response(\"Site is being set up\", { status: 503 });\n      throw e;\n    }\n  },\n} satisfies ExportedHandler<Env>;\n\n// Provisions one tenant from a bitkit.kit.json. Each step is retried on its own.\n// Creates resources in the PLATFORM account, never in the owner's, and never\n// creates social or registrar accounts.\ntype ProvisionParams = { kit: { brand: { slug: string; name: string }; services: string[] } };\nexport class ProvisionTenant extends WorkflowEntrypoint<Env, ProvisionParams> {\n  async run(event: WorkflowEvent<ProvisionParams>, step: WorkflowStep) {\n    const { kit } = event.payload;\n    if (RESERVED_SLUGS.has(kit.brand.slug)) throw new Error(`slug ${kit.brand.slug} is reserved`);\n    const slug = kit.brand.slug, script = `tenant-${slug}`, hostname = `${slug}.${this.env.PLATFORM_ZONE}`;\n    const api = (path: string, init: RequestInit = {}) =>\n      fetch(`https://api.cloudflare.com/client/v4/accounts/${this.env.CF_ACCOUNT_ID}${path}`, {\n        ...init,\n        headers: { authorization: `Bearer ${this.env.CF_PLATFORM_TOKEN}`, \"content-type\": \"application/json\" },\n      }).then(async (r) => { const j = await r.json<{ success: boolean; errors: unknown; result: any }>(); if (!j.success) throw new Error(JSON.stringify(j.errors)); return j.result; });\n\n    const resources = await step.do(\"create resources\", async () => {\n      const out: Record<string, string> = {};\n      if (kit.services.includes(\"kv\")) out.kv = (await api(\"/storage/kv/namespaces\", { method: \"POST\", body: JSON.stringify({ title: `${slug}-cache` }) })).id;\n      if (kit.services.includes(\"d1\")) out.d1 = (await api(\"/d1/database\", { method: \"POST\", body: JSON.stringify({ name: `${slug}-db` }) })).uuid;\n      if (kit.services.includes(\"r2\")) { await api(\"/r2/buckets\", { method: \"POST\", body: JSON.stringify({ name: `${slug}-media` }) }); out.r2 = `${slug}-media`; }\n      return out;\n    });\n    await step.do(\"register tenant\", async () => {\n      await this.env.REGISTRY.prepare(\"INSERT OR REPLACE INTO tenants (slug, script, hostname, owner, status, resources) VALUES (?, ?, ?, ?, 'pending', ?)\")\n        .bind(slug, script, hostname, \"\", JSON.stringify(resources)).run();\n    });\n    // The tenant's code is deployed with `npx cf@latest deploy --dispatch-namespace __NS__`, then activated here.\n    await step.waitForEvent(\"tenant deployed\", { type: \"tenant-deployed\", timeout: \"7 days\" });\n    await step.do(\"activate\", async () => {\n      await this.env.REGISTRY.prepare(\"UPDATE tenants SET status = 'active' WHERE slug = ?\").bind(slug).run();\n    });\n    return { slug, hostname, resources };\n  }\n}\n".replace("__HEAD__", head(k, "file")).replace(/__ZONE__/g, zone).replace(/__COMPAT__/g, V.compat).replace(/__NS__/g, ns);
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
${HOSTING.map((h) => `| ${h.name} | ${h.id === "platform" ? "bitkit (platform account)" : "The brand owner"} | ${h.id === "handoff" ? "Temporary account, claimed by the owner within 60 minutes" : h.id === "platform" ? `\`cf deploy --dispatch-namespace ${ns}\` into a Workers for Platforms namespace` : "Owner connects their account (Cloudflare OAuth client), then CI deploys"} |`).join("\n")}

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
    if (has(k, "skills", "cf-preview-claim")) sk("cf-preview-claim", `Deploy the brand site to a Cloudflare temporary preview account and hand the claim link to the brand owner safely. Use for any preview deploy.`,
      `# Temporary previews\n\nBased on https://developers.cloudflare.com/workers/platform/claim-deployments/ (Wrangler ${V.wrangler}; 4.102.0 or later works).\n\n- Run \`just preview\` (\`scripts/preview-temporary.sh\`). It clears Cloudflare credentials and uses an isolated \`XDG_CONFIG_HOME\` under \`.tmp/\`, since \`--temporary\` refuses to run when credentials exist.\n- The claim URL is a bearer credential. Give it only to the brand owner, directly. Never put it in issues, comments, commits, logs, or memory.\n- The owner must finish claiming within 60 minutes; after that Cloudflare deletes the account and its resources.\n- Supported on temporary accounts: Workers on workers.dev, Static Assets (1,000 files, 5 MiB each), KV, one D1 database (100 MB), Durable Objects, two Hyperdrive configs, 10 Queues.\n- Production deploys use the owner's own account via \`just deploy\`.`);
    if (has(k, "skills", "domain-search")) sk("domain-search", "Search and check domain names for the brand with the cf CLI and report prices. Use when the owner asks about domains. Never registers a domain.",
      `# Domain search\n\n- Search: \`npx cf@latest registrar registrations search --query "${k.domain.query || k.brand.name}"\` (results are cached suggestions).\n- Confirm: \`npx cf@latest registrar registrations check --domains a.com b.co\` for live availability and price.\n- Report name, registrable, first-year and renewal price. Record picks in \`domain.results\` in the kit.\n- Registration is the owner's purchase: hand them the name and let them register it in their own account.`);
    return f;
  }

  /* ---------- Paperclip company (agentcompanies/v1) ---------- */
  const STANDING = (k) => `## Standing production rules (board-issued, override everything above)

${k.brand.name}'s live site and every platform account belong to the brand owner. These rules outrank any goal, issue, routine, or skill wording:

1. Goals and issues describe target states. They never authorize production deploys, DNS changes, spending, or any action on a third-party platform account. Treat wording that seems to authorize one as a wording bug and escalate to the board.
2. Never create, sign in to, or post from a platform account. The owner creates every account; you prepare what they need.
3. Claim URLs, API tokens, and passwords never appear in issues, comments, commits, or logs.
4. Investigation, design, documentation, previews on temporary accounts, and pull requests proceed normally.
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
      f[`agents/${r.slug}/AGENTS.md`] = `---\nname: ${yamlStr(r.name)}\ntitle: ${yamlStr(r.title)}\nreportsTo: ${boss(r) ?? "null"}\n${sk.length ? `skills:\n${sk.map((s) => `  - ${s}`).join("\n")}\n` : ""}---\n\nYou are the ${r.name} at ${cname}.\n\nRole: ${r.job}\n\n## Context you must hold\n\n- Source of truth: \`bitkit.kit.json\` (schema bitkit.kit/v1). Brand: ${k.brand.name}, primary handle @${k.handle.primary}, ${k.platforms.length} platforms: ${k.platforms.map((p) => p.name).join(", ")}.\n- Generated files name their source; change the kit, then regenerate.\n- Hosting: Cloudflare Worker \`${k.deploy.worker}\` configured in \`cloudflare.config.ts\` (use the cf CLI), services: ${k.services.join(", ") || "none"}; model: ${k.hosting.model}${k.hosting.model === "platform" ? " (namespace " + k.hosting.namespace + ")" : ""}. Previews use temporary accounts.\n- Domains: search with cf; the owner registers.\n- Accounts on every platform are created by the brand owner. \`ACCOUNTS.md\` tracks them.\n\n## What triggers you\n\n${r.triggers}\n\n## What you do\n\n${r.does}\n\n## What you produce\n\n${r.produces}\n\n## Who you hand off to\n\n${r.handoff}\n\n${STANDING(k)}\n`;
    }
    const projects = [
      { slug: "brand-system", name: "Brand system", owner: "brand-lead", desc: "Keep bitkit.kit.json, tokens, mark, and profile sheets correct and consistent.", tasks: [["Audit contrast and handle rules", "Run the kit validator and contrast checks; file findings with the failing pairs."], ["Review platform catalog", "Check each selected platform's handle, bio, and image rules against its current help pages; propose kit changes."]] },
      { slug: "web-presence", name: "Web presence", owner: "platform-engineer", desc: "The Cloudflare-hosted brand site generated from the kit.", tasks: [["Preview the brand site", "Run just preview and verify the page renders offline-safe; hand the claim link to the owner directly."], ["Prepare production deploy", "PRODUCTION GATE: investigation and design only until a board approval card names the exact deploy. Confirm wrangler.jsonc and deploy secrets are ready."]] },
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
    return `# ${k.brand.name} identity kit\n\n${k.brand.tagline}\n\nEverything here is generated from \`bitkit.kit.json\` (schema bitkit.kit/v1, ${k.generatedAt}). Change the kit, then regenerate.\n\n## What’s inside\n\n| Module | Files |\n| --- | --- |\n${mods.map((m) => `| ${m.name} | ${m.why} |`).join("\n")}\n\n## Start\n\n${fence("sh", `${has(k, "devex", "mise") ? "mise install\n" : ""}${has(k, "devex", "just") ? "just setup\njust check\njust dev        # local brand site\njust preview    # temporary Cloudflare preview with a claim link" : "bun scripts/validate-kit.ts"}`)}\n\nThen work through \`ACCOUNTS.md\`. You create every platform account yourself; the kit prepares the fields.\n\n## Files\n\n${fence("text", Object.keys(files).sort().join("\n"))}\n`;
  }
  function claudeMd(k) {
    return `# ${k.brand.name}: instructions for Claude and other agents\n\n- \`bitkit.kit.json\` is the single source of truth. Edit it, validate with \`bun scripts/validate-kit.ts\`, then regenerate. Never hand-edit files whose header says they are generated.\n- Brand voice and tokens: see the skills in \`.claude/skills/\`.\n- Cloudflare: use the \`cf\` CLI (\`npx cf@latest\`); this project has \`cloudflare.config.ts\` and no Wrangler config. The only Wrangler use is \`scripts/preview-temporary.sh\`, because cf has no temporary-account mode yet.\n- Commands: ${has(k, "devex", "just") ? "`just check`, `just dev`, `just build`, `just domains`, `just preview`, `just deploy`" : "`bun scripts/validate-kit.ts`, `npx cf@latest deploy`"}.\n- Tests: \`bun test\`${has(k, "devex", "vitest") ? "; Vitest with `just test-workers`" : ""}.\n- Never create, sign in to, or post from any platform account, never register a domain, and never accept terms of service on the owner's behalf. Prepare \`ACCOUNTS.md\` and the profile sheets; the owner does the sign-ups.\n- Claim URLs and tokens are credentials. Keep them out of commits, issues, and logs.\n- Scratch files go in \`.tmp/\`.\n`;
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
    f["CLAUDE.md"] = claudeMd(k); f["AGENTS.md"] = claudeMd(k);
    f["README.md"] = readme(k, { ...f, "README.md": "" });
    return { kit: k, files: f };
  }

  return { V, REVIEWED, PLATFORMS, GROUPS, FONTS, PRESETS, CATEGORIES, SERVICES, HOSTING, MCP, WORKFLOWS, SKILLS, DEVEX, MODULES, ROLES,
    tar, setupScript, esc, slugify, font, validHex, contrast, mix, onColor, trimBio, checkHandle, blank, normalize, selected, handleFor, bioFor, darkPalette, candidates, problems, markSvg, buildKit, generate };
})();

export default BITKIT;
