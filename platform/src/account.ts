// Accounts on app.bitkit.sh. The identity Worker (bitbuilder-auth) owns sign-up, sign-in, and the
// 30-day session cookie; this module verifies that cookie locally (HS256, shared SESSION_SECRET),
// so no request needs a session lookup. Stripe billing uses the account's billing profile.
import { verifyToken } from "./crypto.ts";

export type User = { id: string; email: string; name: string };
const read = (req: Request, name: string) => req.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1];
const safeReturn = (p: string | null) => (p && p.startsWith("/") && !p.startsWith("//") ? p : "/");

export async function sessionUser(req: Request, env: Env): Promise<{ user: User | null; setCookies: string[] }> {
  const s = await verifyToken<{ sub: string; email: string; name: string }>(read(req, "bk_session"), env.SESSION_SECRET);
  return { user: s ? { id: s.sub, email: s.email, name: s.name } : null, setCookies: [] };
}

export async function authRoutes(req: Request, url: URL, env: Env): Promise<Response | null> {
  if (url.pathname === "/auth/login") return Response.redirect(`${url.origin}/login?return=${encodeURIComponent(safeReturn(url.searchParams.get("return")))}`, 302);
  if (url.pathname === "/auth/me") {
    const { user } = await sessionUser(req, env);
    return Response.json({ user }, { status: user ? 200 : 401, headers: { "cache-control": "no-store" } });
  }
  if (url.pathname === "/auth/logout" && req.method === "POST")
    return new Response(null, { status: 204, headers: { "set-cookie": "bk_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0" } });
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
    if (/^customer\.subscription\.(created|updated|deleted)$/.test(evt.type)) {
      const active = ["active", "trialing"].includes(o.status) && evt.type !== "customer.subscription.deleted";
      await env.ACCOUNTS.prepare("UPDATE accounts SET plan = ?1, plan_status = ?2, plan_renews_at = ?3 WHERE stripe_customer_id = ?4")
        .bind(active ? "pro" : "free", o.status, o.current_period_end ? o.current_period_end * 1000 : null, o.customer).run();
    }
    return new Response("ok");
  }
  const { user } = await sessionUser(req, env);
  if (!user) return Response.redirect(`${url.origin}/login?return=${encodeURIComponent(url.pathname)}`, 302);
  const a = await env.ACCOUNTS.prepare("SELECT * FROM accounts WHERE id = ?").bind(user.id).first<Record<string, string | null>>();
  if (!a) return Response.redirect(`${url.origin}/login`, 302);
  let customer = a.stripe_customer_id;
  if (!customer) {
    const c = await stripe(b, "customers", { email: a.email!, name: a.name ?? "", ...(a.phone ? { phone: a.phone } : {}), "metadata[account_id]": user.id,
      "address[line1]": a.address_line1 ?? "", "address[line2]": a.address_line2 ?? "", "address[city]": a.city ?? "", "address[state]": a.region ?? "", "address[postal_code]": a.postal_code ?? "", "address[country]": a.country ?? "" });
    customer = c.id;
    await env.ACCOUNTS.prepare("UPDATE accounts SET stripe_customer_id = ? WHERE id = ?").bind(customer, user.id).run();
  }
  if (url.pathname === "/billing/checkout") {
    const s = await stripe(b, "checkout/sessions", { mode: "subscription", customer: customer!, "line_items[0][price]": b.STRIPE_PRICE_PRO!, "line_items[0][quantity]": "1", client_reference_id: user.id,
      "automatic_tax[enabled]": "true", "customer_update[address]": "auto", success_url: `${url.origin}/account?billing=success`, cancel_url: `${url.origin}/account` });
    return Response.redirect(s.url, 303);
  }
  if (url.pathname === "/billing/portal") {
    const s = await stripe(b, "billing_portal/sessions", { customer: customer!, return_url: `${url.origin}/account` });
    return Response.redirect(s.url, 303);
  }
  return Response.json({ error: "Not found" }, { status: 404 });
}
