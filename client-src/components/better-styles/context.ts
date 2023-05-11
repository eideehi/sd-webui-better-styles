import type { Writable } from "svelte/store";

export type BetterStylesContext = {
  tabName: StylesAvailableTab;
  activeBetterStyles: Writable<boolean>;
  activeGroup: Writable<string>;
  styleSearchKeyword: Writable<string>;
  selectedStyles: Writable<Style[]>;
};

export const betterStylesContextKey = Symbol();
