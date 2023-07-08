import type { ValueAccessor } from ".";
import { createNumberInputAccessor } from "./internal/createNumberInputAccessor";

export function createClipSkipAccessor(): ValueAccessor<number> {
  return createNumberInputAccessor(`#setting_CLIP_stop_at_last_layers input[type='number']`);
}
