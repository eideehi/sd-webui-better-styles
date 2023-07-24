<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { No, Yes } from "~/messages";
  import ModalDialog from "./ModalDialog.svelte";
  import ConfirmIcon from "~icons/mdi/check";
  import CancelIcon from "~icons/mdi/cancel";

  export let show: boolean;
  export let messages: { main?: string; confirm?: string; cancel?: string };

  const { main, confirm, cancel } = Object.assign({ confirm: Yes(), cancel: No() }, messages);

  const dispatch = createEventDispatcher<{ confirm: void; cancel: void }>();

  const onConfirm = (): void => {
    dispatch("confirm");
    show = false;
  };

  const onCancel = (): void => {
    dispatch("cancel");
    show = false;
  };
</script>

<ModalDialog bind:show options={{ hideCloseButton: true }}>
  <div class="confirm-dialog">
    <slot>
      <p class="text">{main}</p>
    </slot>
    <div class="buttons">
      <button class="button lg primary" on:click={onConfirm}>
        <ConfirmIcon />
        {confirm}
      </button>
      <button class="button lg secondary" on:click={onCancel}>
        <CancelIcon />
        {cancel}
      </button>
    </div>
  </div>
</ModalDialog>

<style lang="postcss">
  .confirm-dialog {
    --local-spacing-2xl: calc(var(--spacing-xxl) * 2);
    @apply flex max-w-[768px] flex-col gap-[--local-spacing-2xl] p-[--local-spacing-2xl];
  }

  .text {
    @apply m-0 text-xl;
  }

  .buttons {
    @apply flex gap-[--spacing-xxl];
  }

  .button {
    @apply flex flex-grow basis-0 gap-[--spacing-lg];
  }

  .button > :global(.icon) {
    @apply text-[length:--text-xl];
  }
</style>
