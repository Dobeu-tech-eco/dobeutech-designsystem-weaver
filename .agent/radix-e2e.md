# Radix E2E Proof (Step 6)

**Date:** 2026-07-23  
**Catalog id:** `radix` (Radix Themes)  
**Method:** In-process generator (API/DB not required)

## Command

```bash
# from Weaver root (Git Bash / environment with sh)
./scripts/node_modules/.bin/tsx .agent/scripts/prove-radix.ts

# consumer
cd .agent/radix-consumer
pnpm install --ignore-workspace
pnpm run typecheck
```

## Results

| Check | Status |
|-------|--------|
| `getDesignSystem("radix")` | ok |
| `generateForSystem` emits files | ok — 4 files (theme, accent-scale, tokens.json, README) |
| `design-system/radix/theme.tsx` | emitted → `.agent/radix-consumer/src/theme.tsx` |
| `design-system/radix/accent-scale.css` | emitted → `.agent/radix-consumer/src/accent-scale.css` |
| Consumer `pnpm run typecheck` | **green** (`--ignore-workspace`) |
| AI mapping notes | N/A for in-process path; production path already degrades |

## Sample mapping

- Primary `#3e63dd` → nearest accent `"blue"` with CSS scale override
- Radius `rounded` → `radius="medium"`
- Density `comfortable` → `scaling="100%"`

## Artifact

`.agent/radix-consumer/generation-result.json`
