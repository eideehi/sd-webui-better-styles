import type { ValueAccessor } from ".";
import { createDropdownAccessor } from "./internal/createDropdownAccessor";

export function createUpscalerAccessor(tabName: StylesAvailableTab): ValueAccessor<string> {
  return createDropdownAccessor(`#${tabName}_hr_upscaler`);
}
