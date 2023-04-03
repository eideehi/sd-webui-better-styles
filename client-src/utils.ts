/**
 * Formats a string with placeholders using the specified arguments.
 *
 * @example
 *   _("{0} has {1}", "John", "Apple") // John has Apple
 *   _("{1} is hiring {0}", "John", "Apple") // Apple is hiring John
 * @param text The format string with placeholders.
 * @param args The arguments to replace the placeholders with.
 * @returns The formatted string with the placeholders replaced by the arguments.
 */
export function _(text: string, ...args: any[]): string {
  const translation = getTranslation(text) || text;
  if (args.length === 0) {
    return translation;
  }
  return args.reduce((result, value, index) => {
    return result.replace(`{${index}}`, value);
  }, translation);
}

/**
 * Returns the first element that matches the given selector within the Gradio app.
 * @param selector - The CSS selector to search for.
 * @returns The matched element, or null if no matches were found.
 */
export function getElement(selector: string): HTMLElement | null {
  return gradioApp().querySelector(selector);
}

/**
 * Returns whether or not the HTML element corresponding to the specified selector exists.
 * @param selector - The CSS selector to search for.
 * @returns true if there is an HTML element corresponding to the specified selector, false otherwise.
 */
export function existsElement(selector: string): boolean {
  return !!getElement(selector);
}

/**
 * Returns an array of all elements that match the given selector within the Gradio app.
 * @param selector - The CSS selector to search for.
 * @returns The array-like object of matched elements.
 */
export function getElementAll(selector: string): HTMLElement[] {
  return Array.from(gradioApp().querySelectorAll(selector));
}

/**
 * Removes all child nodes from the given parent element.
 * @param parentElement - The parent element to remove child nodes from.
 */
export function removeAllChild(parentElement: HTMLElement): void {
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
}

/**
 * Applies one or more CSS classes to an element or removes them if `set` is false.
 * @param element - The element to apply the CSS classes to.
 * @param set - If true, add the classes; if false, remove them.
 * @param classes - One or more CSS classes to apply or remove.
 */
export function applyClasses(element: HTMLElement, set: boolean, ...classes: string[]): void {
  if (set) {
    element.classList.add(...classes);
  } else {
    element.classList.remove(...classes);
  }
}

/**
 * Toggles one or more CSS classes of an element.
 * @param element - The target element to toggle the CSS classes.
 * @param classes - One or more CSS classes to toggle.
 */
export function toggleClasses(element: HTMLElement, ...classes: string[]) {
  classes.forEach((clazz) => {
    element.classList.toggle(clazz);
  });
}

/**
 * Show or hide HTML elements.
 * @param element - The target element to toggle the hidden.
 * @param force -
 *   If true, it will be hidden. If false, it will be displayed. If no option
 *   is specified, it will toggle between being displayed and hidden.
 */
export function hidden(element: HTMLElement | null, force?: boolean) {
  element?.classList.toggle("better-styles-force-hidden", force);
}

/**
 * If an option with the specified name exists and it is of string type,
 * execute the callback. If the option with the specified name does not exist
 * or the type of the option is not string, do nothing.
 * @param optionName - The name of the option to retrieve.
 * @param callback - Callback function to process the retrieved option value.
 */
export function withStringOption(optionName: string, callback: (value: string) => void): void {
  const value = opts[optionName];
  if (typeof value === "string") {
    callback(value);
  }
}

/**
 * If an option with the specified name exists and it is of boolean type,
 * execute the callback. If the option with the specified name does not exist
 * or the type of the option is not boolean, do nothing.
 * @param optionName - The name of the option to retrieve.
 * @param callback - Callback function to process the retrieved option value.
 */
export function withBooleanOption(optionName: string, callback: (value: boolean) => void): void {
  const value = opts[optionName];
  if (typeof value === "boolean") {
    callback(value);
  }
}

/**
 * If an option with the specified name exists and it is of number type,
 * execute the callback. If the option with the specified name does not exist
 * or the type of the option is not number, do nothing.
 * @param optionName - The name of the option to retrieve.
 * @param callback - Callback function to process the retrieved option value.
 */
export function withNumberOption(optionName: string, callback: (value: number) => void): void {
  const value = opts[optionName];
  if (typeof value === "number") {
    callback(value);
  }
}
