/**
 * Show or hide HTML elements.
 * @param element - The target element to toggle the hidden.
 * @param force - If true, it will be hidden. If false, it will be displayed. If no option is specified, it will toggle between being displayed and hidden.
 */
export function hidden(element: Nullable<HTMLElement>, force?: boolean) {
  element?.classList.toggle("better-styles-hidden", force);
}
