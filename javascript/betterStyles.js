//@ts-check
/// <reference path="global.d.ts" />
/// <reference path="types.d.ts" />
(() => {
/**
 * A regular expression to match a trailing comma followed by optional whitespace.
 * @type {RegExp}
 */
const TRAILING_COMMA_REGEX = /,(\s+)?/g;

/**
 * A regular expression to match a leading comma preceded by optional whitespace.
 * @type {RegExp}
 */
const LEADING_COMMA_REGEX = /^(\s+)?,/g;

/**
 * Regular expression for matching placeholders in a string.
 * A placeholder is defined as a pair of curly braces ({}) with no space in between.
 * @type {RegExp}
 */
const PLACEHOLDER_REGEX = /\{\}/g;

/**
 * Replaces each occurrence of "{}" in the format string with the corresponding argument.
 * @param {string} format - The format string.
 * @param {...any} args - The arguments to substitute into the format string.
 * @returns {string} The formatted string.
 */
function formatText(format, ...args) {
  return format.replace(PLACEHOLDER_REGEX, () => [...args].shift());
}

/**
 * A collection of all style groups saved by the user, obtained via API from the server.
 * @type {StyleGroup[]}
 */
let styleGroups = [];

/**
 * The directory where the images are saved. It is obtained via API from the server.
 */
let imagesDir = "";

/**
 * Parameters to update the image cache. Set when it is necessary to update the image due to adding or deleting styles.
 */
let updateTimestamp = "";

/**
 * The group name of the styles currently displayed.
 */
let currentGroup = "default";

/**
 * Gets the value of the specified option and applies the provided callback function to it if it exists.
 * @param {string} optionName - The name of the option to retrieve from the opts object.
 * @param {function} callback - The function to apply to the retrieved value, if it exists.
 */
const withOption = (optionName, callback) => {
  const value = opts[optionName];
  if (value) {
    callback(value);
  }
}

/**
 * Returns the first element that matches the given selector within the Gradio app.
 * @param {string} selector - The CSS selector to search for.
 * @returns {HTMLElement | null} - The matched element, or null if no matches were found.
 */
const getElement = (selector) => {
  return gradioApp().querySelector(selector);
}

/**
 * Returns an array-like object of all elements that match the given selector within the Gradio app.
 * @param {string} selector - The CSS selector to search for.
 * @returns {HTMLElement[]} - The array-like object of matched elements.
 */
const getElementAll = (selector) => {
  return Array.from(gradioApp().querySelectorAll(selector));
}

/**
 * Applies one or more CSS classes to an element or removes them if `set` is false.
 * @param {HTMLElement} element - The element to apply the CSS classes to.
 * @param {boolean} set - If true, add the classes; if false, remove them.
 * @param {...string} classes - One or more CSS classes to apply or remove.
 */
function applyClasses(element, set, ...classes) {
  if (set) {
    element.classList.add(...classes);
  } else {
    element.classList.remove(...classes);
  }
}

/**
 * Toggles one or more CSS classes of an element.
 * @param {HTMLElement} element - The target element to toggle the CSS classes.
 * @param  {...string} classes - One or more CSS classes to toggle.
 */
function toggleClasses(element, ...classes) {
  classes.forEach((clazz) => {
    element.classList.toggle(clazz);
  });
}

/**
 * Removes all child nodes from the given parent element.
 * @param {HTMLElement} parentElement - The parent element to remove child nodes from.
 */
const removeAllChild = (parentElement) => {
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
};

/**
 * Returns the name of the currently active tab.
 * @returns {WebUiTab}
 */
function getCurrentTabName() {
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
 * Returns the translated string if a translation is available for the specified text, or the original text if not.
 * @param {string} text - The text to translate.
 * @param {...any} args - Optional arguments to be used in string interpolation.
 * @returns {string} The translated string, if available, or the original text if not.
 */
function _(text, ...args) {
  const translation = getTranslation(text) || text;
  return args ? formatText(translation, ...args) : translation;
}

/**
 * Returns the src of the currently selected image in the gallery, if any.
 * @returns {string} The src of the selected image, or an empty string if no image is selected.
 */
function getSelectedImagePath() {
  const tabName = getCurrentTabName();
  const img = getElement(`#${tabName}_gallery > div > img`);
  if (img instanceof HTMLImageElement) {
    return img.src.substring(img.src.indexOf("file=") + 5);
  }
  return "";
}

/**
 * Dispatches an event of the specified type on the specified element.
 * @param {HTMLElement} element The element to dispatch the event on.
 * @param {"input" | "change"} type The type of event to dispatch.
 */
const dispatchEvent = (element, type) => {
  if (type === "input") {
    updateInput(element);
  } else if (type === "change") {
    const event = new Event(type);
    Object.defineProperty(event, "target", {value: element})
    element.dispatchEvent(event);
  }
};

/**
 * Check if the given string has a trailing comma followed by optional whitespace.
 * @param {string} text The input string to check.
 * @returns {boolean} True if the string has a trailing comma, false otherwise.
 */
const hasTrailingComma = (text) => {
  return TRAILING_COMMA_REGEX.test(text);
}

/**
 * Check if the given string has a leading comma preceded by optional whitespace.
 * @param {string} text The input string to check.
 * @returns {boolean} True if the string has a leading comma, false otherwise.
 */
const hasLeadingComma = (text) => {
  return LEADING_COMMA_REGEX.test(text);
}

/**
 * Creates a default value accessor with get and set methods that operate on a value of type T.
 * @template T
 * @param {T} defaultValue - The default value for the accessor.
 * @returns {ValueAccessor<T>} - An object with get and set methods for the default value.
 */
const createDefaultValueAccessor = (defaultValue) => {
  return {
    get: () => defaultValue,
    set: (value) => void(0)
  }
}

/**
 *
 * @returns {ValueGetter<string>}
 */
const getCheckpoint = () => {
  const element = getElement("#sd_checkpoint_hash");
  if (!(element instanceof HTMLAnchorElement)) {
    return createDefaultValueAccessor("");
  }
  return {get: () => element.title}
}

/**
 * Returns an object with "get" and "set" functions for getting and setting the prompt text
 * for the specified tab.
 * @param {StylesAvailableTab} tabName The name of the tab to get the prompt for.
 * @returns {ValueAccessor<string>} An object with "get" and "set" functions for getting and setting the prompt text.
 */
const getPrompt = (tabName) => {
  const element = getElement(`#${tabName}_prompt textarea`);
  if (!(element instanceof HTMLTextAreaElement)) {
    return createDefaultValueAccessor("");
  }
  return {
    get: () => element.value,
    set: (value) => {
      element.value = value;
      dispatchEvent(element, "input");
    }
  };
};

/**
 * Returns an object with "get" and "set" functions for getting and setting the
 * negative prompt text for the specified tab.
 * @param {StylesAvailableTab} tabName The name of the tab to get the negative prompt for.
 * @returns {ValueAccessor<string>} An object with "get" and "set" functions for getting and setting the negative prompt text.
 */
const getNegativePrompt = (tabName) => {
  const element = getElement(`#${tabName}_neg_prompt textarea`);
  if (!(element instanceof HTMLTextAreaElement)) {
    return createDefaultValueAccessor("");
  }
  return {
    get: () => element.value,
    set: (value) => {
      element.value = value;
      dispatchEvent(element, "input");
    }
  };
};

/**
 * Returns an object with methods for getting and setting the sampling method of the specified tab.
 * @param {StylesAvailableTab} tabName - The name of the tab to get the sampling method from.
 * @returns {{
 *   index: ValueAccessor<number>;
 *   value: ValueAccessor<string>;
 * }}
 */
const getSamplingMethod = (tabName) => {
  const element = getElement(`#${tabName}_sampling select`);
  if (!(element instanceof HTMLSelectElement)) {
    return {
      index: createDefaultValueAccessor(0),
      value: createDefaultValueAccessor("")
    };
  }
  return {
    index: {
      get: () => element.selectedIndex,
      set: (value) => {
        element.selectedIndex = value;
        dispatchEvent(element, "change");
      }
    },
    value: {
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
        }
      }
    }
  };
};

/**
 * Returns an object with methods to get and set the "cfgScale" value of the given tab.
 * @param {StylesAvailableTab} tabName The name of the tab ("txt2img" or "img2img").
 * @returns {ValueAccessor<number>} An object with methods to get and set the "cfgScale" value.
 */
function getCfgScale(tabName) {
  const element = getElement(`#${tabName}_cfg_scale input[type='number']`);
  if (!(element instanceof HTMLInputElement)) {
    return createDefaultValueAccessor(1);
  }
  return {
    get: () => element.valueAsNumber,
    set: (value) => {
      element.valueAsNumber = value;
      dispatchEvent(element, "input");
    }
  };
}

/**
 *
 * @param {StylesAvailableTab} tabName
 * @returns {Omit<Required<Style>, "name">}
 */
function captureStyleValues(tabName) {
  /**
   * @type {Omit<Required<Style>, "name">}
   */
  const style = {
    image: "",
    checkpoint: "",
    prompt: "",
    negativePrompt: "",
    samplingMethod: "",
    cfgScale: 0
  };

  const assign = (key, value) => {
    if (typeof value === "string" && value.length > 0) {
      style[key] = value;
    } else if (typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value)) {
      style[key] = value;
    }
  }

  assign("image", getSelectedImagePath());
  assign("checkpoint", getCheckpoint().get());
  assign("prompt", getPrompt(tabName).get());
  assign("negativePrompt", getNegativePrompt(tabName).get());
  assign("samplingMethod", getSamplingMethod(tabName).value.get());
  assign("cfgScale", getCfgScale(tabName).get());

  return style;
}

