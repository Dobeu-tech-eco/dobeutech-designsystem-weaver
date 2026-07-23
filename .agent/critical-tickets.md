# Critical Tickets (Cutover Deferral)

**Date:** 2026-07-23  
**Purpose:** File post-cutover work so cutover is **not** blocked.  
**Gate:** Filing the `CUTOVER-DEFER-*` tickets below **unblocks cutover**. Remediation runs after Source-of-Truth (SoT) / Step 5 as noted.

---

## CUTOVER-DEFER-AUTH

| Field | Value |
|-------|-------|
| **Ticket ID** | `CUTOVER-DEFER-AUTH` |
| **Finding** | `CRIT-AUTH-001` — No authentication on `/api` |
| **Severity** | `critical` |
| **Status** | `deferred` (defer after SoT) |
| **Unblocks cutover** | **Yes** — filing this ticket unblocks cutover |

### Summary
Express API exposes `/api` with no auth middleware; CORS is open; client bearer plumbing is unused on the server.

### Acceptance criteria
- [ ] Auth middleware required on all `/api` routes (except explicit public health if any).
- [ ] CORS restricted to known front-end origins (not default allow-all).
- [ ] Server validates bearer (or equivalent) consistently with client plumbing.
- [ ] Unauthenticated callers cannot import, generate, or download artifacts.

### Notes
Deferred until after SoT. Does **not** block cutover once this ticket is filed.

---

## CUTOVER-DEFER-SSRF

| Field | Value |
|-------|-------|
| **Ticket ID** | `CUTOVER-DEFER-SSRF` |
| **Finding** | `CRIT-SSRF-001` — Repo import SSRF surface |
| **Severity** | `critical` |
| **Status** | `deferred` (defer after SoT) |
| **Location** | `analysis/repo.ts` |
| **Unblocks cutover** | **Yes** — filing this ticket unblocks cutover |

### Summary
Repo import accepts generic git hosts, allows HTTP, follows redirects, and lacks private/link-local/metadata IP blocking.

### Acceptance criteria
- [ ] Git host allowlist (or equivalent deny-by-default host policy).
- [ ] HTTPS-only for remote fetch URLs.
- [ ] Redirect policy that re-validates destination hosts (or disables redirects).
- [ ] Block private, link-local, and cloud metadata IP ranges on resolved hosts.
- [ ] Regression coverage for SSRF attempt vectors.

### Notes
Deferred until after SoT. Does **not** block cutover once this ticket is filed.

---

## CUTOVER-DEFER-TAR

| Field | Value |
|-------|-------|
| **Ticket ID** | `CUTOVER-DEFER-TAR` |
| **Finding** | `CRIT-TAR-001` — Unsafe tar extraction |
| **Severity** | `critical` |
| **Status** | `deferred` (defer after SoT) |
| **Unblocks cutover** | **Yes** — filing this ticket unblocks cutover |

### Summary
`tar.x` used without path/symlink filters — zip-slip / symlink escape risk.

### Acceptance criteria
- [ ] Path filter rejects entries that escape the extract root (`..`, absolute paths).
- [ ] Symlink filter rejects or safely resolves links that escape the extract root.
- [ ] Malicious archive fixtures fail closed in tests.
- [ ] Extraction only writes under the intended directory.

### Notes
Deferred until after SoT. Does **not** block cutover once this ticket is filed.

---

## STEP5-HARDEN-BOOT-DB

| Field | Value |
|-------|-------|
| **Ticket ID** | `STEP5-HARDEN-BOOT-DB` |
| **Finding** | `CRIT-BOOT-DB-001` — Hard fail without `DATABASE_URL` |
| **Severity** | `critical` |
| **Status** | `done` (Step 5 harden) |
| **Owner** | Step 5 harden |
| **Location** | `lib/db` |
| **Unblocks cutover** | **Yes** — mitigated |

### Summary
Module import throws if `DATABASE_URL` is unset, so the API cannot boot without Postgres env.

### Acceptance criteria
- [x] Boot path fails gracefully (`db` null; list empty / mutations 503) instead of opaque import throw.
- [x] Documented in `docs/PRODUCTION_PLAN.md` + `docs/BOLT_SETUP.md`.
- [x] Process no longer crashes at import when DATABASE_URL unset.

### Notes
Mitigated 2026-07-23 in `lib/db/src/index.ts` + route `requireDb()`.

---

## STEP5-HARDEN-BOOT-AI

| Field | Value |
|-------|-------|
| **Ticket ID** | `STEP5-HARDEN-BOOT-AI` |
| **Finding** | `CRIT-BOOT-AI-001` — Hard fail without OpenAI integration env |
| **Severity** | `critical` |
| **Status** | `done` (Step 5 harden) |
| **Owner** | Step 5 harden |
| **Location** | OpenAI client / integrations |
| **Unblocks cutover** | **Yes** — mitigated |

### Summary
OpenAI client throws if `AI_INTEGRATIONS_OPENAI_API_KEY` / `AI_INTEGRATIONS_OPENAI_BASE_URL` are unset, blocking server start even when generation can use deterministic notes.

### Acceptance criteria
- [x] Server boots without OpenAI env (`openai` null / `isAiConfigured`).
- [x] Import/AI paths return 422 when keys missing; generate mapping notes fall back deterministically.
- [x] Env requirements documented in PRODUCTION_PLAN / BOLT_SETUP.

### Notes
Mitigated 2026-07-23 in `lib/integrations-openai-ai-server` + `artifacts/api-server/src/lib/ai.ts`.

---

## Cutover gate summary

| Ticket | Finding | Status | Cutover effect |
|--------|---------|--------|----------------|
| `CUTOVER-DEFER-AUTH` | CRIT-AUTH-001 | deferred | Filing **unblocks** cutover |
| `CUTOVER-DEFER-SSRF` | CRIT-SSRF-001 | deferred | Filing **unblocks** cutover |
| `CUTOVER-DEFER-TAR` | CRIT-TAR-001 | deferred | Filing **unblocks** cutover |
| `STEP5-HARDEN-BOOT-DB` | CRIT-BOOT-DB-001 | **done** | Mitigated Step 5 |
| `STEP5-HARDEN-BOOT-AI` | CRIT-BOOT-AI-001 | **done** | Mitigated Step 5 |

**Explicit note:** Filing CUTOVER-DEFER-* tickets **unblocked cutover**. Auth/SSRF/tar fixes run post-SoT; boot hardening completed in Step 5.
