let betterStylesToast: HTMLElement | null = null;
let toastTimer = -1;

export type ToastType = "info" | "success" | "warning" | "error";

/**
 * Returns the existing toast element, or creates a new one if it doesn't exist.
 * @returns The toast element.
 */
function getOrCreateToast(): HTMLElement {
  if (betterStylesToast) {
    return betterStylesToast;
  }

  betterStylesToast = document.createElement("div");
  betterStylesToast.classList.add("better-styles", "toast");
  betterStylesToast.addEventListener("click", () => {
    closeToast();
  });

  gradioApp().appendChild(betterStylesToast);
  return betterStylesToast;
}

/**
 * Shows a toast message with the specified parameters.
 * @param message - The message to display in the toast.
 * @param type - The type of toast to display.
 * @param duration - The duration in milliseconds to display the toast.
 */
export function showToast(message: string, type: ToastType = "info", duration = 3000) {
  closeToast();

  const toast = getOrCreateToast();
  toast.classList.remove("toast-info", "toast-success", "toast-warning", "toast-error");
  toast.classList.add(`toast-${type}`);
  toast.textContent = message;

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
 * Closes the toast if it is currently open.
 */
export function closeToast() {
  if (toastTimer >= 0) {
    clearTimeout(toastTimer);
  }
  if (betterStylesToast) {
    gradioApp().removeChild(betterStylesToast);
    betterStylesToast = null;
  }
}