/**
 * Applies the given style object to the UI of the specified tab. The style object can contain prompt, negativePrompt, samplingMethod, and cfgScale properties to update the corresponding UI elements in the tab.
 * @param {StylesAvailableTab} tabName - The name of the tab to apply the style to.
 * @param {Style} style - The style object to apply.
 */
function applyStyle(tabName, style) {
  const concatPrompt = (prompt1, prompt2) => {
    if (!prompt1 || hasTrailingComma(prompt1) || hasLeadingComma(prompt2)) {
      return prompt1 + prompt2;
    }
    return `${prompt1}, ${prompt2}`;
  }

  if (style.prompt) {
    const prompt = getPrompt(tabName)
    prompt.set(concatPrompt(prompt.get(), style.prompt));
  }
  if (style.negativePrompt) {
    const negativePrompt = getNegativePrompt(tabName);
    negativePrompt.set(concatPrompt(negativePrompt.get(), style.negativePrompt));
  }
  if (style.samplingMethod) {
    const samplingMethod = getSamplingMethod(tabName);
    samplingMethod.value.set(style.samplingMethod);
  }
  if (style.cfgScale) {
    const cfgScale = getCfgScale(tabName);
    cfgScale.set(style.cfgScale);
  }
};

/**
 *
 * @param {{group: string, style: Style}} data
 * @param {(newStyleGroup: Array<StyleGroup>) => void} callback
 */
