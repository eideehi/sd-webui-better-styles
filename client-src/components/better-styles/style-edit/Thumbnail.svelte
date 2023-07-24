<script lang="ts">
  import { createEventDispatcher, onDestroy } from "svelte";
  import { imagesDir, stylesUpdate } from "#/store";
  import { getElementAll } from "#/util/dom";
  import { sleep } from "#/util/lang";
  import * as t from "~/messages";
  import RangeInput from "./widgets/RangeInput.svelte";
  import ImageCrop from "./widgets/ImageCrop.svelte";
  import NumberInput from "./widgets/NumberInput.svelte";
  import EditIcon from "~icons/mdi/pencil";
  import DeleteIcon from "~icons/mdi/delete";

  export let galleryId: string;
  export let image: Nullable<string>;

  const dispatch = createEventDispatcher<{ update: Nullable<Blob> }>();

  let originalThumbnail = "";
  let thumbnails: string[] = [];

  let imageUrl = "";
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let previewUrl = "";
  let editMode = false;

  let listWidth = 0;
  let gridCols: number;
  $: gridCols = Math.floor((listWidth - 20) / (128 + 10));

  const onOutput = ({ detail }: CustomEvent<HTMLCanvasElement>) => {
    previewUrl = detail.toDataURL();
    detail.toBlob((blob) => dispatch("update", blob));
  };

  const deleteThumbnail = () => {
    imageUrl = "";
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    previewUrl = "";
    dispatch("update", null);
  };

  const thumbnailScaleChange = (event: WheelEvent) => {
    const direction = event.deltaY < 0 ? 1 : -1;
    if (direction > 0 && scale >= 2) return;
    if (direction < 0 && scale <= 0.1) return;

    const step = 0.1;
    scale = (scale * 1000 + step * 1000 * direction) / 1000;
  };

  $: if (image != null) {
    originalThumbnail = `file=${$imagesDir}/${image}?ts=${$stylesUpdate}`;
    imageUrl = originalThumbnail;
  }

  let updateTimer = window.setTimeout(function updateThumbnails() {
    const selector = `#${galleryId} div:not(.thumbnails) > .thumbnail-item > img`;

    let _thumbnails = getElementAll(selector).map((element) => (element as HTMLImageElement).src);
    if (originalThumbnail.length > 0) {
      _thumbnails = [originalThumbnail, ..._thumbnails];
    }

    if (_thumbnails.length !== thumbnails.length) {
      thumbnails = _thumbnails;
    } else {
      for (let i = 0; i < _thumbnails.length; i++) {
        if (_thumbnails[i] === thumbnails[i]) continue;
        thumbnails = _thumbnails;
        break;
      }
    }

    updateTimer = window.setTimeout(updateThumbnails, 500);
  }, 10);

  onDestroy(() => {
    window.clearTimeout(updateTimer);
  });
</script>

