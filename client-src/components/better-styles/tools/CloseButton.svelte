<script lang="ts">
  import { getContext } from "svelte";
  import { _ } from "@/libs/util";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/_logic/context";
  import Button from "#/widgets/Button.svelte";

  const { isBetterStylesActive } = getContext<BetterStylesContext>(betterStylesContextKey);
  function closeBetterStyles(): void {
    isBetterStylesActive.set(false);
  }
</script>

<Button on:click={closeBetterStyles}>{_("Close Better Styles")}</Button>
