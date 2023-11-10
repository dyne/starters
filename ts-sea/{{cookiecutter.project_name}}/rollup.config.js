import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "src/server.ts",
  output: {
    file: "dist/server.cjs",
    format: "cjs",
  },
  plugins: [
    typescript(),
    json(),
    nodeResolve({ preferBuiltins: false }),
    commonjs({ ignoreDynamicRequires: true }),
  ],
};
