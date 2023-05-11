import { type Readable, writable } from "svelte/store";

export type ToastType = "info" | "success" | "warning" | "error";

export type ToastMessage = {
  type?: ToastType;
  text: string;
  duration?: number;
};

const messages = writable<ToastMessage[]>([]);

export const toastMessages: Readable<ToastMessage[]> = messages;

export function showToast(message: ToastMessage): void {
  messages.update((value) => {
    if (value.some((_message) => _message.text === message.text)) return value;
    return [...value, Object.assign({ type: "info", duration: 3000 }, message)];
  });
}

export function closeToast(message: ToastMessage): void {
  messages.update((value) => value.filter((_message) => _message !== message));
}
