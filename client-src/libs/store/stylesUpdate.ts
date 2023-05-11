import { writable } from "svelte/store";

export const stylesUpdate = writable(new Date().getTime());
