import type { ValueAccessor } from ".";
import { createTextAreaAccessor } from "./internal/createTextAreaAccessor";

export function createNegativePromptAccessor(
  tabName: ExtensionAvailableTab
): ValueAccessor<string> {
  return createTextAreaAccessor(`#${tabName}_neg_prompt textarea`);
}
