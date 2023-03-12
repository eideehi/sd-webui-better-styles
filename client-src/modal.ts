import { applyClasses, existsElement, hidden, removeAllChild } from "./utils";

let betterStylesModal: HTMLElement | null = null;

/**
 * Returns the modal element used for displaying Better Styles, creating it if it doesn't exist yet.
 */
function getOrCreateModal(): HTMLElement {
  if (betterStylesModal) {
    // Switch the modal theme to match the app.
    applyClasses(betterStylesModal, existsElement(".gradio-container.dark"), "dark");
    return betterStylesModal;
  }

  betterStylesModal = document.createElement("div");
  betterStylesModal.id = "better-styles-modal";
  betterStylesModal.classList.add(
    "better-styles",
    "gradio-container",
    "modal",
    "fixed",
    "w-full",
    "h-full",
    "inset-0",
    "bg-black/50",
    "flex",
    "items-center",
    "justify-center",
    "!hidden"
  );
  betterStylesModal.addEventListener("mousedown", (event) => {
    if (event.target === betterStylesModal) {
      event.preventDefault();
      hidden(betterStylesModal, true);
    }
  });
  gradioApp().appendChild(betterStylesModal);

  // Switch the modal theme to match the app.
  applyClasses(betterStylesModal, existsElement(".gradio-container.dark"), "dark");
  return betterStylesModal;
}

/**
 * Shows a modal with the specified content.
 * @param content - The content to show in the modal.
 */
export function showModal(content: HTMLElement) {
  const modal = getOrCreateModal();
  removeAllChild(modal);

  modal.appendChild(content);
  hidden(modal, false);
}

/**
 * Closes the modal containing the specified content, if it exists.
 * @param content - The content to close in the modal.
 */
export function closeModal(content: HTMLElement) {
  if (betterStylesModal?.removeChild(content)) {
    hidden(betterStylesModal, !betterStylesModal.hasChildNodes());
  }
}
