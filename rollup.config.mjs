import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/client/index.ts",
  output: {
    file: "dist/client.js",
    format: "iife", // Immediately-invoked function expression
    name: "RockMod", // Global variable name for your module
  },
  plugins: [
    typescript({
      tsconfig: "src/client/tsconfig.json",
    }),
    nodeResolve({
      browser: true, // Указываем, что собираем для браузерного окружения
    }),
    commonjs(),
    terser(), // Минификация кода
  ],
};
