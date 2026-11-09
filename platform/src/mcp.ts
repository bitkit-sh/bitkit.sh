// bitkit MCP server: stateless Streamable HTTP (JSON responses), so any MCP client can use it.
// Reads need only the kit id (an unguessable 20-character id). Writes also need the kit's edit key.
import bitkit from "./generator.js";

type Ctx = { env: Env; origin: string; headerKey: string | null; userId: string | null };
type Tool = { name: string; description: string; inputSchema: object; run: (args: any, ctx: Ctx) => Promise<unknown> };
const VERSIONS = ["2026-07-28", "2025-11-25", "2025-06-18", "2025-03-26"];
const KIT = { type: "string", pattern: "^[a-z2-7]{20}$", description: "Kit id from the bitkit setup command, e.g. gmzz7vbo5w3pvb3iix7q" };
const KEY = { type: "string", description: "The kit's edit key. Omit it when the connector sends the key in an x-bitkit-key or x-auth-token header." };

const hex = async (s: string) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map((b) => b.toString(16).padStart(2, "0")).join("");
async function loadKit(env: Env, id: string) {
  if (!/^[a-z2-7]{20}$/.test(id)) throw new Error("kit_id must be 20 characters a-z and 2-7");
  const row = await env.REGISTRY.prepare("SELECT id, slug, name, published_at, key_hash, owner_id FROM kits WHERE id = ?").bind(id).first<{ id: string; slug: string; name: string; published_at: number; key_hash: string | null; owner_id: string | null }>();
  const obj = row && (await env.KITS.get(`kits/${id}/bitkit.kit.json`));
  if (!row || !obj) throw new Error("No kit with that id");
  return { row, kit: bitkit.normalize(await obj.json()) };
}
async function authorize(env: Env, id: string, key: string | undefined, headerKey: string | null = null, userId: string | null = null) {
  key = key || headerKey || undefined;
  const { row, kit } = await loadKit(env, id);
  if (userId && row.owner_id === userId) return { row, kit };
  if (!row.key_hash || typeof key !== "string" || (await hex(key)) !== row.key_hash) throw new Error(userId ? "This kit belongs to another account, and the edit key does not match" : "Sign in to bitkit, or send the kit's edit key");
  if (userId && !row.owner_id) await env.REGISTRY.prepare("UPDATE kits SET owner_id = ? WHERE id = ? AND owner_id IS NULL").bind(userId, id).run();
  return { row, kit };
}
const merge = (a: any, b: any): any => (b && typeof b === "object" && !Array.isArray(b) ? Object.fromEntries([...new Set([...Object.keys(a ?? {}), ...Object.keys(b)])].map((k) => [k, k in b ? merge(a?.[k], b[k]) : a[k]])) : b);
const safePath = (p: string) => typeof p === "string" && p.startsWith("project/") && !p.includes("..") && !p.includes("\\") && /^[A-Za-z0-9_./~-]+$/.test(p);

