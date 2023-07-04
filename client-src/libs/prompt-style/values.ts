import { tick } from "svelte";
import { getElement } from "@/libs/util/dom";
import { dispatchEvent } from "@/libs/util/webui";

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

export function samplingMethod(tabName: StylesAvailableTab): ValueAccessor<string> {
  return createDropdownAccessor(`#${tabName}_sampling`);
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

export function upscaler(tabName: StylesAvailableTab): ValueAccessor<string> {
  return createDropdownAccessor(`#${tabName}_hr_upscaler`);
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

/**
 * Creates a default value accessor with get and set methods that operate on a value of type T.
 * @returns An object with get and set methods for the default value.
 */
function createEmptyAccessor<T>(): ValueAccessor<T> {
  return {
    get: () => null,
    getOrDefault: (defaultValue) => defaultValue,
    with: () => void 0,
    set: () => false,
  };
}

function createValueAccessor<T>(obj: {
  get: () => T;
  set: (value: T) => boolean;
}): ValueAccessor<T> {
  return {
    ...obj,
    getOrDefault: () => obj.get(),
    with: (callback) => callback(obj.get()),
  };
}

let dropdownSetValueQueue: Promise<void> = Promise.resolve();
function createDropdownAccessor(baseSelector: string): ValueAccessor<string> {
  const input = getElement(`${baseSelector} input`);
  if (!(input instanceof HTMLInputElement)) {
    return createEmptyAccessor();
  }
  return createValueAccessor({
    get: () => input.value,
    set: (value) => {
      const setValue = async () => {
        input.dispatchEvent(new Event("focus"));
        await tick();
        const options = getElement(`${baseSelector} ul > li[data-value="${value}"]`);
        if (options != null) {
          options.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        }
      };

      dropdownSetValueQueue = (async () => {
        await dropdownSetValueQueue;
        return setValue();
      })();
      return true;
    },
  });
}

function createTextAreaAccessor(selector: string): ValueAccessor<string> {
  const element = getElement(selector);
  if (!(element instanceof HTMLTextAreaElement)) {
    return createEmptyAccessor();
  }
  return createValueAccessor({
    get: () => element.value,
    set: (value) => {
      element.value = value;
      dispatchEvent(element, "input");
      return true;
    },
  });
}

function createNumberInputAccessor(selector: string): ValueAccessor<number> {
  const element = getElement(selector);
  if (!(element instanceof HTMLInputElement)) {
    return createEmptyAccessor();
  }
  return createValueAccessor({
    get: () => element.valueAsNumber,
    set: (value) => {
      element.valueAsNumber = value;
      dispatchEvent(element, "input");
      return true;
    },
  });
}

function createCheckboxAccessor(selector: string): ValueAccessor<boolean> {
  const element = getElement(selector);
  if (!(element instanceof HTMLInputElement)) {
    return createEmptyAccessor();
  }
  return createValueAccessor({
    get: () => element.checked,
    set: (value) => {
      if (element.checked != value) {
        element.click();
      }
      return true;
    },
  });
}
