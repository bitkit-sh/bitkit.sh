// One identity backend for every brand: auth.bitkit.sh, auth.appx.sh, auth.cloudx.sh,
// auth.plat.sh, auth.bitbuilder.io. Accounts, signing keys, and sessions are shared;
// each hostname gets its own look. Tokens are JWTs, so services verify them statelessly.
import { issuer } from "@openauthjs/openauth";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { GithubProvider } from "@openauthjs/openauth/provider/github";
import { GoogleProvider } from "@openauthjs/openauth/provider/google";
import { CloudflareStorage, type CloudflareStorageOptions } from "@openauthjs/openauth/storage/cloudflare";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { subjects } from "./subjects.ts";

type Brand = { title: string; primary: string; logo: string };
const mark = (letter: string, color: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="58" fill="${color}"/><text x="60" y="62" text-anchor="middle" dominant-baseline="central" font-family="system-ui,sans-serif" font-weight="700" font-size="58" fill="#fff">${letter}</text></svg>`)}`;
const BRANDS: Record<string, Brand> = {
  "auth.bitkit.sh": { title: "bitkit", primary: "#8e1b2e", logo: mark("b", "#8e1b2e") },
  "auth.appx.sh": { title: "appx", primary: "#3b5bdb", logo: mark("a", "#3b5bdb") },
  "auth.cloudx.sh": { title: "cloudx", primary: "#0b7285", logo: mark("c", "#0b7285") },
  "auth.plat.sh": { title: "plat.sh", primary: "#c00068", logo: mark("p", "#c00068") },
  "auth.bitbuilder.io": { title: "BitBuilder", primary: "#1f2937", logo: mark("B", "#1f2937") },
};
const ZONES = ["bitkit.sh", "appx.sh", "cloudx.sh", "plat.sh", "bitbuilder.io", "coopers.coffee"];
const CLAUDE_CALLBACKS = new Set(["https://claude.ai/api/mcp/auth_callback", "https://claude.com/api/mcp/auth_callback"]);
const SENDER = "login@bitkit.sh";

function redirectAllowed(uri: string): boolean {
  try {
    const u = new URL(uri);
    if (CLAUDE_CALLBACKS.has(`${u.origin}${u.pathname}`)) return true;
    if (u.protocol === "http:" && (u.hostname === "localhost" || u.hostname === "127.0.0.1")) return true;
    return u.protocol === "https:" && ZONES.some((z) => u.hostname === z || u.hostname.endsWith(`.${z}`));
  } catch { return false; }
}

async function accountFor(env: Env, email: string, via: string): Promise<string> {
  const e = email.trim().toLowerCase();
  const row = await env.ACCOUNTS.prepare("INSERT INTO accounts (id, email, created_via, created_at) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(email) DO UPDATE SET last_login_at = ?4 RETURNING id")
    .bind(crypto.randomUUID(), e, via, Date.now()).first<{ id: string }>();
  return row!.id;
}

async function emailFrom(env: Env, accessToken: string, provider: "github" | "google"): Promise<string> {
  if (provider === "google") {
    const r = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { authorization: `Bearer ${accessToken}` } });
    const j = await r.json<{ email?: string; email_verified?: boolean }>();
    if (!j.email || !j.email_verified) throw new Error("Google account has no verified email");
    return j.email;
  }
  const r = await fetch("https://api.github.com/user/emails", { headers: { authorization: `Bearer ${accessToken}`, "user-agent": "bitbuilder-auth", accept: "application/vnd.github+json" } });
  const list = await r.json<{ email: string; primary: boolean; verified: boolean }[]>();
  const e = list.find((x) => x.primary && x.verified) ?? list.find((x) => x.verified);
  if (!e) throw new Error("GitHub account has no verified email");
  return e.email;
}