<div class="thumbnail">
  <span>{t.Thumbnail()}</span>
  <div class="content-wrapper">
    {#await sleep(250) then}
      {#if thumbnails.length > 0}
        <div
          class="image-list"
          bind:offsetWidth={listWidth}
          style:--grid-cols="repeat({gridCols},1fr)"
        >
          {#each thumbnails as thumbnail (thumbnail)}
            <button
              class="image-item"
              class:selected={imageUrl === thumbnail}
              on:click={() => (imageUrl = thumbnail)}
            >
              <img src={thumbnail} alt="" draggable="false" />
            </button>
          {/each}
        </div>
      {/if}

      {#if previewUrl.length > 0}
        <div class="preview" class:active={!editMode}>
          <div class="tools">
            <button
              class="edit-thumbnail"
              title={t.EditThumbnail()}
              on:click={() => (editMode = true)}
            >
              <EditIcon />
            </button>
            <button class="delete-thumbnail" title={t.UnsetThumbnail()} on:click={deleteThumbnail}>
              <DeleteIcon />
            </button>
          </div>
          <img src={previewUrl} alt="Thumbnail preview" draggable="false" />
        </div>
      {/if}

      {#if imageUrl.length > 0}
        <div class="thumbnail-editor" class:active={editMode}>
          <div class="image-crop-wrapper" on:wheel|preventDefault={thumbnailScaleChange}>
            <ImageCrop {imageUrl} bind:scale bind:offsetX bind:offsetY on:output={onOutput} />
          </div>
          <div class="controls">
            <RangeInput label="Scale" bind:value={scale} max={2} min={0.1} step={0.1} />
            <NumberInput label="X Offset" bind:value={offsetX} />
            <NumberInput label="Y Offset" bind:value={offsetY} />
            <button class="button lg secondary" on:click={() => (editMode = false)}>
              {t.CloseThumbnailEditor()}
            </button>
          </div>
        </div>
      {/if}

      <div class="message-container">
        {#if thumbnails.length === 0}
          <p>{t.ThumbnailEmpty()}</p>
        {:else if previewUrl.length === 0}
          <p>{t.ThumbnailNotSet()}</p>
        {/if}
      </div>
    {/await}
  </div>
</div>

<style lang="postcss">
  .thumbnail {
    @apply min-w-[min(576px,100%)];
  }

  .content-wrapper {
    @apply flex w-full flex-wrap gap-[--spacing-xl] rounded-[--input-radius] p-[--block-padding] [background:--panel-background-fill];
  }

  .image-list {
    @apply grid max-h-[368px] grid-cols-[--grid-cols] gap-[--spacing-xl] overflow-y-auto rounded-[--button-small-radius] border-[length:--block-border-width] border-[--block-border-color] p-[--spacing-xl] [background:--input-background-fill] [box-shadow:--block-shadow];
  }

  .image-item {
    @apply inline-block aspect-square cursor-pointer select-none overflow-hidden rounded-[--button-small-radius] border border-[--border-color-primary] outline-none outline outline-2 outline-offset-1 transition-[outline] ease-linear [background:--background-fill-secondary];
    box-shadow: 0 0 0 2px var(--ring-color), var(--shadow-drop);
  }

  .image-item.selected {
    @apply outline-[--color-accent];
  }

  .image-item:not(.selected):hover {
    @apply outline-[--input-background-fill-focus];
  }

  .image-item > img {
    @apply object-cover transition-transform duration-500 ease-out;
  }

  .image-item:hover > img {
    transform: scale(1.05);
  }

  .preview {
    @apply relative flex w-full items-center justify-center rounded-[--radius-lg] border-[length:--block-border-width] border-[--block-border-color] px-0 py-[--spacing-xxl] [background:--input-background-fill] [box-shadow:--block-shadow];
  }

  .preview > .tools {
    @apply absolute end-[--spacing-xl] top-[--spacing-xl] flex items-center justify-center gap-[--spacing-xl] text-[length:--text-xl];
  }

  .preview > .tools > button:hover {
    @apply text-[red];
  }

  .preview > img {
    @apply aspect-square w-[min(256px,100%)] rounded-[--radius-lg] bg-[purple];
  }

  .thumbnail-editor {
    @apply flex w-full flex-wrap gap-[--spacing-xl];
  }

  .image-crop-wrapper {
    @apply flex aspect-square min-w-[min(320px,100%)] flex-grow-[2] basis-0 rounded-[--container-radius] border-[length:--panel-border-width] border-[--panel-border-color];
  }

  .controls {
    @apply flex min-w-[min(244px,100%)] flex-grow basis-0 flex-col;
  }

  .controls > :global(*) {
    @apply flex-grow-0;
  }

  .controls > :global(:not(:first-child)) {
    @apply mt-[--spacing-xl];
  }

  .message-container {
    @apply flex h-[128px] w-full items-center justify-center rounded-[--radius-lg] border-[length:--block-border-width] border-[--block-border-color] px-0 py-[--spacing-xxl] [background:--input-background-fill] [box-shadow:--block-shadow];
  }

  .message-container:empty {
    @apply hidden;
  }

  .message-container > p {
    @apply w-[75%] text-[length:--text-xl];
  }

  :not(.active):is(.preview, .thumbnail-editor) {
    @apply hidden;
  }
</style>
