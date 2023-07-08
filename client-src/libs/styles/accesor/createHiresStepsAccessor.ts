import type { ValueAccessor } from ".";
import { createNumberInputAccessor } from "./internal/createNumberInputAccessor";

export function createHiresStepsAccessor(tabName: StylesAvailableTab): ValueAccessor<number> {
  return createNumberInputAccessor(`#${tabName}_hires_steps input[type='number']`);
}
