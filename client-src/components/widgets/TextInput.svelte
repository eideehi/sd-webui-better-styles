<script lang="ts">
  export let value = "";
  export let options: {
    placeholder?: string;
    rows?: number;
  } = {};

  const defaultOptions = {
    rows: 1,
  };
  const mergedOptions = Object.assign(Object.assign({}, defaultOptions), options);
</script>

<textarea {...mergedOptions} bind:value class="text-input scroll-hide" on:change on:input />

<style lang="postcss">
  .text-input {
    @apply relative block w-full resize-none rounded-[var(--input-radius)] border-solid border-[var(--input-border-color)] p-[var(--input-padding)] font-[var(--input-text-weight)] leading-[var(--line-sm)] text-[var(--body-text-color)] outline-none;
    background: var(--input-background-fill);
    box-shadow: var(--input-shadow);
    border-width: var(--input-border-width);
    font-size: var(--input-text-size);
  }

  .text-input:focus {
    box-shadow: var(--input-shadow-focus);
    border-color: var(--input-border-color-focus);
  }
</style>