function registerStyle(data, callback) {
  fetch("/better-style-api/v1/register-style", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then((response) => response.json()).then((json) => {
    callback(json);
  });
}

/**
 * Initialize Better Styles, including adding components and event listeners.
 * @param {StylesAvailableTab} tabName Name of the tab on which Better Styles will be initialized.
 */
function initializeBetterStyles(tabName) {
  hiddenOrigianlStylesComponents(tabName);

  Promise.all([fetchLocalization]).then(() => {
    createBetterStylesComponents(tabName);
  });

  Promise.all([fetchImagesDirPromise, fetchStylesPromise]).then(() => {
    updateBetterStyleComponents(tabName);
  });
}

/**
 * Hides original style components in the specified tab.
 * @param {StylesAvailableTab} tabName - The name of the tab to hide original style components from.
 */
function hiddenOrigianlStylesComponents(tabName) {
  withOption("better_styles_hide_original_styles", (value) => {
    if (value) {
      getElement(`#${tabName}_style_apply`)?.classList.add("!hidden");
      getElement(`#${tabName}_style_create`)?.classList.add("!hidden");
      getElement(`#${tabName}_styles_row`)?.classList.add("!hidden");
    }
  });
}
function containsChildElement(parent, child) {
  // Check if the parent element is the desired child element
  if (parent === child) {
    return true;
  }

  // Check all child nodes of the parent element
  for (let i = 0; i < parent.childNodes.length; i++) {
    const childNode = parent.childNodes[i];

    // If the child node is an element, call this function recursively
    if (childNode.nodeType === Node.ELEMENT_NODE && containsChildElement(childNode, child)) {
      return true; // The child element was found in a descendant node
    }
  }

  // The child element was not found in any descendant node
  return false;
}

/**
 * @type {HTMLElement | null}
 */
let betterStylesModal = null;

/**
 * Returns the modal element used for displaying Better Styles, creating it if it doesn't exist yet.
 * @returns {HTMLElement}
 */
function getOrCreateModal() {
  if (betterStylesModal) {
    // Switch the modal theme to match the app.
    applyClasses(betterStylesModal, !!getElement(".gradio-container.dark"), "dark");
    return betterStylesModal;
  }

  betterStylesModal = document.createElement("div");
  betterStylesModal.id = "better-styles-modal";
  betterStylesModal.classList.add("better-styles", "fixed", "w-full", "h-full", "inset-0", "bg-black/50", "flex", "items-center", "justify-center", "!hidden", "z-1000");
  betterStylesModal.addEventListener("mousedown", (event) => {
    if (event.target === betterStylesModal) {
      event.preventDefault();
      betterStylesModal?.classList.add("!hidden");
    }
  });
  gradioApp().appendChild(betterStylesModal);

  // Switch the modal theme to match the app.
  applyClasses(betterStylesModal, !!getElement(".gradio-container.dark"), "dark");
  return betterStylesModal;
}

/**
 * Shows a modal with the specified content.
 * @param {HTMLElement} content - The content to show in the modal.
 */
function showModal(content) {
  const modal = getOrCreateModal();
  removeAllChild(modal);

  modal.appendChild(content);
  modal.classList.remove("!hidden");
}

/**
 * Closes the modal containing the specified content, if it exists.
 * @param {HTMLElement} content - The content to close in the modal.
 */
function closeModal(content) {
  if (!betterStylesModal) {
    return;
  }
  if (betterStylesModal.removeChild(content)) {
    if (!betterStylesModal.hasChildNodes()) {
      betterStylesModal.classList.add("!hidden");
    }
  }
}

/**
 * @type {HTMLElement | null}
 */
let betterStylesToast = null;
let toastTimer = -1;

/**
 * Returns the existing toast element, or creates a new one if it doesn't exist.
 * @returns {HTMLElement} The toast element.
 */
function getOrCreateToast() {
  if (betterStylesToast) {
    return betterStylesToast;
  }

  betterStylesToast = document.createElement("div");
  betterStylesToast.classList.add("better-styles", "toast");
  betterStylesToast.addEventListener("click", (event) => {
    closeToast();
  });

  gradioApp().appendChild(betterStylesToast);
  return betterStylesToast;
}

/**
 * Closes the toast if it is currently open.
 */
function closeToast() {
  if (betterStylesToast) {
    gradioApp().removeChild(betterStylesToast);
    betterStylesToast = null;
  }
}

/**
 * Shows a toast message with the specified parameters.
 * @param {string} message - The message to display in the toast.
 * @param {"info" | "success" | "warning" | "error"} [type="info"] - The type of toast to display.
 * @param {number} [duration=3000] - The duration in milliseconds to display the toast.
 */
function showToast(message, type = "info", duration = 3000) {
  const toast = getOrCreateToast();
  toast.classList.remove("toast-info", "toast-success", "toast-warning", "toast-error");
  toast.classList.add(`toast-${type}`);
  toast.textContent = message;

  if (toastTimer >= 0) {
    clearTimeout(toastTimer);
  }

  toastTimer = setTimeout(() => {
    toast.classList.remove("fade-out");
    toast.classList.add("show");
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("fade-out");
      toastTimer = setTimeout(() => {
        closeToast();
      }, 300);
    }, duration);
  }, 50);
}

