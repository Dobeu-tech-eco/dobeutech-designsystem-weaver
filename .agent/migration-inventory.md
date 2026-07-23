# Migration Inventory — Maker → Weaver SoT

**Date:** 2026-07-23  
**Weaver:** `C:\Users\JeremyWilliams\repos\dobeutech-designsystem-weaver`  
**Maker:** `C:\Users\JeremyWilliams\repos\design-ui-weaver\2026-7-20-Web-App-Maker\Web-App-Maker`

## Decision map

| Path / asset | Decision | Rationale |
|--------------|----------|-----------|
| `docs/BOLT_PRODUCTION_PROMPT.md` | **port** | Maker-unique; copied to Weaver `docs/` |
| `docs/BOLT_SETUP.md` | **skip** | Weaver already has equivalent content |
| `docs/PRODUCTION_PLAN.md` | **skip** (update in place) | Weaver SoT; add Radix-first SoT note (Step 7) |
| `vercel.json` | **skip** | Keep Weaver's; do not overwrite |
| `supabase/**` | **skip** | Keep Weaver's migrations |
| `AGENTS.md` / Cloud notes | **skip** | Weaver ahead |
| `artifacts/**`, `lib/**` generators | **skip** | Same product twin; Weaver is contract SoT (`openapi.yaml`) |
| Maker root README | **archive** | Freeze note + redirect to Weaver |
| Parent `2026-7-20-Web-App-Maker/README.md` | **archive** | Freeze redirect |
| Maker `.bolt`, `.replit`, configs | **archive** | Historical only |

## Ported this session

- `docs/BOLT_PRODUCTION_PROMPT.md` → Weaver `docs/BOLT_PRODUCTION_PROMPT.md`

## Explicitly not ported

- Weaver `vercel.json`, `supabase/`, `AGENTS.md` left untouched
- No dual-write of application code into Maker after freeze
