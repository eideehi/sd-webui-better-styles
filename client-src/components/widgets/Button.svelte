<script lang="ts">
  export let primary = false;
  export let options: {
    disabled?: boolean;
  } = {};
</script>

<button {...options} class="button lg" class:primary class:secondary={!primary} on:click>
  <slot />
</button>

<style lang="postcss">
  .button {
    @apply inline-flex cursor-pointer items-center justify-center px-[var(--size-2)] py-[var(--size-0-5)] text-center;
    transition: var(--button-transition);
    box-shadow: var(--button-shadow);
    border-width: var(--button-border-width);
    border-style: solid;
  }

  .button[disabled] {
    @apply cursor-default opacity-50;
  }

  .button.lg {
    @apply rounded-[var(--button-large-radius)] p-[var(--button-large-padding)] font-[var(--button-large-text-weight)];
    font-size: var(--button-large-text-size);
  }

  .button.primary {
    @apply border-[var(--button-primary-border-color)] text-[var(--button-primary-text-color)];
    background: var(--button-primary-background-fill);
  }

  .button.primary:not([disabled]):hover {
    @apply border-[var(--button-primary-border-color-hover)] text-[var(--button-primary-text-color-hover)];
    background: var(--button-primary-background-fill-hover);
  }

  .button.secondary {
    @apply border-[var(--button-secondary-border-color)] text-[var(--button-secondary-text-color)];
    background: var(--button-secondary-background-fill);
  }

  .button.secondary:not([disabled]):hover {
    @apply border-[var(--button-secondary-border-color-hover)] text-[var(--button-secondary-text-color-hover)];
    background: var(--button-secondary-background-fill-hover);
  }
</style>
