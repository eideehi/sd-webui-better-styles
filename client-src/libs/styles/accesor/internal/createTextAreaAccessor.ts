import type { ValueAccessor } from "..";
import { getElement } from "#/util/dom";
import { createValueAccessor } from "./createValueAccessor";

export function createTextAreaAccessor(selector: string): ValueAccessor<string> {
  return createValueAccessor<string>({
    get: () => {
      const element = getTextAreaElement(selector);
      return element != null ? element.value : null;
    },
    set: (value) => {
      const element = getTextAreaElement(selector);
      if (element == null) return;

      element.value = value;
      updateInput(element);
    },
  });
}

function getTextAreaElement(selector: string): Nullable<HTMLTextAreaElement> {
  const element = getElement(selector);
  return element != null && element instanceof HTMLTextAreaElement ? element : null;
}
