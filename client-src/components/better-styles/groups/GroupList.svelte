<script lang="ts">
  import { checkpoint, styleGroups } from "@/libs/store";
  import { hasVisibleStyles } from "@/libs/styles";
  import GroupSelector from "#/better-styles/groups/GroupSelector.svelte";

  let visibleGroups: string[];
  $: {
    visibleGroups = $styleGroups
      .filter((group) => hasVisibleStyles(group, $checkpoint))
      .map((group) => group.name)
      .sort((a, b) => a.localeCompare(b));
  }
</script>

<div>
  {#if visibleGroups.length === 0}
    <GroupSelector group="default" />
  {:else}
    {#each visibleGroups as group}
      <GroupSelector {group} />
    {/each}
  {/if}
</div>
