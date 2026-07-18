import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node18",
  clean: true,
  dts: false,
  shims: true,
  // commander 作为 dependency 保持外部引用，运行时由 node_modules 解析
});
