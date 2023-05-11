<script lang="ts">
  import { getContext } from "svelte";
  import { _ } from "@/libs/util";
  import Button from "#/widgets/Button.svelte";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/context";

  export let group: string;

  const { activeGroup, selectedStyles } = getContext<BetterStylesContext>(betterStylesContextKey);

  function onClick(): void {
    selectedStyles.set([]);
    activeGroup.set(group);
  }
</script>

<div class="group">
  <Button on:click={onClick} options={{ disabled: $activeGroup === group }}>
    {_(group)}
  </Button>
</div>

<style lang="postcss">
  .group {
    @apply inline-block;
  }

  .group > :global(button) {
    @apply m-[0.3rem];
  }

  .group > :global(button[disabled]) {
    @apply border-[var(--button-primary-border-color)] opacity-100;
    background: none;
  }
</style>
