<script lang="ts">
  import { getContext } from "svelte";
  import { _ } from "@/libs/util";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/context";
  import Button from "#/widgets/Button.svelte";

  const { activeBetterStyles } = getContext<BetterStylesContext>(betterStylesContextKey);
  function closeBetterStyles(): void {
    activeBetterStyles.set(false);
  }
</script>

<Button on:click={closeBetterStyles}>{_("Close Better Styles")}</Button>
