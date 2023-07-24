import type { ValueAccessor } from "..";
import { getElement } from "#/util/dom";
import { createValueAccessor } from "./createValueAccessor";

export function createNumberInputAccessor(selector: string): ValueAccessor<number> {
  return createValueAccessor<number>({
    get: () => {
      const element = getInputElement(selector);
      return element != null ? element.valueAsNumber : null;
    },
    set: (value) => {
      const element = getInputElement(selector);
      if (element == null) return;

      element.valueAsNumber = value;
      updateInput(element);
    },
  });
}

function getInputElement(selector: string): Nullable<HTMLInputElement> {
  const element = getElement(selector);
  return element != null && element instanceof HTMLInputElement ? element : null;
}
