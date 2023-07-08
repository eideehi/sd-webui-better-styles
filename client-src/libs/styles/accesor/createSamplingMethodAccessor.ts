import type { ValueAccessor } from ".";
import { createDropdownAccessor } from "./internal/createDropdownAccessor";

export function createSamplingMethodAccessor(tabName: StylesAvailableTab): ValueAccessor<string> {
  return createDropdownAccessor(`#${tabName}_sampling`);
}
