import { applyClasses, existsElement, hidden, removeAllChild } from "./utils";

let betterStylesModal: HTMLElement | null = null;
let contentWrapper: HTMLElement;

/**
 * Returns the modal element used for displaying Better Styles, creating it if it doesn't exist yet.
 */
function createOrInitModal(): void {
  if (betterStylesModal) {
    // Switch the modal theme to match the app.
    applyClasses(betterStylesModal, existsElement(".gradio-container.dark"), "dark");

    removeAllChild(contentWrapper);
    return;
  }

  betterStylesModal = document.createElement("div");
  betterStylesModal.id = "better-styles-modal";
  hidden(betterStylesModal, true);
  betterStylesModal.classList.add("better-styles", "modal");
  betterStylesModal.addEventListener("mousedown", (event) => {
    if (event.target === betterStylesModal && event.button === 0) {
      event.preventDefault();
      hidden(betterStylesModal, true);
    }
  });
  gradioApp().appendChild(betterStylesModal);

  contentWrapper = document.createElement("div");
  contentWrapper.classList.add("content-wrapper");
  betterStylesModal.appendChild(contentWrapper);

  // Switch the modal theme to match the app.
  applyClasses(betterStylesModal, existsElement(".gradio-container.dark"), "dark");
}

/**
 * Shows a modal with the specified content.
 * @param content - The content to show in the modal.
 */
export function showModal(content: HTMLElement) {
  createOrInitModal();
  contentWrapper.appendChild(content);
  hidden(betterStylesModal, false);
}

/**
 * Closes the modal containing the specified content, if it exists.
 * @param content - The content to close in the modal.
 */
export function closeModal(content: HTMLElement) {
  if (contentWrapper?.removeChild(content)) {
    hidden(betterStylesModal, !contentWrapper.hasChildNodes());
  }
}
