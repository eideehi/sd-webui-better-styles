declare module "#/modal/Modal.svelte" {
  export { SvelteComponentDev as default } from "svelte/internal";

  export interface ModalApi {
    open(onClose?: Callback): void;
    close(): void;
  }

  export function getModal(id: string): Nullable<ModalApi>;
}
