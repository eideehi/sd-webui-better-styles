import type { ValueAccessor } from ".";
import { createCheckboxAccessor } from "./internal/createCheckboxAccessor";

export function createHiresFixAccessor(tabName: StylesAvailableTab): ValueAccessor<boolean> {
  return createCheckboxAccessor(`#${tabName}_enable_hr input[type='checkbox']`);
}
