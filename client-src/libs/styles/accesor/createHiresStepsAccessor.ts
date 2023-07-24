import type { ValueAccessor } from ".";
import { createNumberInputAccessor } from "./internal/createNumberInputAccessor";

export function createHiresStepsAccessor(tabName: ExtensionAvailableTab): ValueAccessor<number> {
  return createNumberInputAccessor(`#${tabName}_hires_steps input[type='number']`);
}
