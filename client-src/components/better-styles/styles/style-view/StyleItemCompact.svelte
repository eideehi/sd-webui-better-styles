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
<div class="style-item-compact" class:active class:selected on:click={toggleSelect}>
  <img class="thumbnail" src={thumbnail} alt={ThumbnailAlt(styleValue.name)} draggable="false" />
  <div class="data">
    <span class="label" {title}>
      {styleValue.name}
    </span>
    <div class="actions">
      <EditStyle {style} />
      <ApplyStyle style={styleValue} />
      <DeleteStyle group={style.group} styleName={styleValue.name} />
      <ShowStyleDetails group={style.group} style={styleValue} />
    </div>
  </div>
</div>

<style lang="postcss">
  .style-item-compact {
    @apply flex h-[80px] w-[clamp(244px,100vw,320px)] cursor-pointer rounded-[--button-small-radius] outline outline-[3px] outline-offset-2 outline-transparent transition-[outline] ease-linear;
  }

  .style-item-compact.selected {
    @apply outline-[--color-accent];
  }

  .style-item-compact:not(.selected):hover {
    @apply outline-[--input-background-fill-focus];
  }

  .thumbnail {
    @apply aspect-square rounded-[--radius-lg] object-cover;
  }

  .data {
    @apply flex flex-col justify-evenly overflow-hidden px-[--spacing-xxl];
  }

  .label {
    @apply truncate text-xl;
  }

  .actions {
    @apply flex gap-[--spacing-lg];
  }

  .actions > :global(.widget) {
    @apply p-0 text-[length:--text-xl];
  }

  .actions > :global(.widget:hover) {
    @apply text-[red];
  }

  .style-item-compact:not(:hover) .actions {
    @apply opacity-10;
  }
</style>
