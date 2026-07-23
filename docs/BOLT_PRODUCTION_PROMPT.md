# Design System Weaver — bolt.new Production-Readiness Prompt

Research + code review + a copy‑paste prompt to advance the repo one reversible, Vercel‑bound step.

**Ported to Weaver SoT (2026-07-23)** from the frozen Maker twin
`design-ui-weaver / 2026-7-20-Web-App-Maker / Web-App-Maker`. Apply against
`Dobeu-tech-eco/dobeutech-designsystem-weaver` only.

---

## 1. bolt.new prompting best practices (research)

Distilled from Bolt's own guidance and community sources (see Sources):

1. **Start with a foundation, not the finished product.** Establish architecture and one anchor first, then build outward. Don't ask for the whole app in one shot.
2. **Work incrementally, one change at a time.** Smaller moves are easier for the model to execute correctly and far easier to roll back — which matters here because the target is Vercel and the work must stay revertible.
3. **Use discussion mode before generating code.** Let Bolt restate the plan and confirm scope before spending tokens; catch misunderstandings early.
4. **Use precise design/engineering vocabulary,** not vague descriptors ("serverless HTTP driver", "graceful degradation", "Vite `server.proxy`" — not "make the API work").
5. **Be explicit about what must NOT change.** Lock generated directories, config files, and guardrails; reference exact files, functions, and classes.
6. **Guide focus with targeting tools** — lock files/directories, highlight code, use the Inspector — so edits stay contained.
7. **Set persistent Project/System knowledge** for repo‑wide rules (pnpm‑only, don't disable the supply‑chain guard, don't hand‑edit generated code). This repo already ships a `.bolt/prompt` that Bolt reads on import.
8. **Watch context limits.** Chat windows are finite; request a summary and duplicate the project to reset context while preserving key facts. Reduce scope if replies come back incomplete.

**Consequence for this repo:** the right prompt is *not* "make it production ready." It is a single, tightly‑scoped, phased milestone with explicit stop‑and‑verify points and hard "do not touch" guardrails.

---

## 2. Code review — where the repo stands

**What it is.** "Design System Weaver": import a design source (markdown brief, Figma `.fig`, HTML URL, or git repo) → extract a normalized **DesignProfile** → deterministically generate theme/token packages for a catalog of design systems. OpenAI is commentary‑only.

**Stack & shape.** pnpm‑workspace monorepo. Deployable apps in `artifacts/*`, shared libs in `lib/*`.

- `artifacts/design-forge` — primary SPA (React 19 / Vite 7 / Tailwind v4 / Radix + shadcn / wouter / TanStack Query). This is what Bolt boots. Pages: `Home`, `ProjectWorkspace`, `History`.
- `artifacts/mockup-sandbox` — secondary preview SPA.
- `artifacts/api-server` — Express 5, esbuild → `dist/index.mjs`, pino logging, `express.json({ limit: "60mb" })` for base64 `.fig` uploads.
- `lib/api-spec/openapi.yaml` → Orval → `lib/api-zod` (route validators) + `lib/api-client-react` (TanStack Query hooks). **Generated; never hand‑edit.**
- `lib/db` — Drizzle + **`pg` (node‑postgres, raw TCP)**; `db`/`pool` created eagerly and **throw at import if `DATABASE_URL` is unset**.
- `lib/integrations-openai-ai-server` — thin OpenAI wrapper.

**Strengths.** Clean contract‑first architecture (single OpenAPI source of truth), typed end‑to‑end, real security posture (`minimumReleaseAge: 1440` supply‑chain guard), a serious `PRODUCTION_PLAN.md` already mapping the Vercel path, and `setBaseUrl()` already present in the client for remote‑API wiring.

**Gaps toward production (highest‑leverage first):**

