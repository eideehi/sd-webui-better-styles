import type { ValueAccessor } from ".";
import { createNumberInputAccessor } from "./internal/createNumberInputAccessor";

export function createCfgScaleAccessor(tabName: ExtensionAvailableTab): ValueAccessor<number> {
  return createNumberInputAccessor(`#${tabName}_cfg_scale input[type='number']`);
}
