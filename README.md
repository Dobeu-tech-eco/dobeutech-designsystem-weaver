# dobeutech-designsystem-weaver — Design System Weaver

Production: Vercel `dobeutech-designsystem-weaver-api-server` (+ design-forge frontend) · Status: active

## What it does

pnpm workspace powering the Dobeu design-system tooling: **design-forge** (Vite/React design UI), **mockup-sandbox** (Vite mockup previewer), and **api-server** (Express API with Drizzle/Supabase, OpenAI integration, and archive/export tooling). Shared libraries live under `lib/` and `lib/integrations/`.

## Stack

pnpm workspace (`minimumReleaseAge` supply-chain guard — do not disable) · Vite 7 + React 19 · Express + pino + Drizzle ORM · Supabase · esbuild bundling (`artifacts/api-server/build.mjs`).

## Getting started

```bash
pnpm install
pnpm run typecheck            # builds lib tsconfig references + package typechecks
pnpm --filter @workspace/design-forge dev     # frontend
PORT=3001 pnpm --filter @workspace/api-server dev  # API (standalone)
```

## Workspace map

| Package | Path | Deploys as |
|---|---|---|
| @workspace/design-forge | artifacts/design-forge | Vercel static (root vercel.json, framework vite) |
| @workspace/api-server | artifacts/api-server | Vercel functions (`api/index.ts` wrapper) or any Node host (`pnpm start`) |
| @workspace/mockup-sandbox | artifacts/mockup-sandbox | dev tool |
| lib/*, lib/integrations/* | lib/ | shared libraries |

## Deployment

- **api-server on Vercel:** project Root Directory must be `artifacts/api-server`; the local `vercel.json` there skips the standalone bundle and exposes the Express app via `api/index.ts`. Fixes the 2026-07-23 `No Output Directory named "public"` production failure.
- If the API outgrows serverless (long archives, streaming), move it to a container host and point the frontend at it — the standalone entry is kept for exactly that.

## Analytics

Amplitude rubric verdict: **SKIP** (API/infra tooling) per `../_standards/amplitude-instrumentation-policy.md`.

## Documentation

`docs/` (existing design notes), `AGENTS.md`, `CLAUDE.md`. OPERATIONS/ARCHITECTURE docs: TODO per `_standards/repo-docs-standard.md`.
