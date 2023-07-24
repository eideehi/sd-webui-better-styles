<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import CloseIcon from "~icons/mdi/close-thick";

  export let show: boolean;
  export let options: { hideCloseButton?: boolean } = {};

  const { hideCloseButton } = Object.assign({ hideCloseButton: false }, options);

  const dispatch = createEventDispatcher<{ open: void; close: void }>();

  let dialog: Nullable<HTMLDialogElement>;

  let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== "attributes") return;
      if (mutation.attributeName !== "open") return;
      if (mutation.target !== dialog || dialog == null) return;
      if (dialog.open) {
        dispatch("open");
      }
    });
  });

  $: if (dialog != null) {
    document.body.append(dialog);

    observer.disconnect();
    observer.observe(dialog, { attributes: true });

    dialog.addEventListener("close", () => {
      show = false;
      dispatch("close");
    });
  }

  $: {
    if (show) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  }
</script>

{#if show}
  <dialog class="better-styles modal-dialog" bind:this={dialog}>
    <div class="content-wrapper">
      {#if !hideCloseButton}
        <button class="close-button" on:click={() => dialog?.close()}>
          <CloseIcon />
        </button>
      {/if}
      <slot />
    </div>
  </dialog>
{/if}

<style lang="postcss">
  .modal-dialog {
    @apply fixed overflow-hidden p-10 [background:none] [border:none] [font-family:--font] [outline:none];
  }

  .modal-dialog::backdrop {
    @apply [background:rgba(20,20,20,.75)];
  }

  .content-wrapper {
    @apply rounded border-2 border-[var(--input-border-color)] text-[--button-secondary-text-color] [background:--body-background-fill];
  }

  .close-button {
    @apply absolute right-0 top-0 cursor-pointer border-none bg-transparent text-[length:--text-xxl] text-white [outline:none];
  }
</style>
