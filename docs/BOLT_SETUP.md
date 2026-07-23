# bolt.new / StackBlitz — interim hosting

Interim host for the **design-forge** UI on bolt.new (WebContainers), ahead of the Vercel target in `PRODUCTION_PLAN.md`. Uses expiring bolt credits.

## Import

Open: `https://bolt.new/~/github.com/Dobeu-tech-eco/dobeutech-designsystem-weaver`
(or import the repo from bolt.new's GitHub picker). bolt reads `.stackblitzrc` and `.bolt/prompt` from the repo root.

## What boots

`.stackblitzrc` installs with pnpm and starts `@workspace/design-forge` on `PORT=3000`, `BASE_PATH=/`. You should get a live preview of the SPA.

## Known constraints (WebContainers)

1. **No raw TCP** → the api-server's `pg` Postgres driver will not connect in-container. The API path is therefore not functional on bolt out of the box.
2. **pnpm only** — the root `preinstall` hook rejects npm/yarn. bolt should pick pnpm from `pnpm-lock.yaml`; if it falls back to npm, the install fails until the pnpm gate is relaxed on a bolt branch.
3. **Stripped native binaries** — `pnpm-workspace.yaml` `overrides` remove non-linux esbuild/rollup/lightningcss binaries (linux-x64 deploy target). Watch for vite/esbuild friction in-container.

## Status (SoT harden — 2026-07-23)

- **Graceful DB:** `DATABASE_URL` optional at boot — list routes return empty; mutations return 503.
- **Vite `/api` proxy:** present in `artifacts/design-forge/vite.config.ts` → `http://localhost:5000`.
- **AI optional:** missing `AI_INTEGRATIONS_OPENAI_*` no longer crashes boot; mapping notes degrade; import analysis returns 422.

## To make the full app run on bolt (follow-up)

1. Swap `lib/db` from `pg` to `@neondatabase/serverless` (HTTP/WS driver) and set `DATABASE_URL` to a Neon connection string. (Typed dual-driver blocked by pnpm peer split — use a dedicated neon entry or `DB_DRIVER=neon-http` once isolated.)
2. Run api-server in-container (proxy already wired) and set `DATABASE_URL` to Neon.
3. Set `AI_INTEGRATIONS_OPENAI_*` (optional — AI is commentary-only and degrades gracefully).

## Relationship to production

bolt is the interim demo. The durable target is Vercel (`PRODUCTION_PLAN.md`, Phase 3). The Neon HTTP-driver swap done for bolt also benefits the Vercel serverless deploy, so it is not throwaway work.
