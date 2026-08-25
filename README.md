# Whop integration sandbox

This repository is an intentionally small Next.js app for observing Whop app
embedding, identity, and access behavior. Phase 1 contains no campaigns,
submissions, database, webhooks, or payments.

## Local setup

1. Copy `.env.example` to `.env.local` and add the App ID and App API key from
   the same Whop environment.
2. In the Whop developer dashboard, set the production Base URL to the deployed
   origin. Whop proxies that origin through the app-specific iframe domain.
3. In Hosting, set the Experience View path to
   `/experiences/[experienceId]` and Dashboard View path to
   `/dashboard/[companyId]`.
4. Install the app into the test Whop company and approve the permissions needed
   to retrieve experiences and check user access.
5. Run `pnpm dev`, open the app through Whop, and select the localhost environment
   from Whop's developer controls.

The `dev` script wraps Next.js with Whop's documented development proxy so local
requests receive the same iframe user token header used in production.

Production and published Whop signing keys are verified through Whop's JWKS.
Whop's localhost launcher currently sends `isDev` tokens with a key ID absent
from both documented Whop JWKS endpoints. In development on a localhost host
only, the sandbox therefore validates the token's algorithm, issuer, audience,
subject, and lifetime before allowing the normal API-backed access check. This
fallback is disabled in production and is reported as `development_claims` in
the context viewer.

This sandbox pins `@whop/sdk` to `0.0.42`, the last release in the app-SDK line.
That release verifies iframe user tokens through Whop's rotating JWKS endpoint.
Do not upgrade it based only on npm's `latest` tag: the current 1.x package is a
different generated-client line and does not expose the documented
`verifyUserToken` app helper.

## Checks

```bash
pnpm typecheck
pnpm build
```

Open `/docs` for the short list of unresolved concerns requiring a team decision.
