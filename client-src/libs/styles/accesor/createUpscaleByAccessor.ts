import type { ValueAccessor } from ".";
import { createNumberInputAccessor } from "./internal/createNumberInputAccessor";

export function createUpscaleByAccessor(tabName: StylesAvailableTab): ValueAccessor<number> {
  return createNumberInputAccessor(`#${tabName}_hr_scale input[type='number']`);
}