/**
 * @param {StylesAvailableTab} tabName
 */
function createBetterStylesComponents(tabName) {
  if (getElement(`#better-styles-${tabName}-styles`)) {
    return;
  }

  const component = document.createElement("div");
  component.id = `better-styles-${tabName}-styles`;
  component.classList.add("better-styles", "flex", "flex-col", "w-full", "gap-4", "gr-compact", "!hidden");
  getElement(`div#${tabName}_extra_networks`)?.after(component);

  const tools = createToolsComponent(tabName);
  component.appendChild(tools);

  const view = document.createElement("div");
  tools.after(view);

  const groups = document.createElement("div");
  groups.id = `better-styles-${tabName}-group-container`;
  groups.classList.add("!border-x-2", "border-gray-200", "flex", "px-2", "pb-0", "pt-4");
  view.appendChild(groups);

  groups.appendChild(createGroupButton("default"));
  updateGroup(tabName);

  const styles = document.createElement("div");
  styles.id = `better-styles-${tabName}-style-container`;
  styles.classList.add("tabitem", "p-2", "!border-x-2", "!border-b-2", "border-gray-200", "relative", "flex", "flex-wrap", "gap-x-2", "block");
  groups.after(styles);

  styles.appendChild(createStyleEmptyContent());
  getElement("#setting_sd_model_checkpoint select")?.addEventListener("change", (event) => {
    const currentCheckpoint = getCheckpoint().get();
    const interval = setInterval(() => {
      if (getCheckpoint().get() !== currentCheckpoint) {
        updateBetterStyleComponents(tabName);
        clearInterval(interval);
      }
    }, 250);
  });

  const toggleButton = document.createElement("button");
  toggleButton.id = `better-styles-${tabName}-toggle`;
  toggleButton.textContent = "🏷";
  toggleButton.classList.add("gr-button", "gr-button-lg", "gr-button-tool");
  toggleButton.title = _("Show Better Styles");
  toggleButton.addEventListener("click", (event) => {
    toggleClasses(component, "!hidden");
  });
  getElement(`#${tabName}_tools`)?.appendChild(toggleButton);
}

