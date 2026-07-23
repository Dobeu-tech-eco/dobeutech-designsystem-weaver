# Dual-Repo Review Findings (Step 3)

**Date:** 2026-07-23  
**Repos:** `dobeutech-designsystem-weaver` (Weaver) ↔ `design-ui-weaver/2026-7-20-Web-App-Maker` (Maker)  
**Cutover status:** Blocked until deferral tickets filed — see [`critical-tickets.md`](./critical-tickets.md). Tickets below **unblock** cutover (work deferred post-SoT / Step 5).

**Persistence:** Files landed via [PR #4](https://github.com/Dobeu-tech-eco/dobeutech-designsystem-weaver/pull/4); local checkout of `agent/step3-dual-repo-findings`.

## Critical

### CRIT-AUTH-001 — No authentication on `/api`
**Severity:** `critical`  
**Ticket:** CUTOVER-DEFER-AUTH (defer after SoT)

- Express `app.ts` + route handlers expose `/api` with **no auth middleware**.
- `cors()` is open (default allow-all).
- Client bearer token plumbing exists but is **unused** on the server.
- Impact: any caller who can reach the API can import projects, generate packages, and download artifacts.

### CRIT-SSRF-001 — Repo import SSRF surface
**Severity:** `critical`  
**Ticket:** CUTOVER-DEFER-SSRF (defer after SoT)  
**Location:** analysis/repo.ts

- Accepts a **generic git host** (not allowlisted).
- **HTTP** URLs allowed (not HTTPS-only).
- Redirect following enabled.
- **No private-IP / link-local / metadata-IP block** on resolved hosts.
- Impact: server-side request forgery against internal networks during repo import.

### CRIT-TAR-001 — Unsafe tar extraction
**Severity:** `critical`  
**Ticket:** CUTOVER-DEFER-TAR (defer after SoT)

- `tar.x` used **without path / symlink filters**.
- Risk of path traversal and symlink escape during archive extract (zip-slip class).
- Impact: write outside intended extract directory if a malicious archive is processed.

### CRIT-BOOT-DB-001 — Hard fail without `DATABASE_URL`
**Severity:** `critical`  
**Owner:** Step 5 harden (in progress)  
**Location:** `lib/db`

- Module import throws if `DATABASE_URL` is unset.
- API cannot boot without Postgres env configured.

### CRIT-BOOT-AI-001 — Hard fail without OpenAI integration env
**Severity:** `critical`  
**Owner:** Step 5 harden (in progress)  
**Location:** OpenAI client / integrations

- OpenAI client throws if `AI_INTEGRATIONS_OPENAI_API_KEY` / `AI_INTEGRATIONS_OPENAI_BASE_URL` are unset.
- Server won't start even though generation can fall back to deterministic notes.

## Warnings

| ID | Severity | Finding |
|----|----------|---------|
| WARN-CORS-DOS | `warning` | Open CORS + `express.json({ limit: "60mb" })` enables large-body DoS / abuse from any origin. |
| WARN-500-LEAK | `warning` | HTTP 500 responses leak `Error.message` to clients (information disclosure). |
| WARN-OPENAPI-PROFILE | `warning` | OpenAPI `DesignProfile` is weaker than server `profile-schema` (contract drift / under-validation at edge). |
| WARN-DS-ID-ENUM | `warning` | `designSystemId` is not constrained to the catalog enum in the API contract. |
| WARN-PROFILE-MIRROR | `warning` | `DesignProfileJson` is triple-mirrored (DB hand type ↔ api-zod ↔ profile-schema) — sync hazard. |
| WARN-MAKER-PROXY | `warning` | Maker SPA missing Vite `/api` proxy (dev cannot hit Weaver API without extra config). |
| WARN-VERCEL-REWRITE | `warning` | `vercel.json` `/api` rewrite is effectively a no-op for the intended backend routing. |

## Coupling

| Area | Detail |
|------|--------|
| Catalog ↔ builders | `DESIGN_SYSTEMS` ids ↔ `BUILDERS` are **10/10** aligned, including `radix`. |
| Cutover gate | Cutover was **YES blocked** until critical deferral tickets filed. Filing `CUTOVER-DEFER-*` **unblocks** cutover; fixes run post-SoT (auth/SSRF/tar) or in Step 5 (boot). |
