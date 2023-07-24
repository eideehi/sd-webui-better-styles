import type { ValueAccessor } from ".";
import { createNumberInputAccessor } from "./internal/createNumberInputAccessor";

export function createSeedAccessor(tabName: ExtensionAvailableTab): ValueAccessor<number> {
  return createNumberInputAccessor(`#${tabName}_seed input[type='number']`);
}
