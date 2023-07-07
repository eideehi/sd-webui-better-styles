/**
 * Returns the first element that matches the given selector within the Gradio app.
 * @param selector - The CSS selector to search for.
 * @returns The matched element, or null if no matches were found.
 */
export function getElement(selector: string): Nullable<HTMLElement> {
  const element = gradioApp().querySelector(selector);
  return element instanceof HTMLElement ? element : null;
}

/**
 * Returns whether or not the HTML element corresponding to the specified selector exists.
 * @param selector - The CSS selector to search for.
 * @returns true if there is an HTML element corresponding to the specified selector, false otherwise.
 */
export function hasElement(selector: string): boolean {
  return !!getElement(selector);
}

/**
 * Show or hide HTML elements.
 * @param element - The target element to toggle the hidden.
 * @param force -
 *   If true, it will be hidden. If false, it will be displayed. If no option
 *   is specified, it will toggle between being displayed and hidden.
 */
export function hidden(element: Nullable<HTMLElement>, force?: boolean) {
  element?.classList.toggle("force-hidden", force);
}
