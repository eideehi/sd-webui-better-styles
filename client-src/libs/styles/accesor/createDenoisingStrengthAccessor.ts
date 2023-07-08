import type { ValueAccessor } from ".";
import { createNumberInputAccessor } from "./internal/createNumberInputAccessor";

export function createDenoisingStrengthAccessor(
  tabName: StylesAvailableTab
): ValueAccessor<number> {
  return createNumberInputAccessor(`#${tabName}_denoising_strength input[type='number']`);
}
