import type { ValueAccessor } from "./accessor";
import { createCheckboxAccessor } from "./internal/createCheckboxAccessor";

export function createRestoreFacesAccessor(tabName: StylesAvailableTab): ValueAccessor<boolean> {
  return createCheckboxAccessor(`#${tabName}_restore_faces input[type='checkbox']`);
}
