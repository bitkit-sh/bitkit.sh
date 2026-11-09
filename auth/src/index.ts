// BitBuilder identity: one account system and OAuth authorization server for every brand.
// Account pages (sign up, sign in, forgot/reset password, email verification, profile) are served
// on each brand's host; the session is a signed, HttpOnly cookie on that host, valid for 30 days.
// MCP OAuth (discovery, DCR, CIMD, PKCE, tokens) uses @cloudflare/workers-oauth-provider, the
// library behind Cloudflare's own MCP servers. Resource servers validate tokens over RPC.
import { WorkerEntrypoint } from "cloudflare:workers";
import { AuthorizationError, CimdFetchError, OAuthAuthorizationServer } from "@cloudflare/workers-oauth-provider";
import { checkPassword, hashPassword, signToken, verifyToken } from "./crypto.ts";
import { type Brand, esc, forgotPage, isCountry, loginPage, msg, notice, page, profileFields, resetPage, signupPage } from "./pages.ts";

const BRANDS: Record<string, Brand> = {
  "app.bitkit.sh": { title: "bitkit", primary: "#8e1b2e", letter: "b" },
  "auth.bitkit.sh": { title: "bitkit", primary: "#8e1b2e", letter: "b" },
  "auth.appx.sh": { title: "appx", primary: "#3b5bdb", letter: "a" },
  "auth.cloudx.sh": { title: "cloudx", primary: "#0b7285", letter: "c" },
  "auth.plat.sh": { title: "plat.sh", primary: "#c00068", letter: "p" },
  "auth.bitbuilder.io": { title: "BitBuilder", primary: "#1f2937", letter: "B" },
};
const SENDER = "login@bitkit.sh";
const SESSION_DAYS = 30;
type Session = { sub: string; email: string; name: string };
type Account = Record<string, string | number | null> & { id: string; email: string; name: string | null; password_hash: string | null; email_verified_at: number | null };

// One authorization server per MCP origin; tokens are bound to that origin's /mcp resource.
const SERVERS = new Map<string, OAuthAuthorizationServer<Env>>();
function serverFor(origin: string): OAuthAuthorizationServer<Env> | null {
  if (origin !== "https://app.bitkit.sh") return null;
  let s = SERVERS.get(origin);
  if (!s) {
    s = new OAuthAuthorizationServer<Env>({
      issuer: origin,
      resources: [`${origin}/mcp`],
      scopesSupported: ["kits:read", "kits:write", "offline_access"],
      clientIdMetadataDocumentEnabled: true,
      clientRegistrationEndpoint: "/register",
      accessTokenTTL: 60 * 60,
      refreshTokenTTL: 60 * 60 * 24 * 90,
    });
    SERVERS.set(origin, s);
  }
  return s;
}

