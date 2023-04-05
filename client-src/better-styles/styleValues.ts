import { getElement } from "../libs/utils";
import {
  createEmptyAccessor,
  createTextAreaAccessor,
  createSelectAccessor,
  createNumberInputAccessor,
  createCheckboxAccessor,
  SelectAccessor,
} from "../libs/webui";

export function selectedImage(tabName: StylesAvailableTab): ValueGetter<string> {
  const element = getElement(`#${tabName}_gallery > div > img`);
  if (!(element instanceof HTMLImageElement)) {
    return createEmptyAccessor();
  }
  const get = () => element.src.substring(element.src.indexOf("file=") + 5);
  return {
    get,
    getOrDefault: get,
    with: (callback) => callback(get()),
  };
}

export function checkpoint(): ValueGetter<string> {
  const element = getElement("#sd_checkpoint_hash");
  if (!(element instanceof HTMLAnchorElement)) {
    return createEmptyAccessor();
  }
  const get = () => element.title;
  return {
    get,
    getOrDefault: get,
    with: (callback) => callback(get()),
  };
}

export function prompt(tabName: StylesAvailableTab): ValueAccessor<string> {
  return createTextAreaAccessor(`#${tabName}_prompt textarea`);
}

export function negativePrompt(tabName: StylesAvailableTab): ValueAccessor<string> {
  return createTextAreaAccessor(`#${tabName}_neg_prompt textarea`);
}

export function samplingMethod(tabName: StylesAvailableTab): SelectAccessor {
  return createSelectAccessor(`#${tabName}_sampling select`);
}

export function samplingSteps(tabName: StylesAvailableTab): ValueAccessor<number> {
  return createNumberInputAccessor(`#${tabName}_steps input[type='number']`);
}

export function cfgScale(tabName: StylesAvailableTab): ValueAccessor<number> {
  return createNumberInputAccessor(`#${tabName}_cfg_scale input[type='number']`);
}

export function seed(tabName: StylesAvailableTab): ValueAccessor<number> {
  return createNumberInputAccessor(`#${tabName}_seed input[type='number']`);
}

export function restoreFaces(tabName: StylesAvailableTab): ValueAccessor<boolean> {
  return createCheckboxAccessor(`#${tabName}_restore_faces input[type='checkbox']`);
}

export function tiling(tabName: StylesAvailableTab): ValueAccessor<boolean> {
  return createCheckboxAccessor(`#${tabName}_tiling input[type='checkbox']`);
}

export function hiresFix(tabName: StylesAvailableTab): ValueAccessor<boolean> {
  return createCheckboxAccessor(`#${tabName}_enable_hr input[type='checkbox']`);
}

export function upscaler(tabName: StylesAvailableTab): SelectAccessor {
  return createSelectAccessor(`#${tabName}_hr_upscaler select`);
}

export function hiresSteps(tabName: StylesAvailableTab): ValueAccessor<number> {
  return createNumberInputAccessor(`#${tabName}_hires_steps input[type='number']`);
}

export function denoisingStrength(tabName: StylesAvailableTab): ValueAccessor<number> {
  return createNumberInputAccessor(`#${tabName}_denoising_strength input[type='number']`);
}

export function upscaleBy(tabName: StylesAvailableTab): ValueAccessor<number> {
  return createNumberInputAccessor(`#${tabName}_hr_scale input[type='number']`);
}

export function clipSkip(): ValueAccessor<number> {
  return createNumberInputAccessor(`#setting_CLIP_stop_at_last_layers input[type='number']`);
}

export function etaNoiseSeedDelta(): ValueAccessor<number> {
  return createNumberInputAccessor(`#setting_eta_noise_seed_delta input[type='number']`);
}
