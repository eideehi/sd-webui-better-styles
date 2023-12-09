import type { ValueAccessor } from ".";
import { createAccordionAccessor } from "./internal/createAccordionAccessor";

export function createHiresFixAccessor(tabName: ExtensionAvailableTab): ValueAccessor<boolean> {
  return createAccordionAccessor(`#${tabName}_hr`);
}
