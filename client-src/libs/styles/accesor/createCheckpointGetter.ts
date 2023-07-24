import type { ValueGetter } from ".";
import { getElement } from "#/util/dom";

export function createCheckpointGetter(): ValueGetter<string> {
  const get = () => {
    const element = getElement("#sd_checkpoint_hash");
    if (element == null || !(element instanceof HTMLAnchorElement)) return null;
    return element.title;
  };
  return {
    get,
    getOrDefault: (defaultValue) => {
      const value = get();
      return value != null ? value : defaultValue;
    },
    with: (callback) => {
      const value = get();
      if (value == null) return;
      callback(value);
    },
  };
}
