# bitkit on Cloudflare for Platforms

bitkit selected the **Owner’s account** hosting model.

| Model | Who owns the Cloudflare account | How code gets there |
| --- | --- | --- |
| Hand off | The brand owner | Temporary account, claimed by the owner within 60 minutes |
| bitkit platform | bitkit (platform account) | `cf deploy --dispatch-namespace bitkit-tenants` into a Workers for Platforms namespace |
| Owner’s account | The brand owner | Owner connects their account (Cloudflare OAuth client), then CI deploys |

## Pieces

- `src/index.ts` routes `<slug>.bitkit.sh` (and mapped custom hostnames) to tenant Workers through the `TENANTS` dispatch namespace binding.
- `LOADER` (Dynamic Workers) runs generated snippets in fresh isolates with `globalOutbound: null`.
- `ProvisionTenant` is a Workflow: creates KV, D1, and R2 per tenant in the platform account, registers the tenant, waits for the tenant deploy, then activates it.
- `scripts/bootstrap.sh` creates the namespace and registry once.

## Boundaries

The platform provisions Cloudflare resources and deploys code. It never registers domains, creates social accounts, or accepts terms for an owner. Domain search (`scripts/find-domain.sh`) is read-only; the owner registers the domain they choose.
