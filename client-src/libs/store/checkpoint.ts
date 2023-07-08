import { readable } from "svelte/store";
import { getElement } from "@/libs/util/dom";

export const checkpoint = readable("", (set) => {
  let currentHash = "";
  let timeout = window.setTimeout(function update() {
    const hash = getElement("#sd_checkpoint_hash")?.title || "";
    if (hash !== currentHash) {
      set((currentHash = hash));
    }
    timeout = window.setTimeout(update, 125);
  }, 10);
  return () => window.clearTimeout(timeout);
});