export const TOOLS: Tool[] = [
  { name: "get_kit", description: "Read a bitkit kit (bitkit.kit.json): brand, handles, platforms, palette, type, voice, services, and modules.",
    inputSchema: { type: "object", properties: { kit_id: KIT }, required: ["kit_id"] },
    run: async ({ kit_id }, { env }) => (await loadKit(env, kit_id)).kit },
  { name: "get_design_seed", description: "Get the starting files for the kit's Claude Design System (project/tokens.json, project/README.md, components, the mark). Create the design system from these files exactly, then refine it with the owner.",
    inputSchema: { type: "object", properties: { kit_id: KIT }, required: ["kit_id"] },
    run: async ({ kit_id }, { env }) => { const { kit } = await loadKit(env, kit_id); kit.modules = [...new Set([...kit.modules, "design-system"])];
      const files = bitkit.generate(kit).files; return Object.fromEntries(Object.entries(files).filter(([p]) => p.startsWith("design-system/project/")).map(([p, c]) => [p.slice("design-system/".length), c])); } },
  { name: "update_kit", description: "Change a kit. Pass only the fields to change; arrays replace whole arrays. Returns the updated kit or the problems that blocked it.",
    inputSchema: { type: "object", properties: { kit_id: KIT, key: KEY, changes: { type: "object", description: "Partial bitkit.kit.json" } }, required: ["kit_id", "changes"] },
    run: async ({ kit_id, key, changes }, { env, headerKey, userId }) => { const { kit } = await authorize(env, kit_id, key, headerKey, userId); const next = bitkit.normalize(merge(kit, changes));
      const problems = bitkit.problems(next); if (problems.length) return { updated: false, problems };
      await env.KITS.put(`kits/${kit_id}/bitkit.kit.json`, JSON.stringify(next), { httpMetadata: { contentType: "application/json" } });
      await env.KITS.delete(`kits/${kit_id}/bundle.tar.gz`);
      await env.REGISTRY.prepare("UPDATE kits SET name = ?, updated_at = ? WHERE id = ?").bind(next.brand.name, Date.now(), kit_id).run();
      return { updated: true, kit: next }; } },
  { name: "submit_design_system", description: "Hand the finished Claude Design System back to bitkit. Send every file under project/ (tokens.json, README.md, design-system.json, components/*/README.md and preview.html) as text, and binary assets (images, fonts) as base64. bitkit then serves it at the kit site.",
    inputSchema: { type: "object", properties: { kit_id: KIT, key: KEY,
      files: { type: "object", additionalProperties: { type: "string" }, description: "Map of project/... path to file text" },
      assets: { type: "object", additionalProperties: { type: "string" }, description: "Map of project/assets/... path to base64 bytes" } }, required: ["kit_id", "files"] },
    run: async ({ kit_id, key, files, assets = {} }, { env, origin, headerKey, userId }) => { await authorize(env, kit_id, key, headerKey, userId);
      const all = { ...files, ...assets }; const bad = Object.keys(all).filter((p) => !safePath(p));
      if (bad.length) return { stored: false, problem: `Paths must start with project/ and use letters, digits, and ./_-~: ${bad.slice(0, 5).join(", ")}` };
      if (!files["project/tokens.json"] && !files["project/README.md"]) return { stored: false, problem: "Include at least project/README.md or project/tokens.json" };
      const size = Object.values(all).reduce((n: number, v: any) => n + String(v).length, 0); if (size > 4_000_000) return { stored: false, problem: "Over 4 MB; send large assets in a second call" };
      for (const [p, t] of Object.entries(files)) await env.KITS.put(`kits/${kit_id}/system/${p}`, String(t));
      for (const [p, b] of Object.entries(assets)) await env.KITS.put(`kits/${kit_id}/system/${p}`, Uint8Array.from(atob(String(b)), (c) => c.charCodeAt(0)));
      const manifest = { files: Object.keys(files), assets: Object.keys(assets), at: new Date().toISOString() };
      await env.KITS.put(`kits/${kit_id}/system.json`, JSON.stringify(manifest), { httpMetadata: { contentType: "application/json" } });
      return { stored: true, files: manifest.files.length, assets: manifest.assets.length, kit_site: `${origin}/kits/${kit_id}/` }; } },
  { name: "kit_status", description: "Where a kit lives: setup command, kit site, website, and deploy status.",
    inputSchema: { type: "object", properties: { kit_id: KIT }, required: ["kit_id"] },
    run: async ({ kit_id }, { env, origin }) => { const { kit } = await loadKit(env, kit_id);
      const tenant = await env.REGISTRY.prepare("SELECT slug, hostname, status FROM tenants WHERE kit_id = ?").bind(kit_id).first<{ slug: string; hostname: string; status: string }>();
      const req = await env.REGISTRY.prepare("SELECT status, created_at FROM deploy_requests WHERE kit_id = ? ORDER BY created_at DESC LIMIT 1").bind(kit_id).first<{ status: string; created_at: number }>();
      const system = await env.KITS.head(`kits/${kit_id}/system.json`);
      return { brand: kit.brand.name, setup: `curl -fsSL ${origin}/setup/${kit_id} | sh`, kit_site: `${origin}/kits/${kit_id}/`, design_system: system ? "submitted" : "seed only",
        website: tenant ? `https://${tenant.hostname}` : null, tenant_status: tenant?.status ?? "not deployed", deploy_request: req ?? null }; } },
  { name: "request_deploy", description: "Ask bitkit to deploy the kit's website on the owner's behalf (EmDash marketing site on bitkit's Cloudflare platform). Never creates social or registrar accounts.",
    inputSchema: { type: "object", properties: { kit_id: KIT, key: KEY }, required: ["kit_id"] },
    run: async ({ kit_id, key }, { env, headerKey, userId }) => { await authorize(env, kit_id, key, headerKey, userId);
      await env.REGISTRY.prepare("INSERT INTO deploy_requests (kit_id, status, created_at) VALUES (?, 'requested', ?)").bind(kit_id, Date.now()).run();
      return { requested: true, note: "Queued. kit_status shows progress." }; } }
];

