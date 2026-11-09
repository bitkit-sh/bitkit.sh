// Shared identity backend. Requires Node.js 22.18+ for the cf CLI.
import { bindings, defineConfig, triggers } from "cf/config";
import * as entrypoint from "./src/index.ts" with { type: "cf-worker" };

export default defineConfig({
  worker: {
    name: "bitbuilder-auth",
    compatibilityDate: "2026-11-08",
    compatibilityFlags: ["nodejs_compat"],
    entrypoint,
    domains: ["auth.bitkit.sh", "auth.appx.sh", "auth.cloudx.sh", "auth.plat.sh", "auth.bitbuilder.io"],
    // bitkit.sh has a *.bitkit.sh/* route to the tenant platform, so auth.bitkit.sh also needs a more specific route.
    triggers: [triggers.fetch({ pattern: "auth.bitkit.sh/*", zone: "bitkit.sh" })],
    observability: { enabled: true, logs: { enabled: true } },
    env: {
      AUTH_STORAGE: bindings.kv(),
      ACCOUNTS: bindings.d1({ name: "bitbuilder-accounts" }),
      EMAIL: bindings.sendEmail(),
    },
  },
});
