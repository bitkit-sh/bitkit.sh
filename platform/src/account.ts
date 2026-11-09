// Accounts on app.bitkit.sh: OpenAuth sign-in (shared identity backend), stateless cookies,
// and Stripe billing. Tokens are verified locally against the issuer's JWKS.
import { createClient } from "@openauthjs/openauth/client";
import { subjects } from "./subjects.ts";

export const ISSUER = "https://auth.bitkit.sh";
const CLIENT_ID = "app.bitkit.sh";
const client = createClient({ clientID: CLIENT_ID, issuer: ISSUER });
export type User = { id: string; email: string };

const cookie = (name: string, value: string, maxAge: number) => `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
const read = (req: Request, name: string) => req.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1];
const safeReturn = (p: string | null) => (p && p.startsWith("/") && !p.startsWith("//") ? p : "/");

/** Verify a bearer or cookie session. Returns the user and any refreshed cookies to set. */
export async function sessionUser(req: Request): Promise<{ user: User | null; setCookies: string[] }> {
  const bearer = req.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  const access = bearer ?? read(req, "bk_at");
  const refresh = bearer ? undefined : read(req, "bk_rt");
  if (!access && !refresh) return { user: null, setCookies: [] };
  const v = await client.verify(subjects, access ?? "", refresh ? { refresh } : undefined).catch(() => null);
  if (!v || v.err) return { user: null, setCookies: [] };
  const setCookies = v.tokens ? [cookie("bk_at", v.tokens.access, 60 * 15), cookie("bk_rt", v.tokens.refresh, 60 * 60 * 24 * 30)] : [];
  return { user: v.subject.properties as User, setCookies };
}

export async function authRoutes(req: Request, url: URL): Promise<Response | null> {
  const redirect = `${url.origin}/auth/callback`;
  if (url.pathname === "/auth/login") {
    const { challenge, url: to } = await client.authorize(redirect, "code", { pkce: true });
    const state = btoa(JSON.stringify({ v: challenge.verifier, s: challenge.state, r: safeReturn(url.searchParams.get("return")) }));
    return new Response(null, { status: 302, headers: { location: to, "set-cookie": cookie("bk_pkce", state, 600) } });
  }
  if (url.pathname === "/auth/callback") {
    const raw = read(req, "bk_pkce"); const code = url.searchParams.get("code");
    if (!raw || !code) return new Response("Sign-in expired. Start again.", { status: 400 });
    const st = JSON.parse(atob(raw)) as { v: string; s: string; r: string };
    if (url.searchParams.get("state") !== st.s) return new Response("Sign-in state mismatch.", { status: 400 });
    const ex = await client.exchange(code, redirect, st.v);
    if (ex.err) return new Response("Sign-in failed.", { status: 400 });
    const h = new Headers({ location: st.r });
    h.append("set-cookie", cookie("bk_at", ex.tokens.access, 60 * 15));
    h.append("set-cookie", cookie("bk_rt", ex.tokens.refresh, 60 * 60 * 24 * 30));
    h.append("set-cookie", cookie("bk_pkce", "", 0));
    return new Response(null, { status: 302, headers: h });
  }
  if (url.pathname === "/auth/me") {
    const { user, setCookies } = await sessionUser(req);
    const h = new Headers({ "cache-control": "no-store" }); for (const c of setCookies) h.append("set-cookie", c);
    return Response.json(user ? { user } : { user: null }, { status: user ? 200 : 401, headers: h });
  }
  if (url.pathname === "/auth/logout" && req.method === "POST") {
    const h = new Headers(); h.append("set-cookie", cookie("bk_at", "", 0)); h.append("set-cookie", cookie("bk_rt", "", 0));
    return new Response(null, { status: 204, headers: h });
  }
  return null;
}

// ---------- Stripe (REST, no SDK). Off until STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_PRO are set. ----------
type Billing = { STRIPE_SECRET_KEY?: string; STRIPE_WEBHOOK_SECRET?: string; STRIPE_PRICE_PRO?: string };
const stripe = async (env: Billing, path: string, form: Record<string, string>) => {
  const r = await fetch(`https://api.stripe.com/v1/${path}`, { method: "POST", headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(form) });
  const j = await r.json<any>(); if (!r.ok) throw new Error(j.error?.message ?? `Stripe ${r.status}`); return j;
};
const hmac = async (secret: string, data: string) => { const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return [...new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(data)))].map((b) => b.toString(16).padStart(2, "0")).join(""); };

export async function billingRoutes(req: Request, url: URL, env: Env): Promise<Response | null> {
  if (!url.pathname.startsWith("/billing/")) return null;
  const b = env as unknown as Billing;
  if (!b.STRIPE_SECRET_KEY) return Response.json({ error: "Billing is not set up yet." }, { status: 503 });
  if (url.pathname === "/billing/webhook" && req.method === "POST") {
    const body = await req.text(); const sig = req.headers.get("stripe-signature") ?? "";
    const t = sig.match(/t=(\d+)/)?.[1]; const v1 = [...sig.matchAll(/v1=([0-9a-f]+)/g)].map((m) => m[1]);
    if (!t || !b.STRIPE_WEBHOOK_SECRET || Math.abs(Date.now() / 1000 - Number(t)) > 300 || !v1.includes(await hmac(b.STRIPE_WEBHOOK_SECRET, `${t}.${body}`))) return new Response("bad signature", { status: 400 });
    const evt = JSON.parse(body); const o = evt.data?.object ?? {};
    if (evt.type === "checkout.session.completed" && o.client_reference_id) {
      await env.ACCOUNTS.prepare("UPDATE accounts SET stripe_customer_id = ?1 WHERE id = ?2").bind(o.customer, o.client_reference_id).run();
    }
    if (/^customer\.subscription\.(created|updated|deleted)$/.test(evt.type)) {
      const active = ["active", "trialing"].includes(o.status) && evt.type !== "customer.subscription.deleted";
      await env.ACCOUNTS.prepare("UPDATE accounts SET plan = ?1, plan_status = ?2, plan_renews_at = ?3 WHERE stripe_customer_id = ?4")
        .bind(active ? "pro" : "free", o.status, o.current_period_end ? o.current_period_end * 1000 : null, o.customer).run();
    }
    return new Response("ok");
  }
  const { user } = await sessionUser(req);
  if (!user) return new Response(null, { status: 302, headers: { location: `/auth/login?return=${encodeURIComponent(url.pathname)}` } });
  const acct = await env.ACCOUNTS.prepare("SELECT stripe_customer_id FROM accounts WHERE id = ?").bind(user.id).first<{ stripe_customer_id: string | null }>();
  if (url.pathname === "/billing/checkout") {
    const s = await stripe(b, "checkout/sessions", { mode: "subscription", "line_items[0][price]": b.STRIPE_PRICE_PRO!, "line_items[0][quantity]": "1", client_reference_id: user.id,
      ...(acct?.stripe_customer_id ? { customer: acct.stripe_customer_id } : { customer_email: user.email }), success_url: `${url.origin}/?billing=success`, cancel_url: `${url.origin}/?billing=cancel` });
    return Response.redirect(s.url, 303);
  }
  if (url.pathname === "/billing/portal" && acct?.stripe_customer_id) {
    const s = await stripe(b, "billing_portal/sessions", { customer: acct.stripe_customer_id, return_url: `${url.origin}/` });
    return Response.redirect(s.url, 303);
  }
  return Response.json({ error: "No billing account yet." }, { status: 404 });
}
