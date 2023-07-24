import { resolve } from "path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import icons from "unplugin-icons/vite";

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
  plugins: [svelte(), icons({ compiler: "svelte", defaultClass: "icon" })],
  resolve: {
    alias: {
      "@/": `${resolve(__dirname, "client-src", "components", "better-styles")}/`,
      "%/": `${resolve(__dirname, "client-src", "components", "widgets")}/`,
      "#/": `${resolve(__dirname, "client-src", "libs")}/`,
      "~/": `${resolve(__dirname, "client-src", "data")}/`,
    },
  },
});
