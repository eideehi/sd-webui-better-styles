/**
 * Scrolls an element into view within its parent if needed.
 *
 * @param element - The element to scroll into view.
 * @param parent - The parent element within which to scroll.
 */
export function scrollIntoViewIfNeeded(element: HTMLElement, parent: HTMLElement): void {
  const parentRect = parent.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  if (elementRect.bottom > parentRect.bottom) {
    const scrollOffset = elementRect.bottom - parentRect.bottom + parent.scrollTop;
    parent.scrollTo({ top: scrollOffset });
  } else if (elementRect.top < parentRect.top) {
    const scrollOffset = elementRect.top - parentRect.top + parent.scrollTop;
    parent.scrollTo({ top: scrollOffset });
  }
}
