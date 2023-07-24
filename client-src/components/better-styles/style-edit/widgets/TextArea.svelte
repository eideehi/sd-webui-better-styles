<script lang="ts">
  export let label: string;
  export let value: Nullable<string>;
  export let options: { rows?: number } = {};
</script>

<label class="text-area">
  <span>{label}</span>
  <textarea class="input" bind:value {...options} />
</label>

<style lang="postcss">
  .input {
    @apply resize-none p-[--input-padding];
  }
</style>
