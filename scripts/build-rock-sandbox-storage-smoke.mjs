import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { rollup } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

if (process.argv.length !== 3)
  throw Error("Usage: node scripts/build-rock-sandbox-storage-smoke.mjs <output.mjs>; build rock-mod first");
const bundle = await rollup({
  input: fileURLToPath(new URL("./fixtures/rock-sandbox-storage-smoke.mjs", import.meta.url)),
  plugins: [nodeResolve(), commonjs()],
});
try {
  await bundle.write({ file: resolve(process.argv[2]), format: "es", inlineDynamicImports: true });
} finally {
  await bundle.close();
}
