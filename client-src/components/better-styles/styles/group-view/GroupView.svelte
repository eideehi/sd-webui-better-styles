<script lang="ts">
  import { getContext } from "svelte";
  import { checkpoint, styleGroups } from "#/store";
  import type { StyleGroup } from "#/styles";
  import { type BetterStylesContext, betterStylesContextKey } from "@/_logic/context";
  import GroupItem from "./GroupItem.svelte";

  const { activeGroup } = getContext<BetterStylesContext>(betterStylesContextKey);

  type SortedStyleGroup = {
    visible: boolean;
    hasCheckpointExcludive: boolean;
    value: StyleGroup;
  };

  function sortingStyleGroup(group: StyleGroup, checkpoint: string): SortedStyleGroup {
    let visible = false;
    let hasCheckpointExcludive = true;
    group.styles.forEach((style) => {
      if (visible && hasCheckpointExcludive) return;
      if (style.checkpoint == null) {
        visible = true;
      } else {
        hasCheckpointExcludive = true;
        if (style.checkpoint.startsWith(checkpoint)) {
          visible = true;
        }
      }
    });
    return { visible, hasCheckpointExcludive, value: group };
  }

  function sortingStyleGroupAll(groups: StyleGroup[], checkpoint: string): SortedStyleGroup[] {
    return groups
      .filter((value) => value.styles.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((value) => sortingStyleGroup(value, checkpoint));
  }

  let sortedStyleGroups: SortedStyleGroup[];
  $: sortedStyleGroups = sortingStyleGroupAll($styleGroups, $checkpoint);

  $: {
    const groupNames = sortedStyleGroups
      .filter(({ visible }) => visible)
      .map((value) => value.value.name);
    if (!["all", ...groupNames].includes($activeGroup)) {
      activeGroup.set(groupNames.length > 0 ? groupNames[0] : "default");
    }
  }
</script>

<div class="group-view">
  {#if sortedStyleGroups.length === 0}
    <GroupItem value="default" />
  {:else}
    {#if sortedStyleGroups.length >= 2 && sortedStyleGroups.some((value) => value.hasCheckpointExcludive)}
      <GroupItem value="all" />
    {/if}
    {#each sortedStyleGroups.filter(({ visible }) => visible) as { value } (value.name)}
      <GroupItem value={value.name} />
    {/each}
  {/if}
</div>

<style lang="postcss">
  .group-view {
    @apply flex flex-wrap gap-[--spacing-lg] py-[--spacing-xl];
  }
</style>
