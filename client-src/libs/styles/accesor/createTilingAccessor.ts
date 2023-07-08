import type { ValueAccessor } from ".";
import { createCheckboxAccessor } from "./internal/createCheckboxAccessor";

export function createTilingAccessor(tabName: StylesAvailableTab): ValueAccessor<boolean> {
  return createCheckboxAccessor(`#${tabName}_tiling input[type='checkbox']`);
}
