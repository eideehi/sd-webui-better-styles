<script lang="ts">
  import Modal, { getModal } from "#/modal/Modal.svelte";

  export let id: string;
  export let options: {
    hiddenCloseButton?: boolean;
    closeOnClickOutside?: boolean;
  } = {};

  let dialog: HTMLElement;

  function closeModal(): void {
    getModal(id)?.close();
  }

  function clickOutside(event: MouseEvent): void {
    if (options.closeOnClickOutside === false) return;
    if (!(event.target instanceof Node)) return;
    if (!dialog.contains(event.target)) {
      closeModal();
    }
  }
</script>

{#if id}
  <Modal {id}>
    <div class="outside" on:click={clickOutside}>
      <div bind:this={dialog} class="dialog">
        {#if !options.hiddenCloseButton}
          <button class="close-button" on:click={closeModal}>×</button>
        {/if}
        <div>
          <slot />
        </div>
      </div>
    </div>
  </Modal>
{/if}

<style lang="postcss">
  .outside {
    @apply flex h-full w-full items-center justify-center bg-black/75;
  }

  .dialog {
    @apply relative w-[clamp(20rem,70vw,48rem)] rounded border border-solid border-[var(--input-border-color)];
    background: var(--body-background-fill);
    color: var(--button-secondary-text-color);
    box-shadow: 0 0 4px 0.25rem rgb(8 8 8 / 50%);
  }

  .dialog > .close-button {
    @apply absolute -right-14 -top-14 cursor-pointer border-none bg-transparent text-6xl text-white;
  }
</style>
