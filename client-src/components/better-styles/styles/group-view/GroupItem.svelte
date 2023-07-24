<script lang="ts">
  import { getContext } from "svelte";
  import { Message } from "~/message";
  import { betterStylesContextKey, type BetterStylesContext } from "@/_logic/context";

  export let value: string;

  const { activeGroup, selectedStyles } = getContext<BetterStylesContext>(betterStylesContextKey);

  let label: string;
  $: label = Message(`better-styles.group.${value}`, value)();

  let selected: boolean;
  $: selected = $activeGroup === value;

  function onClick(): void {
    selectedStyles.set([]);
    activeGroup.set(value);
  }
</script>

<button class="group-item button lg secondary" on:click={onClick} disabled={selected}>
  {label}
</button>

<style lang="postcss">
  .group-item:disabled {
    @apply cursor-default opacity-100 [background:none];
  }
</style>
