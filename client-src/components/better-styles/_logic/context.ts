import type { Writable } from "svelte/store";
import type { Style } from "#/styles";

export type GroupedStyle = { group: string; style: Style };

export type BetterStylesContext = {
  tabName: ExtensionAvailableTab;
  active: Writable<boolean>;
  styleSearchKeyword: Writable<string>;
  activeGroup: Writable<string>;
  selectedStyles: Writable<GroupedStyle[]>;
  editData: Writable<Nullable<GroupedStyle>>;
};

export const betterStylesContextKey = Symbol();