const cookieRe = (n: string) => new RegExp(`(?:^|;\\s*)${n}=([^;]+)`);
const getCookie = (req: Request, n: string) => req.headers.get("cookie")?.match(cookieRe(n))?.[1];
const sessionCookie = (token: string, maxAge: number) => `bk_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
const safeReturn = (r: FormDataEntryValue | string | null | undefined, fallback = "/account") => { const s = typeof r === "string" ? r : ""; return s.startsWith("/") && !s.startsWith("//") ? s : fallback; };
const redirect = (to: string, cookies: string[] = []) => { const h = new Headers({ location: to }); for (const c of cookies) h.append("set-cookie", c); return new Response(null, { status: 303, headers: h }); };
const norm = (e: string) => e.trim().toLowerCase();
const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;

async function currentSession(req: Request, env: Env): Promise<Session | null> {
  return verifyToken<Session>(getCookie(req, "bk_session"), env.SESSION_SECRET);
}
async function startSession(env: Env, a: { id: string; email: string; name: string | null }) {
  return sessionCookie(await signToken({ sub: a.id, email: a.email, name: a.name ?? "" }, env.SESSION_SECRET, SESSION_DAYS * 86400), SESSION_DAYS * 86400);
}
const byEmail = (env: Env, email: string) => env.ACCOUNTS.prepare("SELECT * FROM accounts WHERE email = ?").bind(email).first<Account>();
const byId = (env: Env, id: string) => env.ACCOUNTS.prepare("SELECT * FROM accounts WHERE id = ?").bind(id).first<Account>();

async function sendMail(env: Env, brand: Brand, to: string, subject: string, lead: string, link: string, button: string) {
  await env.EMAIL.send({
    to, from: { email: SENDER, name: brand.title }, subject,
    text: `${lead}\n\n${link}\n\nIf you did not ask for this, ignore this email.`,
    html: `<p>${esc(lead)}</p><p><a href="${esc(link)}" style="display:inline-block;background:${brand.primary};color:#fff;padding:12px 20px;border-radius:8px;font:600 16px system-ui,sans-serif;text-decoration:none">${esc(button)}</a></p><p style="color:#555;font-size:13px">Or open this link: ${esc(link)}<br>If you did not ask for this, ignore this email.</p>`,
  });
}

const PROFILE = ["company", "country", "address_line1", "address_line2", "city", "region", "postal_code", "phone", "tax_id"] as const;
function readProfile(f: FormData): { values: Record<string, string>; err?: string } {
  const v: Record<string, string> = {};
  for (const k of [...PROFILE, "name", "email", "terms"]) v[k] = String(f.get(k) ?? "").trim().slice(0, 200);
  if (!v.country || !isCountry(v.country)) return { values: v, err: "Choose your country." };
  if (!v.address_line1 || !v.city || !v.postal_code) return { values: v, err: "Address, city, and postal code are needed for billing." };
  return { values: v };
}

async function handlePages(req: Request, env: Env, url: URL, brand: Brand): Promise<Response | null> {
  const p = url.pathname, post = req.method === "POST";
  if (!["/signup", "/verify", "/login", "/logout", "/forgot", "/reset", "/account"].includes(p)) return null;
  if (post && req.headers.get("origin") && req.headers.get("origin") !== url.origin) return new Response("Cross-site form rejected", { status: 403 });
  const f = post ? await req.formData() : null;
  const ret = safeReturn(f?.get("return") ?? url.searchParams.get("return"));

  if (p === "/signup") {
    if (!post) return (await currentSession(req, env)) ? redirect(ret) : signupPage(brand, ret);
    const { values: v, err } = readProfile(f!);
    const email = norm(v.email), password = String(f!.get("password") ?? "");
    if (!v.name) return signupPage(brand, ret, v, { err: "Enter your name." });
    if (!validEmail(email)) return signupPage(brand, ret, v, { err: "Enter a valid email address." });
    if (password.length < 10) return signupPage(brand, ret, v, { err: "Use a password of at least 10 characters." });
    if (err) return signupPage(brand, ret, v, { err });
    if (v.terms !== "1") return signupPage(brand, ret, v, { err: "Accept the terms to continue." });
    const existing = await byEmail(env, email);
    if (existing?.password_hash) return loginPage(brand, ret, { email }, { err: "An account with this email exists. Sign in, or reset your password." });
    const id = existing?.id ?? crypto.randomUUID(), now = Date.now(), hash = await hashPassword(password);
    await env.ACCOUNTS.prepare(`INSERT INTO accounts (id, email, created_via, created_at, name, password_hash, company, country, address_line1, address_line2, city, region, postal_code, phone, tax_id, terms_accepted_at, updated_at)
      VALUES (?1, ?2, 'signup', ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?3, ?3)
      ON CONFLICT(email) DO UPDATE SET name = ?4, password_hash = ?5, company = ?6, country = ?7, address_line1 = ?8, address_line2 = ?9, city = ?10, region = ?11, postal_code = ?12, phone = ?13, tax_id = ?14, terms_accepted_at = ?3, updated_at = ?3`)
      .bind(id, email, now, v.name, hash, v.company || null, v.country, v.address_line1, v.address_line2 || null, v.city, v.region || null, v.postal_code, v.phone || null, v.tax_id || null).run();
    const t = await signToken({ sub: id, purpose: "verify", ret }, env.SESSION_SECRET, 86400);
    await sendMail(env, brand, email, `Confirm your ${brand.title} account`, `Welcome to ${brand.title}, ${v.name}. Confirm your email to finish creating your account.`, `${url.origin}/verify?token=${t}`, "Confirm email");
    return notice(brand, "Check your email", `We sent a confirmation link to <b>${esc(email)}</b>. Open it to finish creating your account; you will be signed in automatically.`);
  }

  if (p === "/verify") {
    const t = await verifyToken<{ sub: string; purpose: string; ret?: string }>(url.searchParams.get("token"), env.SESSION_SECRET);
    if (!t || t.purpose !== "verify") return notice(brand, "Link expired", "This confirmation link is invalid or has expired. Sign in to get a new one.", { href: "/login", label: "Sign in" });
    await env.ACCOUNTS.prepare("UPDATE accounts SET email_verified_at = COALESCE(email_verified_at, ?1), updated_at = ?1 WHERE id = ?2").bind(Date.now(), t.sub).run();
    const a = await byId(env, t.sub);
    if (!a) return notice(brand, "Account not found", "Create your account again.", { href: "/signup", label: "Create account" });
    return redirect(safeReturn(t.ret), [await startSession(env, a)]);
  }

  if (p === "/login") {
    if (!post) return (await currentSession(req, env)) ? redirect(ret) : loginPage(brand, ret);
    const email = norm(String(f!.get("email") ?? "")), password = String(f!.get("password") ?? "");
    const a = await byEmail(env, email);
    if (!a || !(await checkPassword(password, a.password_hash))) return loginPage(brand, ret, { email }, { err: a && !a.password_hash ? "This account has no password yet. Use “Forgot password?” to set one." : "Email or password is incorrect." });
    if (!a.email_verified_at) {
      const t = await signToken({ sub: a.id, purpose: "verify", ret }, env.SESSION_SECRET, 86400);
      await sendMail(env, brand, email, `Confirm your ${brand.title} account`, "Confirm your email to finish signing in.", `${url.origin}/verify?token=${t}`, "Confirm email");
      return notice(brand, "Confirm your email", `Your email is not confirmed yet. We sent a new link to <b>${esc(email)}</b>.`);
    }
    await env.ACCOUNTS.prepare("UPDATE accounts SET last_login_at = ? WHERE id = ?").bind(Date.now(), a.id).run();
    return redirect(ret, [await startSession(env, a)]);
  }

  if (p === "/logout") {
    if (!post) return page(brand, "Sign out", `<h1>Sign out?</h1><form method="post" action="/logout">${`<input type="hidden" name="return" value="${esc(ret)}">`}<button>Sign out</button></form>`);
    return redirect(safeReturn(f!.get("return"), "/login"), [sessionCookie("", 0)]);
  }

  if (p === "/forgot") {
    if (!post) return forgotPage(brand, ret);
    const email = norm(String(f!.get("email") ?? ""));
    const a = validEmail(email) ? await byEmail(env, email) : null;
    if (a) {
      const t = await signToken({ sub: a.id, purpose: "reset", ph: (a.password_hash ?? "none").slice(-16), ret }, env.SESSION_SECRET, 3600);
      await sendMail(env, brand, email, `Reset your ${brand.title} password`, "Choose a new password for your account. This link works for one hour.", `${url.origin}/reset?token=${t}`, "Choose a new password");
    }
    return forgotPage(brand, ret, { ok: "If that email has an account, a reset link is on its way." });
  }

  if (p === "/reset") {
    const token = String(f?.get("token") ?? url.searchParams.get("token") ?? "");
    const t = await verifyToken<{ sub: string; purpose: string; ph: string; ret?: string }>(token, env.SESSION_SECRET);
    const a = t?.purpose === "reset" ? await byId(env, t.sub) : null;
    if (!t || !a || (a.password_hash ?? "none").slice(-16) !== t.ph) return notice(brand, "Link expired", "This reset link is invalid, expired, or already used.", { href: "/forgot", label: "Send a new link" });
    if (!post) return resetPage(brand, token);
    const password = String(f!.get("password") ?? "");
    if (password.length < 10) return resetPage(brand, token, { err: "Use a password of at least 10 characters." });
    await env.ACCOUNTS.prepare("UPDATE accounts SET password_hash = ?1, email_verified_at = COALESCE(email_verified_at, ?2), updated_at = ?2 WHERE id = ?3").bind(await hashPassword(password), Date.now(), a.id).run();
    return redirect(safeReturn(t.ret), [await startSession(env, a)]);
  }

  if (p === "/account") {
    const s = await currentSession(req, env);
    if (!s) return redirect(`/login?return=${encodeURIComponent("/account")}`);
    const a = await byId(env, s.sub);
    if (!a) return redirect("/logout");
    let m: { err?: string; ok?: string } | undefined;
    if (post) {
      const { values: v, err } = readProfile(f!);
      if (!v.name) m = { err: "Enter your name." };
      else if (err) m = { err };
      else {
        await env.ACCOUNTS.prepare("UPDATE accounts SET name=?1, company=?2, country=?3, address_line1=?4, address_line2=?5, city=?6, region=?7, postal_code=?8, phone=?9, tax_id=?10, updated_at=?11 WHERE id=?12")
          .bind(v.name, v.company || null, v.country, v.address_line1, v.address_line2 || null, v.city, v.region || null, v.postal_code, v.phone || null, v.tax_id || null, Date.now(), a.id).run();
        const np = String(f!.get("new_password") ?? "");
        if (np) {
          if (np.length < 10) m = { err: "New password must be at least 10 characters." };
          else if (!(await checkPassword(String(f!.get("current_password") ?? ""), a.password_hash))) m = { err: "Current password is incorrect." };
          else await env.ACCOUNTS.prepare("UPDATE accounts SET password_hash = ? WHERE id = ?").bind(await hashPassword(np), a.id).run();
        }
        m ??= { ok: "Saved." };
      }
    }
    const cur = { ...(await byId(env, a.id)) } as unknown as Record<string, string>;
    const billing = url.hostname === "app.bitkit.sh" ? `<p class="muted">Plan: <b>${esc(cur.plan ?? "free")}</b>. <a href="/billing/checkout">Upgrade</a>${cur.stripe_customer_id ? ` · <a href="/billing/portal">Billing portal</a>` : ""}</p>` : "";
    return page(brand, "Your account", `<h1>Your account</h1><p class="muted">Signed in as ${esc(cur.email)}.</p>${billing}${msg(m)}