function createToolsComponent(tabName) {
  const tools = document.createElement("div");
  tools.classList.add("flex", "!border-b-2", "flex-wrap", "dark:border-gray-700");

  const label = document.createElement("p");
  label.classList.add("bg-white", "px-4", "pb-2", "pt-1.5", "rounded-t-lg", "border-gray-200", "-mb-[2px]", "border-2", "border-b-0", "flex", "items-center");
  label.textContent = _("Better Styles");
  tools.appendChild(label);

  const searchBar = document.createElement("textarea");
  searchBar.classList.add("scroll-hide", "inline-block", "gr-box", "gr-input", "w-full", "gr-text-input", "search", "overflow-y-scroll", "max-w-[16rem]", "m-[0.3rem]", "self-center", "resize-none");
  searchBar.placeholder = _("Search styles...");
  searchBar.rows = 1;
  searchBar.addEventListener("input", (event) => {
    getElementAll(`#better-styles-${tabName}-style-container [data-style]`).forEach((element) => {
      const style = element.dataset.style || "";
      applyClasses(element, !style.includes(searchBar.value), "!hidden");
    });
  });
  label.after(searchBar);

  const applyButton = document.createElement("button");
  applyButton.id = `better-styles-${tabName}-apply`;
  applyButton.classList.add("gr-button", "gr-button-lg", "gr-button-secondary", "m-[0.3rem]");
  applyButton.textContent = _("Apply style");
  applyButton.addEventListener("click", (event) => {
    const selectedStyles = [...getElementAll(`#better-styles-${tabName}-style-container .selected`)];
    if (selectedStyles.length <= 0) {
      showToast(_("Style is not selected"), "warning");
      return;
    }
    selectedStyles
      .filter((card) => {
        const styleName = card.dataset.style;
        return styleGroups.filter((data) => data.name === currentGroup)
        .some((data) => {
          return data.styles.filter((stlye) => stlye.name === styleName)
            .some((style) => {
              applyStyle(tabName, style);
              return true;
            });
        });
      })
      .forEach((card) => card.click());
  });
  searchBar.after(applyButton);

  const saveButton = document.createElement("button");
  saveButton.id = `better-styles-${tabName}-save`;
  saveButton.classList.add("gr-button", "gr-button-lg", "gr-button-secondary", "m-[0.3rem]");
  saveButton.textContent = _("Save style");
  saveButton.addEventListener("click", (event) => {
    showStyleSaveDialog();
  });
  applyButton.after(saveButton);

  const deleteButton = document.createElement("button");
  deleteButton.id = `better-styles-${tabName}-delete`;
  deleteButton.classList.add("gr-button", "gr-button-lg", "gr-button-secondary", "m-[0.3rem]");
  deleteButton.textContent = _("Delete style");
  deleteButton.addEventListener("click", (event) => {
    const selectedStyles = [...getElementAll(`#better-styles-${tabName}-style-container .selected`)];
    if (selectedStyles.length <= 0) {
      showToast(_("Style is not selected"), "warning");
      return;
    }
    showStylesDeleteDialog(tabName);
  });
  saveButton.after(deleteButton);

  const closeButton = document.createElement("button");
  closeButton.id = `better-styles-${tabName}-close`;
  closeButton.classList.add("gr-button", "gr-button-lg", "gr-button-secondary", "m-[0.3rem]");
  closeButton.textContent = _("Close Better Styles");
  closeButton.addEventListener("click", (event) => {
    getElement(`#better-styles-${tabName}-styles`)?.classList.add("!hidden");
  });
  deleteButton.after(closeButton);

  return tools;
}

