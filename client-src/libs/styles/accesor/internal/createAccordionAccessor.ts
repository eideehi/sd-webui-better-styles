import type { ValueAccessor } from "..";
import { tick } from "svelte";
import { getElement } from "#/util/dom";
import { createValueAccessor } from "./createValueAccessor";

export function createAccordionAccessor(baseSelector: string): ValueAccessor<boolean> {
  const getValue = () => {
    const block = getElement(`${baseSelector} .label-wrap + [style*=display]`);
    return block?.style.display !== "none";
  };

  return createValueAccessor<boolean>({
    get: getValue,
    set: (value) => {
      void (async () => {
        const label = getElement(`${baseSelector} .label-wrap`);
        if (label == null) return;

        if (getValue() === value) return;
        label.dispatchEvent(new MouseEvent("click"));
        await tick();
      })();
      return true;
    },
  });
}
