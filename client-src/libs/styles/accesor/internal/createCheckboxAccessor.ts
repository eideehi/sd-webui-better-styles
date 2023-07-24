import type { ValueAccessor } from "..";
import { getElement } from "#/util/dom";
import { createValueAccessor } from "./createValueAccessor";

export function createCheckboxAccessor(selector: string): ValueAccessor<boolean> {
  return createValueAccessor<boolean>({
    get: () => {
      const element = getInputElement(selector);
      return element != null ? element.checked : null;
    },
    set: (value) => {
      const element = getInputElement(selector);
      if (element == null) return;

      if (element.checked === value) return;
      element.click();
    },
  });
}

function getInputElement(selector: string): Nullable<HTMLInputElement> {
  const element = getElement(selector);
  return element != null && element instanceof HTMLInputElement ? element : null;
}
