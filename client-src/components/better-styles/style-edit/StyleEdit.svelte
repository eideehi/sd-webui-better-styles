<script lang="ts">
  import { getContext } from "svelte";
  import * as api from "#/api";
  import { styleGroups } from "#/store";
  import type { Style, StyleGroup } from "#/styles";
  import { hasElement } from "#/util/dom";
  import * as t from "~/messages";
  import { showToast } from "%/Toast.svelte";
  import {
    type BetterStylesContext,
    type GroupedStyle,
    betterStylesContextKey,
  } from "@/_logic/context";
  import Group from "./Group.svelte";
  import DropdownField from "./DropdownField.svelte";
  import RangeField from "./RangeField.svelte";
  import Thumbnail from "./Thumbnail.svelte";
  import CheckpointExclusive from "./CheckpointExclusive.svelte";
  import TextField from "./TextField.svelte";
  import Checkbox from "./widgets/Checkbox.svelte";
  import NumberInput from "./widgets/NumberInput.svelte";
  import TextArea from "./widgets/TextArea.svelte";
  import AddIcon from "~icons/mdi/plus";
  import OverwriteIcon from "~icons/mdi/pencil";
  import MoveIcon from "~icons/mdi/file-move-outline";
  import CancelIcon from "~icons/mdi/cancel";

  export let style: GroupedStyle;

  function styleExists(styleGroups: StyleGroup[], group: string, styleName: string): boolean {
    return styleGroups.some((value) => {
      if (value.name !== group) return false;
      return value.styles.some((style) => style.name === styleName);
    });
  }

  function decodeGroup(group: string): string {
    return group === t.DefaultGroup() ? "default" : group;
  }

  function cleanStyle(style: Style): Style {
    const _style: Style = { ...style };

    let key: keyof Style;
    for (key in _style) {
      const value = _style[key];
      if (value == null) {
        delete _style[key];
      } else if (typeof value === "string" && value.length === 0) {
        delete _style[key];
      }
    }

    return _style;
  }

  function isValidData(group: string, style: Style): boolean {
    return group.length > 0 && style.name.length > 0;
  }

  const { tabName, editData } = getContext<BetterStylesContext>(betterStylesContextKey);

  const originalGroup = style.group;
  const originalStyleName = style.style.name;

  let group: string;
  $: group = style.group;

  let styleValue: Style;
  $: styleValue = style.style;

  let ignoreDefaultValues = true;

  let thumbnailBlob: Nullable<Blob> = null;

  const onThumbnailUpdate = ({ detail }: CustomEvent<Nullable<Blob>>) => (thumbnailBlob = detail);

  const omitDefaultValues = async (style: Style) => {
    if (!ignoreDefaultValues) return Promise.resolve(style);
    return api.getDefaultStyle(tabName).then((defaultValues) => {
      let key: keyof Style;
      for (key in defaultValues) {
        if (defaultValues[key] !== style[key]) continue;
        delete style[key];
      }
      return style;
    });
  };

  const tryUploadThumbnail = async (group: string, style: Style, blob: Nullable<Blob>) => {
    if (blob == null) {
      if (style.image != null) {
        delete style["image"];
      }
      return Promise.resolve(style);
    }
    return api.uploadThumbnail(group, style.name, blob).then((path) => {
      if (path == null) return Promise.reject(t.ThumbnailSaveError());
      style.image = path;
      return style;
    });
  };

  const saveStyle = () => {
    const submit = (group: string, style: Style) => {
      void api.saveStyle(group, style).then((groups) => {
        styleGroups.set(groups);
        editData.set(null);
        showToast({ type: "success", text: t.StyleSaved() });
      });
    };

    const decodedGroup = decodeGroup(group);
    void tryUploadThumbnail(decodedGroup, cleanStyle(styleValue), thumbnailBlob)
      .then(omitDefaultValues)
      .then((style) => submit(decodedGroup, style))
      .catch((reason) => {
        showToast({ type: "error", text: String(reason) });
      });
  };

  const moveStyle = () => {
    const submit = (request: api.MoveStyleRequest) => {
      void api.moveStyle(request).then((groups) => {
        styleGroups.set(groups);
        editData.set(null);
        showToast({ type: "success", text: t.StyleMoved() });
      });
    };

    const fromGroup = decodeGroup(originalGroup);
    const toGroup = decodeGroup(group);
    void tryUploadThumbnail(toGroup, cleanStyle(styleValue), thumbnailBlob)
      .then(omitDefaultValues)
      .then((style) => submit({ fromGroup, toGroup, originalStyleName, style }))
      .catch((reason) => {
        showToast({ type: "error", text: String(reason) });
      });
  };
</script>

