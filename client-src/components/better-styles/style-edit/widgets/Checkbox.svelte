<script lang="ts">
  export let label: string;
  export let title: Nullable<string> = null;
  export let value: Nullable<boolean>;
</script>

<label class="checkbox">
  <input class="checkbox-input" type="checkbox" bind:checked={value} />
  <span class="label" {title}>{label}</span>
</label>

<style lang="postcss">
  .checkbox {
    @apply cursor-pointer;
  }

  .checkbox > .label {
    @apply ms-[--size-2];
  }

  .checkbox-input {
    --ring-color: transparent;
    @apply relative inline-block h-4 w-4 flex-shrink-0 select-none appearance-none rounded-[--checkbox-border-radius] border border-[--checkbox-border-color] bg-[--checkbox-background-color] bg-origin-border p-0 align-middle leading-[--line-sm] text-[#2563eb] [box-shadow:--input-shadow];
  }

  .checkbox-input:checked {
    @apply border-[--checkbox-border-color-selected] bg-[--checkbox-background-color-selected] bg-[image:--checkbox-check];
  }

  .checkbox:not(.disabled) > .checkbox-input:not(:checked):hover {
    @apply border-[--checkbox-border-color-hover] bg-[--checkbox-background-color-hover];
  }
</style>
