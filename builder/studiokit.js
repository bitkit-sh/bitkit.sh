const S = require("./gen.js");
module.exports = () => { const d = S.normalize({ ...S.blank(),
  brand: { name: "bitkit", tagline: "Brand identity in a box: one kit, every surface.", category: "Software", keywords: ["identity", "kits", "cloudflare"] },
  handle: { primary: "bitkitsh", overrides: {} }, platforms: ["x", "bluesky", "threads", "linkedin", "youtube", "github"],
  palette: { primary: "#8e1b2e", secondary: "#2b3a55", accent: "#e8b54a", ink: "#17161a", paper: "#f7f4f0" },
  type: { heading: "Bricolage Grotesque", body: "Hanken Grotesk", scale: 1.25 }, shape: { radius: 14 }, mark: { kind: "seal", glyphs: "b" },
  voice: { formality: 0.45, playfulness: 0.35, boldness: 0.6, do: ["Show the kit, then the claim", "Name the file a feature lives in"], dont: ["Growth-hack language", "Promises about follower counts"], bio: "bitkit turns a brand into one kit: brand book, tokens, profile sheets, repo, CI, Cloudflare services, and an agent team. You create the accounts; bitkit prepares the rest.", bios: {} },
  repo: { host: "github", owner: "bitkit-sh", name: "bitkit" }, deploy: { worker: "bitkit-site", domain: "bitkit.sh", preview: "temporary" },
  domain: { query: "bitkit", results: [], checkedAt: "", account: "" },
  services: ["kv", "d1", "r2", "analytics"], hosting: { model: "connect", namespace: "bitkit-tenants", platformZone: "bitkit.sh" },
  agents: { purpose: "studio", size: "full", budgetCents: 2500, timezone: "America/Chicago" } });
  d.modules = [...new Set([...d.modules, "platform"])]; return d; };