<form method="post" action="/account"><label>Full name<input name="name" value="${esc(cur.name)}" required autocomplete="name"></label>${profileFields(cur)}
<fieldset><legend>Change password <span class="muted">(optional)</span></legend><label>Current password<input name="current_password" type="password" autocomplete="current-password"></label><label>New password<input name="new_password" type="password" minlength="10" autocomplete="new-password"></label></fieldset>
<button>Save</button></form><form method="post" action="/logout"><input type="hidden" name="return" value="/login"><button class="ghost">Sign out</button></form>`, { wide: true });
  }
  return null;
}

// OAuth /authorize: sign in with the account session, then consent (remembered per client).
async function authorize(req: Request, env: Env, url: URL, brand: Brand, server: OAuthAuthorizationServer<Env>): Promise<Response> {
  const oauth = server.getOAuthApi(env);
  try {
    const s = await currentSession(req, env);
    if (!s) return redirect(`/login?return=${encodeURIComponent(url.pathname + url.search)}`);
    const remember = { secret: env.CONSENT_SECRET, subject: s.sub };
    if (req.method === "POST") {
      const f = await req.formData(); const handle = String(f.get("handle"));
      if (f.get("decision") !== "approve") { const d = await oauth.denyConsent(req, handle); return new Response(null, { status: 302, headers: d.headers }); }
      const ok = await oauth.approveConsent(req, handle, { scope: f.getAll("scope").map(String), remember });
      const { redirectTo } = await oauth.completeAuthorization({ request: ok.request, userId: s.sub, metadata: { email: s.email }, scope: ok.request.scope, props: { userId: s.sub, email: s.email, name: s.name } });
      ok.headers.set("Location", redirectTo); return new Response(null, { status: 302, headers: ok.headers });
    }
    const ar = await oauth.parseAuthRequest(req);
    if (await oauth.isConsentRemembered(req, ar, remember)) {
      const { redirectTo } = await oauth.completeAuthorization({ request: ar, userId: s.sub, metadata: { email: s.email }, scope: ar.scope, props: { userId: s.sub, email: s.email, name: s.name } });
      return Response.redirect(redirectTo, 302);
    }
    const d = await oauth.describeConsent(ar);
    const c = await oauth.beginConsent(ar);
    const scopes = d.scope.map((x) => `<label class="check"><input type="checkbox" name="scope" value="${esc(x)}" checked><span>${esc({ "kits:read": "Read your kits", "kits:write": "Change your kits and publish design systems", offline_access: "Stay connected" }[x] ?? x)}</span></label>`).join("");
    const body = `<h1>Allow ${esc(d.clientName)} to use your ${esc(brand.title)} account?</h1>
