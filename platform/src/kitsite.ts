// Read-only kit site: renders a tenant's design system (submitted from Claude, or the generated seed).
import { esc, markdown } from "./md.ts";

type Files = Record<string, string>;
type Token = { name: string; value: string | Record<string, string>; usage?: string };

export function renderKitSite(files: Files, opts: { source: "claude" | "seed"; siteUrl?: string; updatedAt?: string }): string {
  const get = (p: string) => files[`project/${p}`] ?? files[p];
  let tokens: any = {};
  try { tokens = JSON.parse(get("tokens.json") ?? "{}"); } catch { tokens = {}; }
  let index: any = {};
  try { index = JSON.parse(get("design-system.json") ?? "{}"); } catch { index = {}; }
  const title = index.title || tokens.name || "Design system";
  const themes: { id: string; name: string }[] = tokens.color?.themes ?? [{ id: "light", name: "Light" }];
  const colors: Token[] = tokens.color?.tokens ?? [];
  const val = (t: Token, theme: string) => (typeof t.value === "string" ? t.value : t.value[theme] ?? t.value[themes[0].id]);
  const cssVars = (theme: string) => colors.map((t) => `--${t.name}:${val(t, theme)};`).join("") +
    [...(tokens.spacing?.tokens ?? []), ...(tokens.radius?.tokens ?? [])].map((t: Token) => `--${t.name}:${t.value};`).join("") +
    Object.entries(tokens.type?.families ?? {}).map(([k, v]) => `--font-${k}:${v};`).join("");
  const comps = [...new Set(Object.keys(files).map((p) => p.replace(/^project\//, "").match(/^components\/([^/]+)\//)?.[1]).filter(Boolean) as string[])].filter((c) => c !== "Cover");
  const fontsHref = Object.values(tokens.type?.families ?? {}).map((f: any) => String(f).match(/^"([^"]+)"/)?.[1]).filter((f) => f && !/^(ui-|system-ui|Georgia)/.test(f!))
    .map((f) => `family=${f!.replace(/ /g, "+")}:wght@400;600;700`).join("&");
  const preview = (html: string, h: number) => {
    const doc = `<!doctype html><html><head><meta charset="utf-8">${fontsHref ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fontsHref}&display=swap">` : ""}<style>:root{${cssVars(themes[0].id)}}</style></head><body>${html.replace(/^<!--[^>]*-->\s*/, "")}</body></html>`;
    return `<iframe class="pv" sandbox="allow-same-origin" loading="lazy" style="height:${h}px" srcdoc="${esc(doc)}"></iframe>`;
  };
  const height = (html: string, d: number) => Number(html.match(/height=(\d+)/)?.[1] ?? d);
  const cover = get("components/Cover/preview.html");
  const readme = get("README.md") ?? `# ${title}\n`;
  const t0 = themes[0].id, t1 = themes[1]?.id;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Design system</title>${fontsHref ? `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fontsHref}&display=swap">` : ""}
<style>
:root{${cssVars(t0)}color-scheme:light}
${t1 ? `@media (prefers-color-scheme: dark){:root:not([data-theme=${t0}]){${cssVars(t1)}color-scheme:dark}}:root[data-theme=${t1}]{${cssVars(t1)}color-scheme:dark}` : ""}
*{box-sizing:border-box}body{margin:0;background:var(--paper,#fff);color:var(--ink,#111);font:16px/1.55 var(--font-body,system-ui,sans-serif)}
.wrap{max-width:1040px;margin:0 auto;padding:clamp(16px,4vw,40px)}
header{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px clamp(16px,4vw,40px);border-bottom:1px solid var(--line,#ddd);position:sticky;top:0;background:var(--paper,#fff);z-index:2}
header b{font:700 18px/1 var(--font-heading,inherit)}header nav{display:flex;gap:14px;flex-wrap:wrap;font-size:14px}a{color:var(--primary,#06c)}
.btn{border:1px solid var(--line,#ccc);background:var(--raised,#fff);color:var(--ink,#111);border-radius:999px;padding:6px 12px;cursor:pointer;font:inherit;font-size:13px}
h1,h2,h3{font-family:var(--font-heading,inherit);line-height:1.15;letter-spacing:-.01em}h2{margin-top:2.2em}
.card{background:var(--raised,#fff);border:1px solid var(--line,#ddd);border-radius:var(--radius-l,16px);overflow:hidden;margin:16px 0}
.card .meta{padding:14px 16px;border-top:1px solid var(--line,#ddd)}.pv{display:block;width:100%;border:0;background:var(--paper,#fff)}
.tw{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:14px}th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line,#ddd);vertical-align:top}
.sw{display:inline-block;width:18px;height:18px;border-radius:5px;border:1px solid var(--line,#ccc);vertical-align:-4px;margin-right:6px}
code{font:13px ui-monospace,Menlo,monospace}pre{overflow-x:auto;background:var(--raised,#f6f6f6);padding:12px;border-radius:8px}
blockquote{margin:0;padding:12px 16px;border-left:4px solid var(--accent,#999);background:var(--raised,#f6f6f6)}
.note{font-size:13px;color:var(--ink-muted,#666)}
</style></head><body>
<header><b>${esc(title)}</b><nav><a href="#brand">Brand book</a><a href="#tokens">Tokens</a>${comps.length ? `<a href="#components">Components</a>` : ""}${opts.siteUrl ? `<a href="${esc(opts.siteUrl)}">Website</a>` : ""}<button class="btn" type="button" onclick="var r=document.documentElement;r.dataset.theme=(r.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'${t1 ?? t0}':'${t0}'))==='${t0}'?'${t1 ?? t0}':'${t0}'">Theme</button></nav></header>
<main class="wrap">
${cover ? `<div class="card">${preview(cover, height(cover, 320))}</div>` : ""}
<section id="brand">${markdown(readme)}</section>
<section id="tokens"><h2>Tokens</h2>
<h3>Color</h3><div class="tw"><table><thead><tr><th>Token</th>${themes.map((t) => `<th>${esc(t.name)}</th>`).join("")}<th>Use</th></tr></thead><tbody>
${colors.map((t) => `<tr><td><code>${esc(t.name)}</code></td>${themes.map((th) => `<td><span class="sw" style="background:${esc(val(t, th.id))}"></span><code>${esc(val(t, th.id))}</code></td>`).join("")}<td>${esc(t.usage ?? "")}</td></tr>`).join("")}
</tbody></table></div>
<h3>Type</h3>${(tokens.type?.groups ?? []).map((g: any) => g.styles.map((s: any) => `<p style="margin:10px 0;font-family:var(--font-${esc(g.family)});font-size:${esc(s.fontSize)};line-height:${esc(String(s.lineHeight))};font-weight:${esc(String(s.fontWeight))}">${esc(s.name)} · ${esc(title)}</p>`).join("")).join("")}
<h3>Spacing and radius</h3><div class="tw"><table><tbody>${[...(tokens.spacing?.tokens ?? []), ...(tokens.radius?.tokens ?? [])].map((t: Token) => `<tr><td><code>${esc(t.name)}</code></td><td><code>${esc(String(t.value))}</code></td><td>${esc(t.usage ?? "")}</td></tr>`).join("")}</tbody></table></div>
</section>
${comps.length ? `<section id="components"><h2>Components</h2>${comps.map((c) => { const pv = get(`components/${c}/preview.html`); const rd = get(`components/${c}/README.md`); return `<div class="card">${pv ? preview(pv, height(pv, 120)) : ""}<div class="meta"><h3 style="margin:0 0 6px">${esc(c)}</h3>${rd ? markdown(rd) : ""}</div></div>`; }).join("")}</section>` : ""}
<p class="note">${opts.source === "claude" ? "Built in Claude" : "Generated from the bitkit kit; build it out in Claude"}${opts.updatedAt ? ` · updated ${esc(opts.updatedAt)}` : ""}. Served by bitkit.</p>
</main></body></html>`;
}