function showStyleSaveDialog() {
  const tabName = getCurrentTabName();
  if (tabName === "other") {
    return;
  }

  const values = captureStyleValues(tabName);

  const frame = document.createElement("div");
  frame.classList.add("gr-compact", "gr-block", "gr-box", "!m-auto", "flex", "flex-col", "py-6", "px-4", "gap-y-6");
  frame.style.width = "clamp(20rem, 70vw, 42.5rem)";
  frame.style.boxShadow = "0px 0px 4px 0.25rem rgb(8 8 8 / 50%)";

  const createTextInput = (labelText, defaultValue) => {
    const container = document.createElement("label");
    container.classList.add("inline-flex", "flex-col", "relative");

    const label = document.createElement("span");
    label.classList.add("text-gray-500", "text-[0.855rem]", "mb-2", "block", "dark:text-gray-200");
    label.textContent = labelText;

    const input = document.createElement("input");
    input.classList.add("gr-box", "gr-input", "gr-text-input");
    input.value = defaultValue;

    container.appendChild(label);
    container.appendChild(input);
    return {
      element: container,
      input
    };
  };

  const createTextarea = (labelText, defaultValue) => {
    const container = document.createElement("label");
    container.classList.add("inline-flex", "flex-col", "relative");

    const label = document.createElement("span");
    label.classList.add("text-gray-500", "text-[0.855rem]", "mb-2", "block", "dark:text-gray-200");
    label.textContent = labelText;

    const textarea = document.createElement("textarea");
    textarea.classList.add("gr-box", "gr-input", "gr-text-input", "scroll-hide", "!overflow-y-scroll", "resize-none");
    textarea.rows = 3;
    textarea.value = defaultValue;

    container.appendChild(label);
    container.appendChild(textarea);
    return {
      element: container,
      textarea
    };
  };

  const createCheckbox = (labelText) => {
    const container = document.createElement("label");
    container.classList.add("flex", "items-center", "text-gray-700", "text-sm", "space-x-2", "rounded-lg", "cursor-pointer", "dark:bg-transparent");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.classList.add("gr-check-radio", "gr-checkbox");
    input.addEventListener("change", (event) => {
      container.dataset.checked = String(input.checked);
    });

    const label = document.createElement("span");
    label.classList.add("ml-2");
    label.textContent = labelText;

    container.appendChild(input);
    input.after(label);
    return {
      element: container,
      input
    };
  }

  const styleName = createTextInput(_("Style name"), "");
  frame.appendChild(styleName.element);

  const group = createTextInput(_("Group"), _(currentGroup));
  frame.appendChild(group.element);

  const prompt = createTextarea(_("Prompt"), values.prompt);
  frame.appendChild(prompt.element);

  const negativePrompt = createTextarea(_("Negative prompt"), values.negativePrompt);
  frame.appendChild(negativePrompt.element);

  const exclusive = createCheckbox(_("Make this style exclusive to the current checkpoint"));
  frame.appendChild(exclusive.element);

  const image = createCheckbox(_("Use the current image as a thumbnail"));
  if (!values.image) {
    image.element.classList.remove("text-gray-700", "cursor-pointer");
    image.element.classList.add("text-gray-400");
    image.input.disabled = true;
  }
  frame.appendChild(image.element);

  const samplingMethod = createCheckbox(_("Include the \"{}\" as a style", _("Sampling method")));
  frame.appendChild(samplingMethod.element);

  const cfgScale = createCheckbox(_("Include the \"{}\" as a style", _("CFG Scale")));
  frame.appendChild(cfgScale.element);

  const buttons = document.createElement("div");
  buttons.classList.add("flex", "gap-x-2");
  frame.appendChild(buttons);

  const createStyle = () => {
    /**
     * @type {Omit<Style, "name">}
     */
    const style = {};
    if (exclusive.input.checked) {
      style["checkpoint"] = values.checkpoint;
    }
    if (image.input.checked) {
      style["image"] = values.image;
    }
    if (prompt.textarea.value) {
      style["prompt"] = prompt.textarea.value;
    }
    if (negativePrompt.textarea.value) {
      style["negativePrompt"] = negativePrompt.textarea.value;
    }
    if (samplingMethod.input.checked) {
      style["samplingMethod"] = values.samplingMethod;
    }
    if (cfgScale.input.checked) {
      style["cfgScale"] = values.cfgScale;
    }
    return style;
  };

  const submit = document.createElement("button");
  submit.classList.add("gr-button", "gr-button-lg", "grow");
  submit.textContent = _("Save with this content");
  submit.addEventListener("click", (event) => {
    // If the user is using a language other than English, the word "default" may have been translated, so let's revert it here.
    const getGroupValue = (value) => value === _("default") ? "default" : value;

    registerStyle({
      group: getGroupValue(group.input.value),
      style: {
        name: styleName.input.value,
        ...createStyle(),
      }
    }, (data) => {
      closeModal(frame);
      styleGroups = data;
      onRecieveStyleGroup();
      showToast(_("Style registered"), "success");
    });
  });
  buttons.appendChild(submit);

  const cancel = document.createElement("button");
  cancel.classList.add("gr-button", "gr-button-lg");
  cancel.textContent = _("Close without saving");
  cancel.addEventListener("click", (event) => {
    closeModal(frame);
  });
  buttons.appendChild(cancel);

  const onUpdateRequireField = () => {
    const disabled = !styleName.input.value || !group.input.value;
    submit.disabled = disabled;
    if (disabled) {
      submit.classList.remove("gr-button", "gr-button-primary");
      submit.classList.add("gr-box", "gr-check-radio");
    } else {
      submit.classList.remove("gr-box", "gr-check-radio");
      submit.classList.add("gr-button", "gr-button-primary");
    }
  };

  onUpdateRequireField();

  styleName.input.addEventListener("input", (event) => {
    onUpdateRequireField();
  });
  group.input.addEventListener("input", (event) => {
    onUpdateRequireField();
  });

  showModal(frame);
}

function showStylesDeleteDialog(tabName) {
  const frame = document.createElement("div");
  frame.classList.add("gr-compact", "gr-block", "gr-box", "!m-auto", "flex", "flex-col", "py-6", "px-4", "gap-y-6");
  frame.style.width = "clamp(20rem, 70vw, 42.5rem)";
  frame.style.boxShadow = "0px 0px 4px 0.25rem rgb(8 8 8 / 50%)";

  const message = document.createElement("p");
  message.classList.add("text-xl");
  message.textContent = _("Delete all selected styles. This action cannot be undone. Are you sure?");
  frame.appendChild(message);

  const buttons = document.createElement("div");
  buttons.classList.add("flex", "justify-end", "gap-x-2");
  frame.appendChild(buttons);

  const submit = document.createElement("button");
  submit.classList.add("gr-button", "gr-button-lg", "gr-button-primary");
  submit.textContent = _("Execute the deletion");
  submit.addEventListener("click", async (event) => {
    const selectedStyles = getElementAll(`#better-styles-${tabName}-style-container .selected`);
    await fetch("/better-style-api/v1/delete-styles", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        group: currentGroup,
        styles: [...selectedStyles].map((card) => card.dataset.style)
      })
    }).then((response) => response.json()).then((json) => {
      closeModal(frame);
      styleGroups = json;
      onRecieveStyleGroup();
      showToast(_("Styles deleted"), "success");
    });
  });
  buttons.appendChild(submit);

  const cancel = document.createElement("button");
  cancel.classList.add("gr-button", "gr-button-lg");
  cancel.textContent = _("Close without deleting");
  cancel.addEventListener("click", (event) => {
    closeModal(frame);
  });
  buttons.appendChild(cancel);

  showModal(frame);
}

