<script lang="ts">
  import { getContext } from "svelte";
  import { _ } from "@/libs/util";
  import { checkpoint, styleGroups } from "@/libs/store";
  import { type Style, getVisibleStyles } from "@/libs/styles";
  import StyleCard from "#/better-styles/styles/StyleCard.svelte";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/context";

  const { activeGroup } = getContext<BetterStylesContext>(betterStylesContextKey);

  let styles: Style[];
  $: {
    const group = $styleGroups.find((group) => group.name === $activeGroup);
    styles = group != null ? getVisibleStyles(group, $checkpoint) : [];
  }
</script>

<div class="styles-cards">
  {#if styles.length === 0}
    <div class="no-cards">
      <p>{_('Style not yet registered. "Save style" button for register a new style.')}</p>
    </div>
  {:else}
    {#each styles as style}
      <StyleCard {style} />
    {/each}
  {/if}
</div>

<style lang="postcss">
  .no-cards {
    @apply mx-2;
  }

  .no-cards > p {
    @apply mb-4 text-2xl;
  }
</style>
