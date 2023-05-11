<script lang="ts">
  import TextInput from "#/widgets/TextInput.svelte";

  export let label: string;
  export let value = "";
  export let options: {
    placeholder?: string;
    rows?: number;
  } = {};
</script>

<div class="text-field">
  <span class="label">{label}</span>
  <TextInput bind:value on:change on:input {options} />
</div>

<style lang="postcss">
  .text-field > .label {
    @apply text-end;
  }

  .text-field > :global(textarea) {
    @apply w-auto;
  }
</style>
