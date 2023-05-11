<script lang="ts">
  import { getContext } from "svelte";
  import { _ } from "@/libs/util";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/context";

  export let baseElement: HTMLElement;

  let classList = Array.from(baseElement.classList).filter((clazz) => clazz !== "force-hidden");

  const { activeBetterStyles } = getContext<BetterStylesContext>(betterStylesContextKey);

  function toggleActive(): void {
    activeBetterStyles.set(!$activeBetterStyles);
  }
</script>

<button class={classList.join(" ")} on:click={toggleActive} title={_("Show Better Styles")}>
  🔖
</button>