<p class="muted">${d.clientDomain ? `Published by <b>${esc(d.clientDomain)}</b>.` : "This app registered itself; its name is not verified."} Access goes to <b>${esc(d.redirectHost)}</b>.</p>
${d.redirectIsLoopback ? `<p class="err">This sends access to an app on your computer. Continue only if you just started signing in from it.</p>` : ""}
<p class="muted">Signed in as ${esc(s.email)}. <a href="/logout?return=${encodeURIComponent(url.pathname + url.search)}">Not you?</a></p>
<form method="post"><input type="hidden" name="handle" value="${esc(c.handle)}">${scopes}<div class="row"><button name="decision" value="approve">Allow</button><button class="ghost" name="decision" value="deny">Deny</button></div></form>`;
    const r = page(brand, "Authorize", body);
    c.headers.forEach((v, k) => { if (k.toLowerCase() !== "content-type") r.headers.append(k, v); });
    return r;
  } catch (e) {
    if (e instanceof AuthorizationError && e.redirectTo) return Response.redirect(e.redirectTo, 302);
    if (e instanceof AuthorizationError || e instanceof CimdFetchError)
      return notice(brand, "Could not continue", esc(e instanceof AuthorizationError ? e.description : "This app could not be verified.") + " Start again from the app.");
    throw e;
  }
}

export default class Identity extends WorkerEntrypoint<Env> {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const brand = BRANDS[url.hostname] ?? BRANDS["auth.bitkit.sh"];
    if (url.pathname === "/") return redirect("/account");
    const server = serverFor(url.origin);
    if (server && url.pathname === "/authorize") return authorize(request, this.env, url, brand, server);
    const pageRes = await handlePages(request, this.env, url, brand);
    if (pageRes) return pageRes;
    if (server) return server.fetch(request, this.env, this.ctx);
    return new Response("Not found", { status: 404 });
  }
  /** For resource servers over a Service Binding. */
  validateToken(resource: string, token: string) {
    const server = serverFor(new URL(resource).origin);
    return server ? server.validateToken(resource, token, this.env) : null;
  }
  /** For the platform: read a session cookie value. */
  async session(cookieValue: string) {
    return verifyToken<Session>(cookieValue, this.env.SESSION_SECRET);
  }
}
