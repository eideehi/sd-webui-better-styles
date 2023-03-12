import { _, getElement } from "./utils";
import {
  prompt,
  negativePrompt,
  samplingMethod,
  cfgScale,
  samplingSteps,
  clipSkip,
  denoisingStrength,
  etaNoiseSeedDelta,
  hiresFix,
  hiresSteps,
  restoreFaces,
  seed,
  tiling,
  upscaleBy,
  upscaler,
} from "./styleValues";

/**
 * Dispatches an event of the specified type on the specified element.
 * @param element The element to dispatch the event on.
 * @param type The type of event to dispatch.
 */
export function dispatchEvent(element: HTMLElement, type: "input" | "change"): void {
  if (type === "input") {
    updateInput(element);
  } else if (type === "change") {
    const event = new Event(type);
    Object.defineProperty(event, "target", { value: element });
    element.dispatchEvent(event);
  }
}

/**
 * Returns the name of the currently active tab.
 */
export function getCurrentTabName(): WebUiTab {
  const tab = get_uiCurrentTab();
  if (tab && tab.textContent) {
    switch (tab.textContent.trim()) {
      case _("txt2img"):
        return "txt2img";
      case _("img2img"):
        return "img2img";
    }
  }
  return "other";
}

/**
 * Creates a default value accessor with get and set methods that operate on a value of type T.
 * @param defaultValue - The default value for the accessor.
 * @returns An object with get and set methods for the default value.
 */
export function createEmptyAccessor<T>(): ValueAccessor<T> {
  return {
    get: () => null,
    getOrDefault: (defaultValue) => defaultValue,
    with: () => void 0,
    set: () => false,
  };
}

export function createValueAccessor<T>(obj: {
  get: () => T;
  set: (value: T) => boolean;
}): ValueAccessor<T> {
  return {
    ...obj,
    getOrDefault: () => obj.get(),
    with: (callback) => callback(obj.get()),
  };
}

export function createTextAreaAccessor(selector: string): ValueAccessor<string> {
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

export type SelectAccessor = {
  index: ValueAccessor<number>;
  value: ValueAccessor<string>;
};

export function createSelectAccessor(selector: string): SelectAccessor {
  const element = getElement(selector);
  if (!(element instanceof HTMLSelectElement)) {
    return {
      index: createEmptyAccessor(),
      value: createEmptyAccessor(),
    };
  }
  return {
    index: createValueAccessor({
      get: () => element.selectedIndex,
      set: (value) => {
        element.selectedIndex = value;
        dispatchEvent(element, "change");
        return true;
      },
    }),
    value: createValueAccessor({
      get: () => element.selectedOptions[0]?.value || "",
      set: (value) => {
        const option = element.querySelector(`option[value='${value}']`);
        let index = -1;
        if (option instanceof HTMLOptionElement) {
          index = option.index;
        }
        if (index >= 0) {
          element.selectedIndex = index;
          dispatchEvent(element, "change");
          return true;
        }
        return false;
      },
    }),
  };
}

export function createNumberInputAccessor(selector: string): ValueAccessor<number> {
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

export function createCheckboxAccessor(selector: string): ValueAccessor<boolean> {
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

/**
 * A regular expression to match a trailing comma followed by optional whitespace.
 */
const TRAILING_COMMA_REGEX = /,(\s+)?$/g;

/**
 * A regular expression to match a leading comma preceded by optional whitespace.
 */
const LEADING_COMMA_REGEX = /^(\s+)?,/g;

function concatPrompt(prompt1: string, prompt2: string): string {
  if (!prompt1 || TRAILING_COMMA_REGEX.test(prompt1) || LEADING_COMMA_REGEX.test(prompt2)) {
    return prompt1 + prompt2;
  }
  return `${prompt1}, ${prompt2}`;
}

export function applyStyle(tabName: StylesAvailableTab, style: Style): void {
  if (style.prompt) {
    const accessor = prompt(tabName);
    accessor.set(concatPrompt(accessor.getOrDefault(""), style.prompt));
  }
  if (style.negativePrompt) {
    const accessor = negativePrompt(tabName);
    accessor.set(concatPrompt(accessor.getOrDefault(""), style.negativePrompt));
  }
  if (style.samplingMethod) {
    const accessor = samplingMethod(tabName);
    accessor.value.set(style.samplingMethod);
  }
  if (style.samplingSteps) {
    const accessor = samplingSteps(tabName);
    accessor.set(style.samplingSteps);
  }
  if (style.cfgScale) {
    const accessor = cfgScale(tabName);
    accessor.set(style.cfgScale);
  }
  if (style.seed) {
    const accessor = seed(tabName);
    accessor.set(style.seed);
  }
  if (style.restoreFaces) {
    const accessor = restoreFaces(tabName);
    accessor.set(style.restoreFaces);
  }
  if (style.tiling) {
    const accessor = tiling(tabName);
    accessor.set(style.tiling);
  }
  if (style.hiresFix) {
    const accessor = hiresFix(tabName);
    accessor.set(style.hiresFix);
  }
  if (style.upscaler) {
    const accessor = upscaler(tabName);
    accessor.value.set(style.upscaler);
  }
  if (style.hiresSteps) {
    const accessor = hiresSteps(tabName);
    accessor.set(style.hiresSteps);
  }
  if (style.denoisingStrength) {
    const accessor = denoisingStrength(tabName);
    accessor.set(style.denoisingStrength);
  }
  if (style.upscaleBy) {
    const accessor = upscaleBy(tabName);
    accessor.set(style.upscaleBy);
  }
  if (style.clipSkip) {
    const accessor = clipSkip();
    accessor.set(style.clipSkip);
  }
  if (style.etaNoiseSeedDelta) {
    const accessor = etaNoiseSeedDelta();
    accessor.set(style.etaNoiseSeedDelta);
  }
}

export type StyleRegistrationRequest = {
  group: string;
  style: Style;
};

export function registerStyle(
  request: StyleRegistrationRequest,
  callback: (styleGroups: StyleGroup[]) => void
): void {
  fetch("/better-style-api/v1/register-style", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((response) => response.json())
    .then((json) => {
      callback(json);
    });
}

export type StylesDeletionRequest = {
  group: string;
  styles: string[];
};

export function deleteStyles(
  request: StylesDeletionRequest,
  callback: (styleGroups: StyleGroup[]) => void
): void {
  fetch("/better-style-api/v1/delete-styles", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((response) => response.json())
    .then((json) => {
      callback(json);
    });
}
