import { readable } from "svelte/store";
import { getElement } from "@/libs/util/dom";

export const checkpoint = readable("", (set) => {
  let element = getElement("#sd_checkpoint_hash");
  const _getElement = () => {
    if (element == null) {
      element = getElement("#sd_checkpoint_hash");
    }
    return element;
  };

  let current = "";
  const checkUpdate = () => {
    const hash = _getElement()?.title;
    if (hash === current) return;
    set((current = hash) || "");
  };

  checkUpdate();
  const interval = window.setInterval(checkUpdate, 250);
  return () => {
    window.clearInterval(interval);
  };
});
