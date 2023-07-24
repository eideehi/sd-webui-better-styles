<script lang="ts">
  import { getContext } from "svelte";
  import { imagesDir, stylesUpdate } from "#/store";
  import type { Style } from "#/styles";
  import { ThumbnailAlt } from "~/messages";
  import {
    type BetterStylesContext,
    type GroupedStyle,
    betterStylesContextKey,
  } from "@/_logic/context";
  import ShowStyleDetails from "./widgets/ShowStyleDetails.svelte";
  import EditStyle from "./widgets/EditStyle.svelte";
  import DeleteStyle from "./widgets/DeleteStyle.svelte";
  import ApplyStyle from "./widgets/ApplyStyle.svelte";

  export let style: GroupedStyle;

  const { activeGroup, styleSearchKeyword, selectedStyles } =
    getContext<BetterStylesContext>(betterStylesContextKey);

  let styleValue: Style;
  $: styleValue = style.style;

  let title: string;
  $: title = $activeGroup === "all" ? `[${style.group}] ${styleValue.name}` : styleValue.name;

  let thumbnail: string;
  $: if (styleValue.image != null) {
    thumbnail = `file=${$imagesDir}/${styleValue.image}?ts=${$stylesUpdate}`;
  } else {
    thumbnail = "file=html/card-no-preview.png";
  }

  let active: boolean;
  $: active = styleValue.name.toLowerCase().includes($styleSearchKeyword);

  let selected: boolean;
  $: selected = $selectedStyles.includes(style);

  function toggleSelect(): void {
    if (selected) {
      selectedStyles.update((styles) => styles.filter((value) => value !== style));
    } else {
      selectedStyles.update((styles) => [...styles, style]);
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="style-item" class:active class:selected on:click={toggleSelect}>
  <ShowStyleDetails group={style.group} style={styleValue} />
  <img class="thumbnail" src={thumbnail} alt={ThumbnailAlt(styleValue.name)} draggable="false" />
  <div class="actions">
    <div class="action-container">
      <EditStyle {style} />
      <ApplyStyle style={styleValue} />
      <DeleteStyle group={style.group} styleName={styleValue.name} />
    </div>
    <span class="label" {title}>
      {styleValue.name}
    </span>
  </div>
</div>

<style lang="postcss">
  .style-item {
    @apply relative inline-block aspect-square cursor-pointer select-none overflow-hidden rounded-[--button-small-radius] border border-[--border-color-primary] outline outline-[3px] outline-offset-1 outline-transparent transition-[outline] ease-linear;
    box-shadow: 0 0 5px rgba(128, 128, 128, 0.5);
  }

  .style-item:not(.active) {
    @apply hidden;
  }

  .style-item.selected {
    @apply outline-[--color-accent];
  }

  .style-item:not(.selected):hover {
    @apply outline-[--input-background-fill-focus];
  }

  .style-item > :global(.show-details) {
    @apply absolute right-1 top-0.5 z-[--layer-4] hidden text-[length:--text-xxl] text-white;
  }

  .style-item > :global(.show-details > .icon) {
    filter: drop-shadow(2px 2px 1px rgba(0, 0, 0, 0.5));
  }

  .style-item:hover > :global(.show-details) {
    @apply inline-block;
  }

  .style-item:hover > :global(.show-details:hover) {
    @apply text-[red];
  }

  .thumbnail {
    @apply absolute h-full w-full object-cover transition-transform duration-500 ease-out;
  }

  .style-item:hover .thumbnail {
    transform: scale(1.05);
  }

  .actions {
    @apply absolute inset-x-0 bottom-0 flex flex-col gap-[--spacing-sm] bg-black/50 p-2 text-white;
    box-shadow: 0 0 0.25em 0.25em rgba(0, 0, 0, 0.5);
    text-shadow: 0 0 0.2em black;
  }

  .action-container {
    @apply hidden;
  }

  .actions:hover > .action-container {
    @apply block;
  }

  .action-container > :global(.widget) {
    @apply p-1 text-[length:--text-xl] text-[--body-text-color] text-white;
  }

  .action-container > :global(.widget:hover) {
    @apply text-[red];
  }

  .label {
    @apply truncate text-xl;
  }
</style>
