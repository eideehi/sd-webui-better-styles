<script lang="ts">
  import { getContext } from "svelte";
  import { ShowHideComponent } from "~/messages";
  import { type BetterStylesContext, betterStylesContextKey } from "./_logic/context";

  export let baseElement: HTMLElement;

  let classList = Array.from(baseElement.classList).filter(
    (clazz) => clazz !== "better-styles-hidden"
  );

  const { active } = getContext<BetterStylesContext>(betterStylesContextKey);

  function toggleActive(): void {
    active.set(!$active);
  }
</script>

<button class={classList.join(" ")} on:click={toggleActive} title={ShowHideComponent()}>
  🔖
</button>
