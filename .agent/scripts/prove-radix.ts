/**
 * In-process Radix generation smoke (Step 6).
 * Run from repo root via Git Bash:
 *   pnpm --filter @workspace/api-server exec tsx ../../.agent/scripts/prove-radix.ts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { getDesignSystem } from "../../artifacts/api-server/src/lib/design-systems.ts";
import { generateForSystem } from "../../artifacts/api-server/src/lib/generators/index.ts";
import { resolveProfile } from "../../artifacts/api-server/src/lib/profile-schema.ts";
import type { DesignProfileJson } from "../../lib/db/src/schema/projects.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../radix-consumer");

const sampleProfile: DesignProfileJson = {
  colors: {
    primary: "#3e63dd",
    background: "#ffffff",
    text: "#111827",
    secondary: "#5b5bd6",
    accent: "#3e63dd",
    surface: "#f8f9fa",
    muted: "#6b7280",
    border: "#e5e7eb",
    success: "#15803d",
    warning: "#b45309",
    danger: "#b91c1c",
    palette: [{ name: "Brand", hex: "#3e63dd", role: "brand" }],
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
    monoFont: "ui-monospace",
    baseSizePx: 16,
    scaleRatio: 1.25,
    headingWeight: 600,
    bodyWeight: 400,
  },
  spacing: { basePx: 4, density: "comfortable" },
  radius: { basePx: 8, style: "rounded" },
  shadows: { style: "subtle" },
  tone: { summary: "Clean product UI for Radix proof", descriptors: ["clear", "modern", "focused"] },
};

const system = getDesignSystem("radix");
if (!system) {
  console.error("FAIL: catalog missing id=radix");
  process.exit(1);
}

const resolved = resolveProfile(sampleProfile);
const pkg = generateForSystem(system, resolved, "radix-e2e-sample");

const theme = pkg.files.find((f) => f.path.endsWith("theme.tsx"));
const accent = pkg.files.find((f) => f.path.endsWith("accent-scale.css"));
if (!theme || !accent) {
  console.error("FAIL: missing theme.tsx or accent-scale.css");
  console.error(
    "files:",
    pkg.files.map((f) => f.path),
  );
  process.exit(1);
}

fs.mkdirSync(path.join(outDir, "src"), { recursive: true });
fs.writeFileSync(path.join(outDir, "src", "theme.tsx"), theme.content, "utf8");
fs.writeFileSync(path.join(outDir, "src", "accent-scale.css"), accent.content, "utf8");

const report = {
  ok: true,
  systemId: system.id,
  fileCount: pkg.files.length,
  emitted: [theme.path, accent.path],
  consumerFiles: ["src/theme.tsx", "src/accent-scale.css"],
  notesPreview: pkg.deterministicNotes.slice(0, 200),
};

fs.writeFileSync(path.join(outDir, "generation-result.json"), JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify(report, null, 2));