| # | Gap | Why it blocks production / Vercel |
|---|-----|-----------------------------------|
| 1 | `lib/db` uses the `pg` TCP driver | Cannot connect in WebContainers **or** Vercel serverless. One fix (Neon HTTP driver) unblocks both — the single highest‑value change. |
| 2 | `lib/db` throws at import when `DATABASE_URL` is unset | Any boot without a DB hard‑crashes; no graceful degradation. |
| 3 | design-forge `vite.config.ts` has **no `/api` proxy** | SPA can't reach the API same‑origin in preview. |
| 4 | No Vercel adapter | Express app is bundled for a Replit autoscale target, not a Vercel function. |
| 5 | No test runner, no linter, no CI | `typecheck` + `build` are the only quality gates. |
| 6 | SSRF surface in `analysis/repo.ts` (+ planned HTML‑URL analyzer) | Untrusted URL/repo fetches need allowlist/timeout/size guards before public exposure. |
| 7 | `.fig` uploads (base64, 60 MB) vs Vercel body limits | May force presigned direct‑to‑storage upload later. |
| 8 | Replit coupling (`.replit`, `@replit/*` Vite plugins, linux‑x64 binary overrides) | Fine to keep, but Vercel config must coexist, not replace. |

**Bolt/WebContainer reality check.** Bolt runs on StackBlitz WebContainers: no raw TCP (so `pg` is dead there), pnpm‑only `preinstall` gate, and pruned non‑linux‑x64 esbuild/rollup/lightningcss binaries. So the smartest next step Bolt can actually execute *and* that pays off on Vercel is the **Neon serverless‑driver swap + graceful env degradation**, exactly as `docs/BOLT_SETUP.md` and `PRODUCTION_PLAN.md` (Phase 3) already anticipate: "not throwaway work."

**Revert safety.** Everything below is additive. It keeps `.replit`, `.stackblitzrc`, the pnpm gates, and the generated contract intact, works phase‑by‑phase with a commit per phase, and never disables the supply‑chain guard — so you can always pull back to the Vercel path.

---

## 3. The prompt — paste this into bolt.new

