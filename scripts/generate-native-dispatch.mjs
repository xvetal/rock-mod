#!/usr/bin/env node
/*
 * Codegen: hash → VIMP-typed-native dispatch table.
 *
 * Reads alloc8or-format `scripts/data/natives.json` (VIMP's vendored nativedb),
 * cross-references each (namespace, hash, name) with the VIMP-typed namespace
 * methods in `@vimp-mp/types/natives/index.d.ts`, and emits a TypeScript
 * const Map: hash → { ns, methods[] }.
 *
 * The `methods[]` array contains all candidate camelCase names for the hash
 * (the canonical `name` + any historical `old_names` from nativedb). The
 * runtime dispatcher tries each candidate in order — necessary because VIMP's
 * generated types sometimes use the new official name and sometimes the legacy
 * alias depending on when the binding was generated.
 *
 * Output: `src/client/game/vimp/native/_generated/nativeDispatch.ts`. Commit
 * the generated file. Re-run when nativedb updates:
 *   `node scripts/generate-native-dispatch.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const NATIVES_JSON = path.join(REPO_ROOT, "scripts", "data", "natives.json");
const OUT_TS = path.join(REPO_ROOT, "src", "client", "game", "vimp", "native", "_generated", "nativeDispatch.ts");

/**
 * SCREAMING_SNAKE_CASE → camelCase.
 * Strips leading `_` (unofficial natives prefix in nativedb).
 */
function snakeToCamel(snake) {
  return snake
    .replace(/^_+/, "")
    .toLowerCase()
    .replace(/_(.)/g, (_, c) => c.toUpperCase());
}

function main() {
  if (!fs.existsSync(NATIVES_JSON)) {
    console.error(`[generate-native-dispatch] not found: ${NATIVES_JSON}`);
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(NATIVES_JSON, "utf8"));

  const entries = [];
  let totalNatives = 0;
  let skippedNoName = 0;

  for (const [nsUpper, natives] of Object.entries(db)) {
    const ns = nsUpper.toLowerCase();
    for (const [hash, info] of Object.entries(natives)) {
      totalNatives += 1;
      const name = info?.name;
      if (typeof name !== "string" || name.length === 0) {
        skippedNoName += 1;
        continue;
      }
      const candidates = new Set();
      candidates.add(snakeToCamel(name));
      const oldNames = Array.isArray(info.old_names) ? info.old_names : [];
      for (const old of oldNames) {
        if (typeof old === "string" && old.length > 0) {
          candidates.add(snakeToCamel(old));
        }
      }
      entries.push({
        hash: hash.toLowerCase(),
        ns,
        candidates: [...candidates],
      });
    }
  }

  // Sort entries by hash for stable diffs.
  entries.sort((a, b) => (a.hash < b.hash ? -1 : a.hash > b.hash ? 1 : 0));

  // Emit TS.
  const header = `// AUTO-GENERATED — do not edit. Regenerate via:
//   node scripts/generate-native-dispatch.mjs
//
// Source: scripts/data/natives.json (alloc8or-format VIMP nativedb).
// Generated entries: ${entries.length} / ${totalNatives} natives.
// Cross-referenced against vimp.natives.<namespace>.<camelMethod> typed surface
// in @vimp-mp/types. The runtime dispatcher (VIMPNativeCallerManager)
// resolves each hash to (namespace, method) and tries every method candidate
// in order — first match wins. Candidates include the canonical \`name\` plus
// any \`old_names\` from nativedb (VIMP-generated types may use either depending
// on binding-generation timing).

export interface NativeDispatchEntry {
  readonly ns: string;
  readonly methods: readonly string[];
}

export const NATIVE_DISPATCH: Readonly<Record<string, NativeDispatchEntry>> = Object.freeze({
`;

  const body = entries
    .map((e) => {
      const methodsArr = e.candidates.map((c) => JSON.stringify(c)).join(", ");
      return `  ${JSON.stringify(e.hash)}: { ns: ${JSON.stringify(e.ns)}, methods: [${methodsArr}] },`;
    })
    .join("\n");

  const footer = `
});
`;

  const outDir = path.dirname(OUT_TS);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUT_TS, header + body + footer);

  console.log(
    `[generate-native-dispatch] emitted ${entries.length} entries (skipped ${skippedNoName} no-name) → ${path.relative(REPO_ROOT, OUT_TS)}`,
  );
}

main();
