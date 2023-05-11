<script lang="ts">
  export let label: string;
  export let value = false;
  export let options: {
    disabled?: boolean;
  } = {};
</script>

<label class="checkbox" class:disabled={options.disabled}>
  <input class="input" {...options} bind:checked={value} on:change type="checkbox" />
  <span class="label">{label}</span>
</label>

<style lang="postcss">
  .checkbox {
    @apply cursor-pointer;
  }

  .checkbox.disabled {
    @apply cursor-default opacity-50;
  }

  .checkbox > .label {
    margin-left: var(--size-2);
  }

  .input {
    @apply relative inline-block h-4 w-4 flex-shrink-0 select-none appearance-none rounded-[var(--checkbox-border-radius)] border border-solid border-[var(--checkbox-border-color)] bg-[var(--checkbox-background-color)] bg-origin-border p-0 align-middle leading-[var(--line-sm)] text-[#2563eb];
    --ring-color: transparent;
    box-shadow: var(--input-shadow);
  }

  .input:checked {
    @apply border-[var(--checkbox-border-color-selected)] bg-[var(--checkbox-background-color-selected)];
    background-image: var(--checkbox-check);
  }

  .checkbox:not(.disabled) > .input:not(:checked):hover {
    @apply border-[var(--checkbox-border-color-hover)] bg-[var(--checkbox-background-color-hover)];
  }
</style>