> Import the repo first (`https://bolt.new/~/github.com/<owner>/<repo>` or Bolt's GitHub picker). Bolt reads `.bolt/prompt` + `.stackblitzrc` on import. Then paste the block below. For maximum revert safety, duplicate the project (or work on a branch) in Bolt before starting.

```text
Milestone: make `design-forge` run end-to-end in this preview AND become Vercel-deploy-ready — WITHOUT breaking the Replit path. This is the "Design System Weaver" pnpm-workspace monorepo; read CLAUDE.md, docs/PRODUCTION_PLAN.md, and docs/BOLT_SETUP.md first. The skeleton already exists — do NOT rebuild it. Do exactly one reversible milestone, in phases, stopping after each.

FIRST, DON'T CODE YET:
Restate this plan in your own words, list the exact files you intend to touch in each phase, and flag anything you'd do differently. Then implement Phase 1 ONLY and stop for my review. Proceed to later phases only when I say "go".

HARD GUARDRAILS (do not violate):
- pnpm ONLY. Never run npm or yarn — the root `preinstall` hook rejects them.
- Do NOT disable or lower `minimumReleaseAge` in pnpm-workspace.yaml, and do NOT delete the esbuild/rollup/lightningcss/`overrides` blocks.
- Do NOT hand-edit anything under `**/generated/**`. The API contract's single source of truth is lib/api-spec/openapi.yaml; if the contract must change, edit that file and run `pnpm --filter @workspace/api-spec run codegen`.
- Do NOT delete or rewrite .replit, .stackblitzrc, replit.md, or the @replit/* Vite plugins. This repo must stay runnable on Replit AND deployable to Vercel at the same time. Every change must be ADDITIVE and reversible.
- Keep changes small; commit after each phase with a clear message so any phase can be reverted independently.
- The only quality gates are `pnpm run typecheck` and `pnpm run build`. Both must stay green. There is no test runner — do not invent one this milestone.

PHASE 1 — Boot design-forge cleanly with NO backend.
- design-forge is the SPA Bolt boots (.stackblitzrc, PORT=3000, BASE_PATH=/). Confirm it renders with no white screen when the /api backend is unavailable.
- In the TanStack Query data paths on Home, ProjectWorkspace, and History, add proper loading, empty, and error states so an absent/failing API shows a friendly message instead of crashing. Do NOT fabricate data.
- Only consume the generated client in lib/api-client-react; do not modify it.
- Stop; let me verify the preview.

PHASE 2 — Swap the DB driver to serverless HTTP (unblocks BOTH bolt and Vercel).
- lib/db/src/index.ts uses `pg` (node-postgres, raw TCP), which cannot connect in WebContainers or Vercel serverless. Replace it with @neondatabase/serverless via drizzle-orm/neon-http, keeping the SAME exported `db` and schema surface so nothing downstream changes.
- Make DATABASE_URL OPTIONAL: today lib/db throws at import when it's missing. Instead, when unset, export a guarded `db` (null/no-op) and have the api-server routes degrade gracefully (empty lists / 503 with a clear message) instead of hard-crashing at boot.
- Leave the Drizzle schema and drizzle.config.ts unchanged.
- Stop; verify `pnpm run typecheck` and `pnpm run build`.

PHASE 3 — Make the API reachable from the SPA in-preview.
- Add a dev `/api` proxy to artifacts/design-forge/vite.config.ts (Vite `server.proxy`) pointing /api at the api-server port; alternatively wire the client via the existing `setBaseUrl()` in lib/api-client-react from a `VITE_API_BASE_URL` env var. Prefer the proxy for same-origin behavior.
- Make OPENAI_API_KEY OPTIONAL — AI is commentary-only and must degrade gracefully when absent (see artifacts/api-server/src/lib/ai.ts and lib/integrations-openai-ai-server).
- Stop; verify.

PHASE 4 — Add Vercel deploy config (additive; coexists with Replit).
- Add a root vercel.json for the pnpm monorepo: build artifacts/design-forge (Vite → dist/public) as the static front end, and expose artifacts/api-server as a serverless Node function under /api. Do NOT remove the esbuild bundle path Replit uses.
- Document required env vars in a new docs/VERCEL.md: DATABASE_URL (Neon), OPENAI_API_KEY (optional). Note the .fig upload size vs Vercel body-limit risk — document it, do not solve it now.
- Stop; verify.

ACCEPTANCE CRITERIA (report back explicitly):
- Preview boots design-forge with no white screen and graceful states when API/DB/AI are absent.
- `pnpm run typecheck` and `pnpm run build` are both green.
- No file under `**/generated/**` was hand-edited; .replit, .stackblitzrc, and the pnpm/supply-chain guards are intact.
- A root vercel.json exists and the same codebase still targets Replit.
- List every file you changed and why, plus the commit list, so I can revert any phase independently.

IF YOU GET STUCK on WebContainer native-binary friction (esbuild/rollup/lightningcss/@tailwindcss/oxide — the repo prunes non-linux-x64 binaries in pnpm-workspace.yaml `overrides`): report the exact error and STOP. Do NOT disable the supply-chain guard or delete the overrides to work around it.
```

---

## 4. Follow-up prompt ladder (after the milestone lands)

Paste these one at a time, in later Bolt turns, each as its own small scope:

1. **Ingestion completeness (P0):** "Confirm all four import adapters exist (markdown, figma, HTML‑URL, git). Implement the HTML‑URL analyzer if missing, and extend `analysis/repo.ts` to GitLab/Bitbucket/generic `.git`. Add SSRF guards: host allowlist, redirect cap, timeout, and response‑size limit on every untrusted fetch. One adapter at a time; stop after each."
2. **Catalog + generators (P0):** "Register all 10 catalog design systems in `design-systems.ts` and implement/verify a generator per system in `generators/`. Add a validation step that generated packages typecheck. One system at a time."
3. **Hardening (P1):** "Add a smoke test for each of the four import paths and a GitHub Actions workflow running `pnpm run typecheck && pnpm run build` on PR. Do not change app behavior."
4. **`.fig` upload path (P1):** "Evaluate the 60 MB base64 `.fig` upload against Vercel body limits; propose a presigned direct‑to‑storage upload design before implementing."

---

## Sources

- [Prompting like a pro: 8 tips to get the best out of Bolt — Bolt blog](https://bolt.new/blog/prompting-tips-for-bolt)
- [Prompting Effectively: How to talk to Bolt — Bolt support docs](https://support.bolt.new/docs/prompting-effectively)
- [How To Prompt Bolt — bolters.io community](https://bolters.io/docs/how-to-prompt.html)
- Repo files reviewed: `CLAUDE.md`, `docs/PRODUCTION_PLAN.md`, `docs/BOLT_SETUP.md`, `.bolt/prompt`, `.stackblitzrc`, `.replit`, `pnpm-workspace.yaml`, `lib/db/src/index.ts`, `lib/api-client-react/src/custom-fetch.ts`, `artifacts/design-forge/vite.config.ts`, `artifacts/api-server/src/{app,index}.ts`, `lib/api-spec/openapi.yaml`.