const INSTRUCTIONS = "bitkit builds brand identity kits. Start with get_kit, then get_design_seed to create the owner's Claude Design System from those files exactly. When the owner is happy, send the system back with submit_design_system and offer request_deploy. Write tools need the kit's edit key. If the connector sends it in a header, omit the key argument; otherwise ask the owner for it and never repeat it back. Never create, sign in to, or post from social or registrar accounts; the owner does that.";

const WRITES = new Set(["update_kit", "submit_design_system", "request_deploy"]);
export async function handleMcp(request: Request, env: Env, origin: string, userId: string | null = null): Promise<Response> {
  if (request.method === "GET" || request.method === "DELETE") return new Response(null, { status: 405, headers: { allow: "POST" } });
  if (request.method !== "POST") return new Response(null, { status: 405 });
  const headerKey = request.headers.get("x-bitkit-key") ?? request.headers.get("x-auth-token");
  let msg: any; try { msg = await request.json(); } catch { return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, { status: 400 }); }
  // Sign in when needed: a write with no credentials gets an HTTP 401 so the client starts OAuth.
  const calls = (Array.isArray(msg) ? msg : [msg]).filter((x: any) => x?.method === "tools/call");
  if (!userId && !headerKey && calls.some((c: any) => WRITES.has(c.params?.name) && !c.params?.arguments?.key)) {
    return new Response(JSON.stringify({ jsonrpc: "2.0", id: calls[0].id ?? null, error: { code: -32001, message: "Sign in to bitkit to change this kit" } }), { status: 401, headers: { "content-type": "application/json", "www-authenticate": `Bearer resource_metadata="${origin}/.well-known/oauth-protected-resource"` } });
  }
  const one = async (m: any) => {
    if (m.id === undefined) return null; // notification
    const ok = (result: unknown) => ({ jsonrpc: "2.0", id: m.id, result });
    if (m.method === "initialize") {
      const v = VERSIONS.includes(m.params?.protocolVersion) ? m.params.protocolVersion : VERSIONS[0];
      return ok({ protocolVersion: v, capabilities: { tools: { listChanged: false } }, serverInfo: { name: "bitkit", title: "bitkit", version: "0.1.0" }, instructions: INSTRUCTIONS });
    }
    if (m.method === "ping") return ok({});
    if (m.method === "tools/list") return ok({ tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
    if (m.method === "tools/call") {
      const t = TOOLS.find((x) => x.name === m.params?.name);
      if (!t) return { jsonrpc: "2.0", id: m.id, error: { code: -32602, message: `Unknown tool ${m.params?.name}` } };
      try { const out = await t.run(m.params?.arguments ?? {}, { env, origin, headerKey, userId }); return ok({ content: [{ type: "text", text: JSON.stringify(out, null, 2) }], structuredContent: out && typeof out === "object" && !Array.isArray(out) ? out : { result: out } }); }
      catch (e) { return ok({ content: [{ type: "text", text: e instanceof Error ? e.message : String(e) }], isError: true }); }
    }
    return { jsonrpc: "2.0", id: m.id, error: { code: -32601, message: `Method not found: ${m.method}` } };
  };
  const res = Array.isArray(msg) ? (await Promise.all(msg.map(one))).filter(Boolean) : await one(msg);
  if (res === null || (Array.isArray(res) && !res.length)) return new Response(null, { status: 202 });
  return Response.json(res, { headers: { "cache-control": "no-store" } });
}
