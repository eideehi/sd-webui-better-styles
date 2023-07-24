<script lang="ts">
  import { getContext } from "svelte";
  import { type BetterStylesContext, betterStylesContextKey } from "@/_logic/context";
  import MagnifyIcon from "~icons/mdi/magnify";

  let value = "";

  const { styleSearchKeyword } = getContext<BetterStylesContext>(betterStylesContextKey);

  function onInput(): void {
    styleSearchKeyword.set(value.toLowerCase());
  }
</script>

<label class="search-input input">
  <MagnifyIcon />
  <input type="text" bind:value on:input={onInput} />
</label>

<style lang="postcss">
  .search-input {
    @apply flex min-w-[min(24rem,100%)] flex-grow-[4] basis-0 items-center p-0;
  }

  .search-input > :global(.icon) {
    @apply ml-[--spacing-xl] text-[length:--text-xl];
  }

  .search-input > input {
    @apply w-full;
  }
</style>
