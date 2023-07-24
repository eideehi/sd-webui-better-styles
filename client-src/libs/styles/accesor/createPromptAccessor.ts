import type { ValueAccessor } from ".";
import { createTextAreaAccessor } from "./internal/createTextAreaAccessor";

export function createPromptAccessor(tabName: ExtensionAvailableTab): ValueAccessor<string> {
  return createTextAreaAccessor(`#${tabName}_prompt textarea`);
}
