# Architecture Risk Register (dual-repo)

**Date:** 2026-07-23  
**Opsera:** Blocked — `plugin-opsera-devsecops-opsera` auth failed (`User not registered`). Local register only; telemetry not reported.  
**Related:** [PR #3](https://github.com/Dobeu-tech-eco/dobeutech-designsystem-weaver/pull/3) (risk-register branch), [PR #4](https://github.com/Dobeu-tech-eco/dobeutech-designsystem-weaver/pull/4) (Step 3 findings).

## Critical

| ID | Risk | Paths | Owner / ticket |
|----|------|-------|----------------|
| CRIT-AUTH-001 | No auth middleware on `/api`; open CORS | `artifacts/api-server/src/app.ts`, routes | CUTOVER-DEFER-AUTH |
| CRIT-SSRF-001 | Repo import SSRF (generic host, HTTP, redirects, no private-IP block) | `artifacts/api-server/src/lib/analysis/repo.ts` | CUTOVER-DEFER-SSRF |
| CRIT-TAR-001 | Unsafe tar extract (zip-slip) | `artifacts/api-server/src/lib/analysis/repo.ts` | CUTOVER-DEFER-TAR |
| CRIT-BOOT-DB-001 | Eager throw without `DATABASE_URL` | `lib/db/src/index.ts` | **Mitigated Step 5** |
| CRIT-BOOT-AI-001 | Eager throw without AI env | `lib/integrations-openai-ai-server/src/client.ts` | **Mitigated Step 5** |

## Warning

| ID | Risk | Paths |
|----|------|-------|
| WARN-FIG-BODY | `.fig` base64 JSON vs Vercel body limits (~4.5MB) | `artifacts/api-server/src/app.ts` (`express.json` 60mb) |
| WARN-NO-TESTS | No test runner / CI; only typecheck+build | repo root `package.json` |
| WARN-REPLIT-BIN | Non-linux natives pruned via overrides | `pnpm-workspace.yaml` |

## Info

| ID | Note | Paths |
|----|------|-------|
| INFO-PROXY | design-forge Vite `/api` → localhost:5000 already present | `artifacts/design-forge/vite.config.ts` |
| INFO-CONTRACT | OpenAPI → Orval is SoT; never hand-edit `**/generated/**` | `lib/api-spec/openapi.yaml` |
| INFO-CATALOG | 10 systems registered; Radix is locked E2E proof target | `design-systems.ts`, `generators/index.ts` |

## Cutover gate

AUTH / SSRF / TAR are **ticketed** (see `.agent/critical-tickets.md`) — cutover **unblocked**. BOOT-DB / BOOT-AI remediated in Step 5.