<div class="style-edit">
  <div class="form">
    <Group bind:group={style.group} />
    <TextField label={t.StyleName()} bind:value={styleValue.name} required={true} />
    {#if hasElement("#setting_sd_model_checkpoint")}
      <CheckpointExclusive bind:checkpoint={styleValue.checkpoint} />
    {/if}
    <div class="prompt">
      <TextArea bind:value={styleValue.prompt} label={t.Prompt()} options={{ rows: 4 }} />
    </div>
    <div class="negative-prompt">
      <TextArea
        bind:value={styleValue.negativePrompt}
        label={t.NegativePrompt()}
        options={{ rows: 4 }}
      />
    </div>
    <DropdownField
      bind:value={styleValue.samplingMethod}
      label={t.SamplingMethod()}
      srcElementId="{tabName}_sampling"
    />
    <RangeField
      bind:value={styleValue.samplingSteps}
      label={t.SamplingSteps()}
      srcElementId="{tabName}_steps"
    />
    <div class="checkbox-container">
      <Checkbox bind:value={styleValue.restoreFaces} label={t.RestoreFaces()} />
      <Checkbox bind:value={styleValue.tiling} label={t.Tiling()} />
      <Checkbox bind:value={styleValue.hiresFix} label={t.HiresFix()} />
    </div>
    <div class="hires-field-container" class:active={styleValue.hiresFix}>
      <DropdownField
        bind:value={styleValue.upscaler}
        label={t.Upscaler()}
        srcElementId="{tabName}_hr_upscaler"
      />
      <RangeField
        bind:value={styleValue.hiresSteps}
        label={t.HiresSteps()}
        srcElementId="{tabName}_hires_steps"
      />
      <RangeField
        bind:value={styleValue.denoisingStrength}
        label={t.DenoisingStrength()}
        srcElementId="{tabName}_denoising_strength"
      />
      <RangeField
        bind:value={styleValue.upscaleBy}
        label={t.UpscaleBy()}
        srcElementId="{tabName}_hr_scale"
      />
    </div>
    <RangeField
      bind:value={styleValue.cfgScale}
      label={t.CfgScale()}
      srcElementId="{tabName}_cfg_scale"
    />
    <NumberInput bind:value={styleValue.seed} label={t.Seed()} />
    {#if hasElement("#setting_CLIP_stop_at_last_layers")}
      <RangeField
        bind:value={styleValue.clipSkip}
        label={t.ClipSkip()}
        srcElementId="setting_CLIP_stop_at_last_layers"
      />
    {/if}
    {#if hasElement("#setting_eta_noise_seed_delta")}
      <NumberInput bind:value={styleValue.etaNoiseSeedDelta} label={t.EtaNoiseSeedDelta()} />
    {/if}
    <Checkbox
      bind:value={ignoreDefaultValues}
      label={t.ExcludeDefaultValueFields()}
      title={t.ExcludeDefaultValueFieldsTooltip()}
    />
    <Thumbnail
      galleryId="{tabName}_gallery"
      bind:image={styleValue.image}
      on:update={onThumbnailUpdate}
    />
  </div>
  <div class="buttons">
    {#if styleExists($styleGroups, group, styleValue.name)}
      <button
        class="button lg primary"
        on:click={saveStyle}
        disabled={!isValidData(group, styleValue)}
      >
        <OverwriteIcon />
        {t.OverwriteStyle()}
      </button>
    {:else}
      <button
        class="button lg primary"
        on:click={saveStyle}
        disabled={!isValidData(group, styleValue)}
      >
        <AddIcon />
        {t.SaveAsNewStyle()}
      </button>

      {#if originalGroup !== group && styleExists($styleGroups, originalGroup, originalStyleName)}
        <button
          class="button lg extra"
          on:click={moveStyle}
          disabled={!isValidData(group, styleValue)}
        >
          <MoveIcon />
          {t.MoveStyle()}
        </button>
      {/if}
    {/if}
    <button class="button lg secondary" on:click={() => editData.set(null)}>
      <CancelIcon />
      {t.DiscardChanges()}
    </button>
  </div>
</div>

<style lang="postcss">
  .style-edit {
    @apply flex flex-col items-center;
  }

  .form {
    @apply flex w-full max-w-[896px] flex-wrap gap-[--spacing-xl];
  }

  .form > :global(*) {
    @apply min-w-[min(320px,100%)] flex-grow basis-0;
  }

  :is(.prompt, .negative-prompt) {
    @apply min-w-[min(576px,100%)];
  }

  .checkbox-container {
    @apply flex min-w-[min(576px,100%)] flex-wrap gap-[--spacing-xxl];
  }

  .hires-field-container {
    @apply hidden;
  }

  .hires-field-container.active {
    @apply contents;
  }

  .hires-field-container.active > :global(*) {
    @apply min-w-[min(320px,100%)] flex-grow basis-0;
  }

  .buttons {
    @apply mt-[--spacing-xxl] flex w-full max-w-[896px] flex-wrap gap-[--spacing-xl];
  }

  .buttons > .button {
    @apply flex flex-grow basis-0 gap-[--spacing-lg];
  }

  .button > :global(.icon) {
    @apply text-[length:--text-xl];
  }
</style>
