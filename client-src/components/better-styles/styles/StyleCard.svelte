<script lang="ts">
  import { getContext } from "svelte";
  import { _ } from "@/libs/util";
  import { registerStyle } from "@/libs/api";
  import { imagesDir, styleGroups, stylesUpdate } from "@/libs/store";
  import { selectedImage } from "@/libs/prompt-style";
  import { showToast } from "@/libs/util/toast";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/context";
  import { getModal } from "#/modal/Modal.svelte";
  import { generateId } from "@/libs/util/modal";
  import StyleDetailDialog from "#/better-styles/styles/StyleDetailDialog.svelte";

  export let style: Style;

  const id = generateId();

  const { tabName, activeGroup, styleSearchKeyword, selectedStyles } =
    getContext<BetterStylesContext>(betterStylesContextKey);

  let thumbnail: string;
  $: if (style.image != null) {
    thumbnail = `file=${$imagesDir}/${style.image}?ts=${$stylesUpdate}`;
  } else {
    thumbnail = "file=html/card-no-preview.png";
  }

  let active: boolean;
  $: active = style.name.toLowerCase().includes($styleSearchKeyword);

  let selected: boolean;
  $: selected = $selectedStyles.includes(style);

  function selectStyle(): void {
    if (selected) {
      selectedStyles.update((styles) => styles.filter((_style) => _style !== style));
    } else {
      selectedStyles.update((styles) => [...styles, style]);
    }
  }

  function showStylesDetail(): void {
    getModal(id)?.open();
  }

  async function replaceThumbnail(): Promise<void> {
    const image = selectedImage(tabName).getOrDefault("");
    if (!image) {
      showToast({ type: "warning", text: _("Image is not selected") });
      return;
    }

    await registerStyle($activeGroup, { ...style, image }).then(styleGroups.set);
  }
</script>

<StyleDetailDialog {id} {style} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="card" class:active class:selected on:click={selectStyle}>
  <button
    class="show-detail-button"
    on:click|stopPropagation={showStylesDetail}
    title={_("Show styles detail")}
  />
  <img alt="{style.name} - Thumbnail" class="image" draggable="false" src={thumbnail} />
  <div class="actions">
    <a class="replace-preview" href="/#" on:click|preventDefault|stopPropagation={replaceThumbnail}>
      {_("replace thumbnail")}
    </a>
    <span class="label" title={style.name}>
      {style.name}
    </span>
  </div>
</div>

<style lang="postcss">
  .card {
    @apply relative m-2 inline-block h-64 w-64 cursor-pointer select-none overflow-hidden rounded;
    box-shadow: 0 0 5px rgba(128, 128, 128, 0.5);
  }

  .card:not(.active) {
    @apply hidden;
  }

  .card:not(.selected):hover {
    box-shadow: 0 0 2px 0.3em rgba(0, 128, 255, 0.35);
  }

  .card.selected {
    @apply outline outline-2 outline-offset-2 outline-[#ff7c00];
  }

  .card > .show-detail-button {
    @apply absolute right-4 z-10 hidden w-6 p-1 text-[22pt] text-white;
    text-shadow: 2px 2px 3px black;
  }

  .card:hover > .show-detail-button {
    @apply inline-block;
  }

  .card:hover > .show-detail-button:hover {
    color: red;
  }

  .card:hover > .show-detail-button::before {
    @apply content-["🛈"];
  }

  .card > .image {
    @apply absolute h-full w-full object-cover transition-transform duration-500 ease-out;
  }

  .card:hover > .image {
    transform: scale(1.05);
  }

  .card > .actions {
    @apply absolute inset-x-0 bottom-0 flex flex-col bg-black/50 p-2 text-white;
    box-shadow: 0 0 0.25em 0.25em rgba(0, 0, 0, 0.5);
    text-shadow: 0 0 0.2em black;
  }

  .actions > .replace-preview {
    @apply mb-3 ml-1 mt-1 hidden text-sm;
  }

  .actions > .replace-preview:hover {
    color: red;
  }

  .actions:hover > .replace-preview {
    display: inherit;
  }

  .actions > .label {
    @apply truncate text-xl;
  }
</style>
