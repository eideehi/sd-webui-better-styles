<script lang="ts">
  import { getContext, setContext } from "svelte";
  import { writable } from "svelte/store";
  import { checkpoint, styleGroups } from "#/store";
  import type { Style, StyleGroup } from "#/styles";
  import { sleep } from "#/util/lang";
  import { NoAvailableStyles, StylesNotRegistered } from "~/messages";
  import {
    type BetterStylesContext,
    type GroupedStyle,
    betterStylesContextKey,
  } from "@/_logic/context";
  import { styleViewContextKey, type StyleViewContext, type LayoutMode } from "./_logic/context";
  import Tools from "./tools/Tools.svelte";
  import StyleItem from "./StyleItem.svelte";
  import StyleItemCompact from "./StyleItemCompact.svelte";

  function isVisibleStyle(style: Style, checkpoint?: string): boolean {
    const { checkpoint: cp } = style;
    return checkpoint == null || cp == null || cp.startsWith(checkpoint);
  }

  function groupingStyles(group: StyleGroup, checkpoint?: string): GroupedStyle[] {
    const groupedStyles: GroupedStyle[] = [];
    group.styles
      .filter((value) => isVisibleStyle(value, checkpoint))
      .forEach((value) => {
        groupedStyles.push({ group: group.name, style: value });
      });
    return groupedStyles;
  }

  function getActiveStyles(
    allStyles: StyleGroup[],
    activeGroup: string,
    checkpoint: string
  ): GroupedStyle[] {
    if (activeGroup === "all") {
      return allStyles.map((group) => groupingStyles(group)).flat();
    } else {
      const group = allStyles.find((value) => value.name === activeGroup);
      return group != null ? groupingStyles(group, checkpoint) : [];
    }
  }

  function loadStyles(styles: GroupedStyle[], offset: number, size: number): GroupedStyle[] {
    const loaded: GroupedStyle[] = [];
    const max = offset + size;
    for (let i = offset; i < max; i++) {
      if (i >= styles.length) break;
      loaded.push(styles[i]);
    }
    return loaded;
  }

  function sortStyles(styles: GroupedStyle[]): GroupedStyle[] {
    return styles.sort((a, b) => a.style.name.localeCompare(b.style.name));
  }

  const { activeGroup } = getContext<BetterStylesContext>(betterStylesContextKey);

  let layoutMode = writable<LayoutMode>("card");
  setContext<StyleViewContext>(styleViewContextKey, { layoutMode });

  let activeStyles: GroupedStyle[];
  $: activeStyles = getActiveStyles($styleGroups, $activeGroup, $checkpoint);

  let loadedStyles: GroupedStyle[] = [];
  let page = 0;
  let chunkSize = 32;

  $: {
    if (activeStyles.length > 0) {
      page = 0;
      loadedStyles = sortStyles(loadStyles(activeStyles, 0, chunkSize));
    } else {
      loadedStyles = [];
    }
  }

  let hasMoreStyle: boolean;
  $: hasMoreStyle = activeStyles.length > loadedStyles.length;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      page = page + 1;
      window.setTimeout(() => {
        loadedStyles = sortStyles([
          ...loadedStyles,
          ...loadStyles(activeStyles, page * chunkSize, chunkSize),
        ]);
      }, 150);
    });
  });

  let loadingMarker: Nullable<HTMLElement>;
  $: if (loadingMarker != null) {
    observer.observe(loadingMarker);
  }

  let listWidth = 0;
  let gridCols: number;
  $: gridCols = Math.floor((listWidth - 32) / (224 + 16));

  let gridRows: number;
  $: gridRows = Math.min(loadedStyles.length, 7);
</script>

<div class="style-view">
  {#await sleep(100) then}
    {#if loadedStyles.length > 0}
      <Tools />
      <div
        class="style-list"
        class:compact-mode={$layoutMode === "compact"}
        bind:offsetWidth={listWidth}
        style:--grid-cols="repeat({gridCols},1fr)"
        style:--grid-rows="repeat({gridRows},1fr)"
      >
        {#each loadedStyles as style (`${style.group}:${style.style.name}`)}
          <svelte:component this={$layoutMode === "card" ? StyleItem : StyleItemCompact} {style} />
        {/each}
        <div class="loading-marker" class:active={hasMoreStyle} bind:this={loadingMarker} />
      </div>
    {:else if $styleGroups.length === 0}
      <div class="empty-content">
        <p>{StylesNotRegistered()}</p>
      </div>
    {:else}
      <div class="empty-content">
        <p>{NoAvailableStyles()}</p>
      </div>
    {/if}
  {/await}
</div>

<style lang="postcss">
  .style-view {
    @apply border-t border-[--block-border-color];
  }

  .style-list {
    @apply grid grid-cols-[--grid-cols] gap-[--spacing-xxl] p-[--spacing-xxl];
  }

  .style-list.compact-mode {
    @apply grid-flow-col grid-cols-[repeat(auto-fill,minmax(320px,1fr))] grid-rows-[--grid-rows] overflow-x-auto;
  }

  .loading-marker {
    @apply h-64 w-64;
  }

  .loading-marker:not(.active) {
    @apply hidden;
  }

  .empty-content {
    @apply mx-2;
  }

  .empty-content > p {
    @apply mb-4 text-2xl;
  }
</style>
