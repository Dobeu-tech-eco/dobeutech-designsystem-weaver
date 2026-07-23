# Architecture Risk Register — Dual-Repo (Weaver SoT + Web-App-Maker)

**Date:** 2026-07-22  
**Scope:** Step 2 — architecture analyze (Opsera + local SPOF/failure-mode register)  
**Weaver:** `C:\Users\JeremyWilliams\repos\dobeutech-designsystem-weaver`  
**Maker:** `C:\Users\JeremyWilliams\repos\design-ui-weaver\2026-7-20-Web-App-Maker\Web-App-Maker`

## Opsera status

| Item | Result |
|------|--------|
| MCP server | `plugin-opsera-devsecops-opsera` |
| Initial status | `needsAuth` |
| `mcp_auth` | Invoked once → rejected (`MCP auth already handled`) |
| Post-auth status | `error` — failed during live tool discovery; tools unavailable until connection is fixed |
| `architecture-analyze` | **Not run** — tool never surfaced (only `mcp_auth` listed) |
| `report-telemetry` | **Not run** — blocked by same discovery failure |
| Auth loop | Stopped after one attempt (per Step 2 instructions) |

**Blocked-with-auth-note:** Opsera architecture-analyze and telemetry are unavailable this session. Local dual-repo risk register below is the acceptance artifact.

## Critical

### C1 — No authentication or authorization on API routes
- Severity: Critical | Owner: security-reviewer / api-server | Repos: Both
- Evidence: Weaver `artifacts/api-server/src/app.ts`, `artifacts/api-server/src/routes/index.ts`; routes in `projects.ts`, `generations.ts`, `stats.ts`. Maker same `artifacts/api-server/src/app.ts`.
- Impact: Unauthenticated import/generate/download/delete of all projects.
- Mitigation: Auth gateway before public deploy.

### C2 — SSRF / arbitrary host fetch via repo import
- Severity: Critical | Owner: security-reviewer / analysis | Repos: Both
- Evidence: `artifacts/api-server/src/lib/analysis/repo.ts` — non-GH/GL/BB hosts become `provider: "git"`; `fetch` with `redirect: "follow"`; `git clone` fallback. Entry `POST /projects/import/repo` in `routes/projects.ts`.
- Impact: SSRF to internal/metadata hosts; no host allowlist (size/timeout caps only).
- Mitigation: Host allowlist; block private ranges; cap redirects.

### C3 — Eager DATABASE_URL throw = boot SPOF
- Severity: Critical | Owner: database-reviewer / lib-db (Step 5) | Repos: Both
- Evidence: `lib/db/src/index.ts` throws if DATABASE_URL unset; eager `pg.Pool`. Maker `docs/BOLT_PRODUCTION_PROMPT.md` gaps #1-2.
- Mitigation: Optional DATABASE_URL + 503 degrade (Step 5).

### C4 — Eager AI env throw = boot SPOF
- Severity: Critical | Owner: api-server / integrations (Step 5) | Repos: Both
- Evidence: `lib/integrations-openai-ai-server/src/client.ts` (also image/audio clients) throws if AI_INTEGRATIONS_OPENAI_* unset.
- Mitigation: Lazy client; degrade mapping notes (Step 5).

## Warning

### W1 — Express vs Vercel serverless
- Weaver `artifacts/api-server/src/index.ts` app.listen; TCP pg; `vercel.json` SPA rewrite without Express function adapter. Maker: no vercel.json.

### W2 — .fig base64 vs Vercel body limits
- Both: `app.ts` express.json 60mb; `projects.ts` MAX_FIG_BYTES 30MB base64. Vercel ~4.5MB body limit.

### W3 — Open CORS
- Both `app.ts` app.use(cors()) default reflect-all + C1.

### W4 — Maker missing Vite /api proxy
- Maker `artifacts/design-forge/vite.config.ts` no proxy; Weaver has proxy to localhost:5000.

### W5 — Repo import DoS
- repo.ts 100MB/6000 files/180s clone; no rate limit; combines with C1.

## Info
- I1 Twin architecture migration blast radius
- I2 Partial SSRF mitigations (timeouts/size caps) insufficient alone
- I3 /healthz unauthenticated expected
- I4 Ruflo memory_store unavailable this session (MCP not in catalog)

## Dual-repo comparison
Unauth API, SSRF, DB/AI eager throws, Express listen, 60mb json: both Yes. vercel.json: Weaver only (incomplete). Vite /api proxy: Weaver yes, Maker missing. BOLT docs: Maker stronger.

## Acceptance
Opsera blocked documented; Critical/Warning/Info register filed; Ruflo memory blocked.
