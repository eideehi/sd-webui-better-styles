import { resolve } from "path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  build: {
    outDir: resolve(__dirname, "dist"),
    lib: {
      entry: resolve(__dirname, "client-src/main.ts"),
      name: "BetterStyles",
      formats: ["iife"],
      fileName: () => "betterStyles.js",
    },
  },
  plugins: [svelte()],
  resolve: {
    alias: {
      "@/": `${resolve(__dirname, "client-src")}/`,
      "#/": `${resolve(__dirname, "client-src", "components")}/`,
    },
  },
});
