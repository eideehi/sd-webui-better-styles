import type { Writable } from "svelte/store";

export type LayoutMode = "card" | "compact";

export type StyleViewContext = {
  layoutMode: Writable<LayoutMode>;
};

export const styleViewContextKey = Symbol();
