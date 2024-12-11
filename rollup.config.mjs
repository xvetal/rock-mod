import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/client/index.ts",
  output: {
    dir: "dist/client",
    format: "es",
    name: "RockMod",
    entryFileNames: "[name].js",
    chunkFileNames: "[name]-[hash].js",
  },
  plugins: [
    typescript({
      tsconfig: "src/client/tsconfig.json",
    }),
    nodeResolve({
      browser: true,
    }),
    commonjs(),
    terser(),
  ],
};
