# Install `/stack-eval`

**Source of truth (SoT):**  
`dobeutech-designsystem-weaver/.claude/skills/stack-eval/`

Write once in SoT, then sync outward. Do **not** edit copies as primary — edit SoT and re-sync.

## Local install matrix

| Ecosystem | Spot | Path |
|-----------|------|------|
| Claude Code | Project / SoT | `<repo>/.claude/skills/stack-eval/` |
| Cursor | Personal | `%USERPROFILE%\.cursor\skills\stack-eval\` (never `skills-cursor`) |
| Cursor | Project (optional) | `<repo>/.cursor/skills/stack-eval/` |
| Claude Code | User | `%USERPROFILE%\.claude\skills\stack-eval\` |
| Codex CLI | User | `%USERPROFILE%\.codex\skills\stack-eval\` |
| Agents home | User | `%USERPROFILE%\.agents\skills\stack-eval\` |

### Sync order

1. SoT (repo `.claude/skills/stack-eval`)
2. `~/.cursor/skills/stack-eval`
3. `~/.claude/skills/stack-eval`
4. `~/.codex/skills/stack-eval`
5. `~/.agents/skills/stack-eval`
6. Optional: `<repo>/.cursor/skills/stack-eval`
7. Document / perform web & Cowork & ChatGPT uploads (manual)

### Run sync

**Windows (PowerShell):**

```powershell
cd <repo>/.claude/skills/stack-eval/scripts
.\sync-installs.ps1
# optional project mirror:
.\sync-installs.ps1 -IncludeRepoCursor
```

**Unix / Git Bash / WSL:**

```bash
cd <repo>/.claude/skills/stack-eval/scripts
chmod +x sync-installs.sh
./sync-installs.sh
# optional:
./sync-installs.sh --include-repo-cursor
```

Scripts mirror the entire skill folder (SKILL.md, INSTALL.md, references/, scripts/) into each destination.

## Manual upload checklist (cannot fully automate)

### 1) claude.ai (web Skills)

1. Zip the SoT folder `stack-eval` (include `SKILL.md` at zip root of the skill folder).
2. Open [claude.ai](https://claude.ai) → Skills (or Settings → Capabilities / Skills, per current UI).
3. Upload / import the zip.
4. Confirm skill name `stack-eval` and that `disable-model-invocation` is honored (invoke only via `/stack-eval` or explicit ask).
5. Re-upload after every SoT change (or re-zip from a fresh sync).

### 2) Claude Cowork (local / Skills UI)

1. Open Cowork Skills / plugin install UI.
2. Point at the SoT folder **or** install from the same zip used for claude.ai.
3. Prefer syncing SoT → `~/.claude/skills/stack-eval` first so Cowork can pick up the user skill path if supported.
4. Verify `/stack-eval` appears and does not auto-invoke.

### 3) ChatGPT Codex (online) / Codex skill installer

1. Zip SoT `stack-eval` **or** use `$skill-installer` / Codex skill install from the repo path if available in your Codex build.
2. In ChatGPT Codex / online Codex skills UI: upload zip or install from path.
3. Confirm local CLI copy exists at `~/.codex/skills/stack-eval` (from sync script) for CLI use.
4. Re-install after SoT updates.

## Optional Drive backup

Per Codex/agent home conventions, an optional backup mirror may live at:

`G:\My Drive\claude\skills\stack-eval`

- **Not** an automatic sync target in the scripts (Drive paths vary / may be unavailable).
- After a successful local sync, optionally copy the SoT folder there manually for backup only.
- Never treat Drive as SoT — SoT remains the repo `.claude/skills/stack-eval/` path.

## Verify install

```powershell
# SoT
Test-Path <repo>\.claude\skills\stack-eval\SKILL.md
# Personal mirrors
Test-Path $env:USERPROFILE\.cursor\skills\stack-eval\SKILL.md
Test-Path $env:USERPROFILE\.claude\skills\stack-eval\SKILL.md
Test-Path $env:USERPROFILE\.codex\skills\stack-eval\SKILL.md
Test-Path $env:USERPROFILE\.agents\skills\stack-eval\SKILL.md
```

Confirm relative links from `SKILL.md` resolve under `references/` and that hard STOPs + Vercel default + Opsera fallback text are present.
