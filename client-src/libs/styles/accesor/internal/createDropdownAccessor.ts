import type { ValueAccessor } from "..";
import { tick } from "svelte";
import { getElement } from "#/util/dom";
import { createValueAccessor } from "./createValueAccessor";

let dropdownSetValueQueue: Promise<void> = Promise.resolve();

export function createDropdownAccessor(baseSelector: string): ValueAccessor<string> {
  return createValueAccessor<string>({
    get: () => {
      let data = getElement(`${baseSelector} input`); // for older gradio
      if (data instanceof HTMLInputElement) return data.value;
      data = getElement(`${baseSelector} [data-testid="block-info"]`);
      return data?.textContent;
    },
    set: (value) => {
      const setValue = async () => {
        const input = getElement(`${baseSelector} input`);
        if (!(input instanceof HTMLInputElement)) return;

        //TODO: Hides the dropdown from being displayed momentarily by using css.
        input.dispatchEvent(new Event("focus"));
        await tick();

        const options = getElement(`${baseSelector} ul > li[data-value="${value}"]`);
        if (options == null) return;
        options.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      };

      dropdownSetValueQueue = (async () => {
        await dropdownSetValueQueue;
        return setValue();
      })();
      return true;
    },
  });
}
