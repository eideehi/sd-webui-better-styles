<script lang="ts">
  export let label: string;
  export let value: Nullable<number>;
</script>

<label class="number-input">
  <span>{label}</span>
  <input class="input" type="number" bind:value />
</label>

<style lang="postcss">
  .number-input {
    @apply flex flex-col;
  }
</style>
