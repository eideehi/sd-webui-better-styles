<script context="module" lang="ts">
  import type { ModalApi } from "#/modal/Modal.svelte";

  const modals: Record<string, ModalApi> = {};

  export function getModal(id: string): Nullable<ModalApi> {
    return modals[id];
  }
</script>

<script lang="ts">
  import { onDestroy } from "svelte";
  import { isDarkMode } from "@/libs/util";

  export let id = "";

  let container: HTMLElement;
  let visible = false;
  let onCloseCallback: Nullable<Callback>;

  if (modals[id]) {
    modals[id].close();
  }

  export function open(onClose?: Callback): void {
    visible = true;
    onCloseCallback = onClose;
  }

  export function close(): void {
    visible = false;
    if (onCloseCallback != null) {
      onCloseCallback();
    }
  }

  modals[id] = { open, close };

  $: if (visible && container) {
    container.parentNode?.removeChild(container);
    document.body.append(container);
  }

  onDestroy(() => {
    delete modals[id];
  });
</script>

{#if visible}
  <div class="modal-container" class:dark={isDarkMode()} bind:this={container}>
    <slot />
  </div>
{/if}

<style lang="postcss">
  .modal-container {
    @apply fixed left-0 top-0 z-[1001] h-full w-full;
  }
</style>
