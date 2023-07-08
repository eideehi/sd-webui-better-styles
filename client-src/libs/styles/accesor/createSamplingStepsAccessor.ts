import type { ValueAccessor } from ".";
import { createNumberInputAccessor } from "./internal/createNumberInputAccessor";

export function createSamplingStepsAccessor(tabName: StylesAvailableTab): ValueAccessor<number> {
  return createNumberInputAccessor(`#${tabName}_steps input[type='number']`);
}