function app(env: Env, host: string) {
  const brand = BRANDS[host] ?? BRANDS["auth.bitkit.sh"];
  const opt = env as unknown as Record<string, string | undefined>;
  const providers: Record<string, any> = {
    code: CodeProvider(CodeUI({
      sendCode: async (claims, code) => {
        if (!claims.email) throw new Error("email required");
        const link = `https://${host}/code/link?code=${encodeURIComponent(code)}`;
        await env.EMAIL.send({
          to: claims.email,
          from: { email: SENDER, name: brand.title },
          subject: `Your ${brand.title} sign-in code: ${code}`,
          text: `Sign in to ${brand.title}:\n${link}\n\nOr type this code: ${code}\n\nOpen the link in the same browser where you started signing in. It expires soon. If you did not ask for it, ignore this email.`,
          html: `<p><a href="${link}" style="display:inline-block;background:${brand.primary};color:#fff;padding:12px 20px;border-radius:8px;font:600 16px system-ui,sans-serif;text-decoration:none">Sign in to ${brand.title}</a></p><p>Or type this code:</p><p style="font:700 28px/1 ui-monospace,Menlo,monospace;letter-spacing:4px">${code}</p><p style="color:#555">Open the link in the same browser where you started signing in. It expires soon. If you did not ask for it, ignore this email.</p>`,
        });
      },
    })),
  };
  if (opt.GITHUB_CLIENT_ID && opt.GITHUB_CLIENT_SECRET) providers.github = GithubProvider({ clientID: opt.GITHUB_CLIENT_ID, clientSecret: opt.GITHUB_CLIENT_SECRET, scopes: ["user:email"] });
  if (opt.GOOGLE_CLIENT_ID && opt.GOOGLE_CLIENT_SECRET) providers.google = GoogleProvider({ clientID: opt.GOOGLE_CLIENT_ID, clientSecret: opt.GOOGLE_CLIENT_SECRET, scopes: ["openid", "email"] });

  return issuer({
    storage: CloudflareStorage({ namespace: env.AUTH_STORAGE as CloudflareStorageOptions["namespace"] }),
    subjects,
    providers,
    theme: { title: brand.title, primary: brand.primary, favicon: brand.logo, logo: brand.logo, radius: "md" },
    ttl: { access: 60 * 15, refresh: 60 * 60 * 24 * 30 },
    allow: async (input) => redirectAllowed(input.redirectURI),
    success: async (ctx, value) => {
      let email: string;
      if (value.provider === "code") email = (value as any).claims.email;
      else email = await emailFrom(env, (value as any).tokenset.access, value.provider as "github" | "google");
      const id = await accountFor(env, email, value.provider);
      return ctx.subject("user", { id, email: email.trim().toLowerCase() });
    },
  });
}

// Sign-in link from the email: submits the code for the user, in the browser that started sign-in.
function linkPage(request: Request, url: URL): Response {
  const code = (url.searchParams.get("code") ?? "").replace(/[^0-9A-Za-z]/g, "").slice(0, 12);
  const brand = BRANDS[url.hostname] ?? BRANDS["auth.bitkit.sh"];
  const started = /(?:^|;\s*)provider=/.test(request.headers.get("cookie") ?? "");
  const head = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Sign in to ${brand.title}</title><style>body{font:16px/1.5 system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0}main{max-width:380px;padding:24px;text-align:center}code{font:700 24px ui-monospace,Menlo,monospace;letter-spacing:3px}button{background:${brand.primary};color:#fff;border:0;border-radius:8px;padding:12px 20px;font:600 16px system-ui}</style><main><img src="${brand.logo}" width="40" height="40" alt="">`;
  const body = started && code
    ? `<p>Signing you in…</p><form id="f" method="post" action="/code/authorize"><input type="hidden" name="action" value="verify"><input type="hidden" name="code" value="${code}"><noscript><button>Continue</button></noscript></form><script>document.getElementById("f").submit()</script>`
    : `<p>Open this link in the browser where you started signing in, or type this code there:</p><p><code>${code || "?"}</code></p>`;
  return new Response(head + body + "</main>", { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "referrer-policy": "no-referrer" } });
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);
    const origin = url.origin;
    if (url.pathname === "/code/link" && request.method === "GET") return linkPage(request, url);
    // MCP clients (Claude) look for a registration endpoint. OpenAuth accepts any client id and
    // checks redirect URIs in allow(), so registration simply echoes the client back.
    if (url.pathname === "/register" && request.method === "POST") {
      const body = await request.json<{ redirect_uris?: string[]; client_name?: string }>().catch(() => ({}) as any);
      const uris = (body.redirect_uris ?? []).filter(redirectAllowed);
      if (!uris.length) return Response.json({ error: "invalid_redirect_uri" }, { status: 400 });
      return Response.json({ client_id: `dcr_${crypto.randomUUID()}`, client_name: body.client_name, redirect_uris: uris, token_endpoint_auth_method: "none", grant_types: ["authorization_code", "refresh_token"], response_types: ["code"] }, { status: 201 });
    }
    const res = await app(env, url.hostname).fetch(request, env, ctx);
    if (url.pathname === "/.well-known/oauth-authorization-server" && res.ok) {
      const meta = await res.json<Record<string, unknown>>();
      return Response.json({ ...meta, registration_endpoint: `${origin}/register`, client_id_metadata_document_supported: true, code_challenge_methods_supported: ["S256"], token_endpoint_auth_methods_supported: ["none"] }, { headers: { "access-control-allow-origin": "*", "cache-control": "public, max-age=300" } });
    }
    return res;
  },
} satisfies ExportedHandler<Env>;
