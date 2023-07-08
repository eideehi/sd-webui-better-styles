import type { ValueAccessor } from ".";
import { createNumberInputAccessor } from "./internal/createNumberInputAccessor";

export function createEtaNoiseSeedDeltaAccessor(): ValueAccessor<number> {
  return createNumberInputAccessor(`#setting_eta_noise_seed_delta input[type='number']`);
}
