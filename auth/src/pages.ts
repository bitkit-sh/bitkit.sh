// Server-rendered account pages, branded per hostname.
export type Brand = { title: string; primary: string; letter: string };
export const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const CODES = "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(" ");
const names = new Intl.DisplayNames(["en"], { type: "region" });
export const COUNTRIES = CODES.map((c) => [c, names.of(c) ?? c] as const).sort((a, b) => a[1].localeCompare(b[1]));
export const isCountry = (c: string) => CODES.includes(c);

const mark = (b: Brand) => `<svg width="44" height="44" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="58" fill="${b.primary}"/><text x="60" y="62" text-anchor="middle" dominant-baseline="central" font-family="system-ui,sans-serif" font-weight="700" font-size="58" fill="#fff">${esc(b.letter)}</text></svg>`;

export function page(b: Brand, title: string, body: string, opts: { wide?: boolean; status?: number; headers?: HeadersInit } = {}): Response {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · ${esc(b.title)}</title><meta name="robots" content="noindex">
<style>
:root{--p:${b.primary};--ink:#17161a;--muted:#5d5866;--line:#dedad5;--bg:#f7f5f2;--card:#fff;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--ink:#f1ece6;--muted:#b3acb6;--line:#34303a;--bg:#121114;--card:#1b191d;color-scheme:dark}}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;padding:24px 16px}
main{width:100%;max-width:${opts.wide ? 640 : 420}px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:28px}
.top{display:flex;align-items:center;gap:12px;margin-bottom:18px}.top b{font-size:20px}
h1{font-size:24px;line-height:1.2;margin:0 0 6px}p{margin:8px 0}.muted{color:var(--muted);font-size:14px}
form{display:grid;gap:14px;margin-top:16px}label{display:grid;gap:6px;font-weight:600;font-size:14px}
input,select{font:inherit;padding:11px 12px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink);width:100%}
input:focus,select:focus{outline:2px solid var(--p);outline-offset:1px}
.row{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media (max-width:520px){.row{grid-template-columns:1fr}}
.check{display:flex;gap:10px;align-items:flex-start;font-weight:400}.check input{width:auto;margin-top:4px}
button,.btn{font:600 16px system-ui,sans-serif;background:var(--p);color:#fff;border:0;border-radius:10px;padding:12px 16px;cursor:pointer;text-decoration:none;text-align:center}
.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}
.err{background:#fde8e8;color:#8a1c1c;border-radius:10px;padding:10px 12px;font-size:14px}.ok{background:#e7f6ec;color:#16502b;border-radius:10px;padding:10px 12px;font-size:14px}
@media (prefers-color-scheme:dark){.err{background:#3a1717;color:#ffc9c9}.ok{background:#14301f;color:#bdf0cf}}
a{color:var(--p)}fieldset{border:0;padding:0;margin:0;display:grid;gap:14px}legend{font-weight:700;margin-bottom:4px}
.links{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:14px;margin-top:14px}
</style></head><body><main><div class="top">${mark(b)}<b>${esc(b.title)}</b></div>${body}</main></body></html>`;
  const h = new Headers(opts.headers); h.set("content-type", "text/html; charset=utf-8"); h.set("cache-control", "no-store");
  h.set("x-frame-options", "DENY"); h.set("content-security-policy", "frame-ancestors 'none'; form-action 'self'"); h.set("referrer-policy", "same-origin");
  return new Response(html, { status: opts.status ?? 200, headers: h });
}

export const msg = (m?: { err?: string; ok?: string }) => (m?.err ? `<p class="err" role="alert">${esc(m.err)}</p>` : "") + (m?.ok ? `<p class="ok" role="status">${esc(m.ok)}</p>` : "");
const hidden = (ret: string) => `<input type="hidden" name="return" value="${esc(ret)}">`;
const field = (name: string, label: string, v: Record<string, string>, type = "text", extra = "") => `<label>${label}<input name="${name}" type="${type}" value="${esc(v[name] ?? "")}" ${extra}></label>`;
const countrySelect = (v: string) => `<label>Country<select name="country" required autocomplete="country"><option value="">Choose…</option>${COUNTRIES.map(([c, n]) => `<option value="${c}"${c === v ? " selected" : ""}>${esc(n)}</option>`).join("")}</select></label>`;

export function profileFields(v: Record<string, string>): string {
  return `<fieldset><legend>Billing details</legend>
${field("company", "Company <span class=\"muted\">(optional)</span>", v, "text", 'autocomplete="organization"')}
${countrySelect(v.country ?? "")}
${field("address_line1", "Address", v, "text", 'required autocomplete="address-line1"')}
${field("address_line2", "Apartment, suite <span class=\"muted\">(optional)</span>", v, "text", 'autocomplete="address-line2"')}
<div class="row">${field("city", "City", v, "text", 'required autocomplete="address-level2"')}${field("region", "State or region", v, "text", 'autocomplete="address-level1"')}</div>
<div class="row">${field("postal_code", "Postal code", v, "text", 'required autocomplete="postal-code"')}${field("phone", "Phone <span class=\"muted\">(optional)</span>", v, "tel", 'autocomplete="tel"')}</div>
${field("tax_id", "Tax ID <span class=\"muted\">(optional, e.g. VAT or EIN)</span>", v)}
</fieldset>`;
}

export const signupPage = (b: Brand, ret: string, v: Record<string, string> = {}, m?: { err?: string }) => page(b, "Create your account", `<h1>Create your ${esc(b.title)} account</h1><p class="muted">One account works on every BitBuilder site.</p>${msg(m)}
<form method="post" action="/signup">${hidden(ret)}
${field("name", "Full name", v, "text", 'required autocomplete="name"')}
${field("email", "Email", v, "email", 'required autocomplete="email"')}
<label>Password<input name="password" type="password" required minlength="10" autocomplete="new-password"><span class="muted">At least 10 characters.</span></label>
${profileFields(v)}
<label class="check"><input type="checkbox" name="terms" value="1" required${v.terms ? " checked" : ""}><span>I agree to the <a href="https://www.bitkit.sh/terms" target="_blank" rel="noopener">terms</a> and <a href="https://www.bitkit.sh/privacy" target="_blank" rel="noopener">privacy policy</a>.</span></label>
<button>Create account</button></form>
<div class="links"><span>Have an account? <a href="/login?return=${encodeURIComponent(ret)}">Sign in</a></span></div>`, { wide: true });

export const loginPage = (b: Brand, ret: string, v: Record<string, string> = {}, m?: { err?: string; ok?: string }) => page(b, "Sign in", `<h1>Sign in</h1>${msg(m)}
<form method="post" action="/login">${hidden(ret)}
${field("email", "Email", v, "email", 'required autocomplete="email" autofocus')}
<label>Password<input name="password" type="password" required autocomplete="current-password"></label>
<button>Sign in</button></form>
<div class="links"><a href="/forgot?return=${encodeURIComponent(ret)}">Forgot password?</a><span>New here? <a href="/signup?return=${encodeURIComponent(ret)}">Create an account</a></span></div>`);

export const forgotPage = (b: Brand, ret: string, m?: { err?: string; ok?: string }) => page(b, "Reset your password", `<h1>Reset your password</h1><p class="muted">We will email you a link to choose a new password.</p>${msg(m)}
<form method="post" action="/forgot">${hidden(ret)}<label>Email<input name="email" type="email" required autocomplete="email" autofocus></label><button>Send reset link</button></form>
<div class="links"><a href="/login?return=${encodeURIComponent(ret)}">Back to sign in</a></div>`);

export const resetPage = (b: Brand, token: string, m?: { err?: string }) => page(b, "Choose a new password", `<h1>Choose a new password</h1>${msg(m)}
<form method="post" action="/reset"><input type="hidden" name="token" value="${esc(token)}">
<label>New password<input name="password" type="password" required minlength="10" autocomplete="new-password" autofocus><span class="muted">At least 10 characters.</span></label>
<button>Save password and sign in</button></form>`);

export const notice = (b: Brand, title: string, text: string, action?: { href: string; label: string }) => page(b, title, `<h1>${esc(title)}</h1><p>${text}</p>${action ? `<p style="margin-top:18px"><a class="btn" href="${esc(action.href)}">${esc(action.label)}</a></p>` : ""}`);