function createGroupButton(group) {
  const button = document.createElement("button");
  button.textContent = _(group);
  button.classList.add("gr-box-sm", "gr-button-lg", "m-[0.3rem]");
  button.dataset.group = group;
  if (group === currentGroup) {
    button.disabled = true;
  }
  button.addEventListener("click", (event) => {
    currentGroup = group;

    const activeTab = getCurrentTabName();
    if (activeTab !== "other") {
      updateBetterStyleComponents(activeTab);
    }
  });
  return button;
}

function updateGroup(tabName) {
  getElementAll(`#better-styles-${tabName}-group-container > button`)
    .forEach((button) => {
      const groupMatches = button.dataset.group === currentGroup;
      applyClasses(button, groupMatches, "gr-button-primary");
      applyClasses(button, !groupMatches, "gr-button-secondary");
      if (button instanceof HTMLInputElement) {
        button.disabled = groupMatches;
      }
    });
}

function createStyleEmptyContent() {
  const emptyContent = document.createElement("div");
  emptyContent.classList.add("m-2", "mt-5");

  const emptyMessage = document.createElement("p");
  emptyMessage.classList.add("text-2xl", "dark:text-white");
  emptyMessage.textContent = _(`Style not yet registered. \"Save style\" button for register a new style.`);
  emptyContent.appendChild(emptyMessage);

  return emptyContent;
}

function onRecieveStyleGroup() {
  const tabName = getCurrentTabName()
  if (tabName !== "other") {
    updateTimestamp = `?ts=${new Date().getTime()}`;
    updateBetterStyleComponents(tabName);
  }
}

/**
 * @param {StylesAvailableTab} tabName
 */
function updateBetterStyleComponents(tabName) {
  const groups = getElement(`#better-styles-${tabName}-group-container`);
  const styles = getElement(`#better-styles-${tabName}-style-container`);

  if (!groups || !styles) {
    return;
  }

  removeAllChild(groups);
  removeAllChild(styles);

  const checkpoint = getElement("#sd_checkpoint_hash")?.title || "";
  const visibleStyles = getVisibleStyles(checkpoint);

  if (visibleStyles.some(({ styles }) => styles.length > 0)) {
    visibleStyles
      .sort((group1, group2) => group1.name.localeCompare(group2.name))
      .forEach((group) => {
        if (currentGroup === "") {
          currentGroup = group.name;
        }
        groups.appendChild(createGroupButton(group.name));
        if (group.name !== currentGroup) {
          return;
        }
        group.styles
          .sort((style1, style2) => style1.name.localeCompare(style2.name))
          .forEach((style) => {
            styles.appendChild(createCardComponent(style));
          });
      });
  } else {
    currentGroup = "default";
    groups.appendChild(createGroupButton("default"));
    styles.appendChild(createStyleEmptyContent());
  }

  updateGroup(tabName);
}

/**
 * Returns only style data that visible in the current checkpoint.
 * @param {string} checkpoint - The current checkpoint hash.
 * @returns {StyleGroup[]} - An array of visible style data.
 */
function getVisibleStyles(checkpoint) {
  /** @type {StyleGroup[]} */
  const visibleStyles = [];
  let resetGroup = false;
  styleGroups.forEach((group) => {
    const filteredStyles = group.styles.filter((style) => !style.checkpoint || checkpoint === style.checkpoint);
    if (filteredStyles.length > 0) {
      visibleStyles.push({
        name: group.name,
        styles: filteredStyles,
      });
    } else if (group.name === currentGroup) {
      resetGroup = true;
    }
  });
  if (resetGroup) {
    currentGroup = "";
  }
  return visibleStyles;
}

/**
 * @param {Style} style
 */
