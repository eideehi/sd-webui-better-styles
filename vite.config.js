import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: resolve(__dirname, "dist"),
    lib: {
      entry: resolve(__dirname, "client-src/index.ts"),
      name: "BetterStyles",
      formats: ["iife"],
      fileName: () => "betterStyles.js",
    },
    watch: {
      include: resolve(__dirname, "client-src"),
    },
  },
});
