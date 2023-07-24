import type { ValueGetter } from ".";
import { getElement } from "#/util/dom";

export function createImageGetter(tabName: ExtensionAvailableTab): ValueGetter<string> {
  const get = () => {
    const element = getElement(`#${tabName}_gallery > div > img`);
    if (element == null || !(element instanceof HTMLImageElement)) return null;
    return element.src.substring(element.src.indexOf("file=") + 5);
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