function createCardComponent(style) {
  const card = document.createElement("div");
  const showBoxShadow = (show) => {
    if (show) {
      card.style.boxShadow = "0 0 2px 0.3em rgb(0 128 255 / 35%)";
    } else {
      card.style.boxShadow = "";
    }
  };
  card.dataset.style = style.name;
  card.classList.add("inline-block", "m-2", "w-64", "h-64", "rounded", "!overflow-hidden", "cursor-pointer", "relative", "select-none");
  card.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    showStyleDetailDialog(style);
  });

  card.addEventListener("mouseenter", (event) => {
    showBoxShadow(!card.classList.contains("selected"));
  });
  card.addEventListener("mouseleave", (event) => {
    showBoxShadow(false);
  });

  const image = document.createElement("img");
  if (style.image) {
    image.src = `file=${imagesDir}/${style.image}${updateTimestamp}`;
  } else {
    image.src = "file=html/card-no-preview.png";
  }
  image.classList.add("absolute", "object-cover", "w-full", "h-full", "transition-transform", "ease-out", "duration-500", "hover:scale-105");
  image.setAttribute("draggable", "false");
  card.appendChild(image);

  const labelContainer = document.createElement("div");
  labelContainer.classList.add("absolute", "bottom-0", "inset-x-0", "p-2", "flex", "flex-col", "text-white", "bg-black/50");
  labelContainer.style.boxShadow = "0 0 0.25em 0.25em rgb(0 0 0 / 50%)";
  labelContainer.style.textShadow = "0 0 0.2em black";
  card.appendChild(labelContainer);

  const replacePreview = document.createElement("a");
  replacePreview.classList.add("mt-1", "mb-3", "ml-1", "!hidden", "hover:text-red", "text-sm");
  replacePreview.href = "#";
  replacePreview.text = _("replace thumbnail");
  replacePreview.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const image = getSelectedImagePath();
    if (!image) {
      showToast(_("Image is not selected"), "warning");
      return;
    }

    registerStyle({
      group: currentGroup,
      style: {
        ...style,
        image
      }
    }, (data) => {
      styleGroups = data;
      onRecieveStyleGroup();
    });
  });
  labelContainer.appendChild(replacePreview);

  const label = document.createElement("span");
  label.classList.add("text-xl", "truncate");
  label.textContent = style.name;
  label.title = style.name;
  labelContainer.appendChild(label);

  label.addEventListener("mouseenter", (event) => {
    replacePreview.classList.remove("!hidden");
  });
  labelContainer.addEventListener("mouseleave", (event) => {
    replacePreview.classList.add("!hidden");
  });
  card.addEventListener("click", (event) => {
    toggleClasses(card, "selected", "outline", "outline-2", "outline-offset-2", "outline-[#ff7c00]");
    showBoxShadow(!card.classList.contains("selected"));
  });

  return card;
}

/**
 * @param {Style} style
 */
const showStyleDetailDialog = (style) => {
  const frame = document.createElement("div");
  frame.classList.add("gr-compact", "gr-block", "gr-box", "!m-auto", "flex", "flex-col", "py-6", "px-4", "gap-y-6");
  frame.style.width = "clamp(20rem, 70vw, 42.5rem)";
  frame.style.boxShadow = "0px 0px 4px 0.25rem rgb(8 8 8 / 50%)";
  frame.classList.add("relative");

  const list = document.createElement("div");
  list.classList.add("grid", "grid-cols-[max-content_1fr]", "gap-2");
  frame.appendChild(list);

  const createField = (label, value) => {
    const container = document.createElement("div");
    container.classList.add("contents");

    const labelElement = document.createElement("span");
    labelElement.textContent = label;
    labelElement.classList.add("text-right", "pt-3");
    labelElement.style.overflowWrap = "anywhere";
    container.appendChild(labelElement);

    const valueElement = document.createElement("p");
    valueElement.textContent = value;
    valueElement.classList.add("gr-box", "gr-padded", "border-gray-200");
    valueElement.style.overflowWrap = "anywhere";
    container.appendChild(valueElement);
    return container;
  };

  list.appendChild(createField(_("Style name"), _(style.name)));
  list.appendChild(createField(_("Exclusive"), !!style.checkpoint ? _("Yes") : _("No")));
  list.appendChild(createField(_("Prompt"), style.prompt || _("Not set")));
  list.appendChild(createField(_("Negative prompt"), style.negativePrompt || _("Not set")));
  list.appendChild(createField(_("Sampling method"), style.samplingMethod || _("Not set")));
  list.appendChild(createField(_("CFG Scale"), style.cfgScale || _("Not set")));

  const close = document.createElement("button");
  close.classList.add("gr-box", "gr-button", "gr-button-lg");
  close.textContent = _("Close style detail");
  close.addEventListener("click", (event) => {
    closeModal(frame);
  });
  frame.appendChild(close);

  showModal(frame);
};

/**
 * @type {Promise<void> | null}
 */
let fetchLocalization = null;

/**
 * @type {Promise<void> | null}
 */
let fetchStylesPromise = null;

/**
 * @type {Promise<void> | null}
 */
let fetchImagesDirPromise = null;

onUiLoaded(async () => {
  const timestamp = new Date().getTime();

  fetchLocalization = fetch(`/better-style-api/v1/get-localization?ts=${timestamp}`)
    .then((response) => response.json())
    .then((json) => {
      Object.assign(localization, json);
      return Promise.resolve();
    });

  fetchImagesDirPromise = fetch(`/better-style-api/v1/images-dir?ts=${timestamp}`)
    .then((response) => response.json())
    .then((json) => {
      imagesDir = json.imagesDir;
      return Promise.resolve();
    });

  fetchStylesPromise = fetch(`/better-style-api/v1/all-style?ts=${timestamp}`)
    .then((response) => response.json())
    .then((json) => {
      styleGroups = json;
      return Promise.resolve();
    });
});

onUiTabChange(() => {
  const activeTab = getCurrentTabName();
  if (activeTab !== "other") {
    initializeBetterStyles(activeTab);
  }
});
})();
