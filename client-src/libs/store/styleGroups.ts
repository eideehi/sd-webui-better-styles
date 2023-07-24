import type { StyleGroup } from "#/styles";
import { writable } from "svelte/store";

export const styleGroups = writable([] as StyleGroup[]);
