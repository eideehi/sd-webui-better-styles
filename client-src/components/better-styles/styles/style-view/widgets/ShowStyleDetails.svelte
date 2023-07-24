<script lang="ts">
  import type { Style } from "#/styles";
  import * as t from "~/messages";
  import { Message } from "~/message";
  import ModalDialog from "%/ModalDialog.svelte";
  import Icon from "~icons/mdi/information-slab-circle-outline";

  export let group: string;
  export let style: Style;

  let showModal = false;

  type Field = { label: string; value: Nullable<string>; className?: string };
  function createFields(style: Style): Field[] {
    const _group = Message(`better-styles.group.${group}`, group);
    return omitNulls([
      { label: t.Group(), value: _group(), className: "half-size" },
      { label: t.StyleName(), value: style.name, className: "half-size" },
      { label: t.CheckpointExclusive(), value: style.checkpoint?.slice(0, 10) },
      { label: t.Prompt(), value: style.prompt, className: "full-size" },
      { label: t.NegativePrompt(), value: style.negativePrompt, className: "full-size" },
      { label: t.SamplingMethod(), value: style.samplingMethod },
      { label: t.SamplingSteps(), value: style.samplingSteps?.toString() },
      { label: t.CfgScale(), value: style.cfgScale?.toString() },
      { label: t.Seed(), value: style.seed?.toString() },
      { label: t.RestoreFaces(), value: style.restoreFaces ? t.Enabled() : undefined },
      { label: t.Tiling(), value: style.tiling ? t.Enabled() : undefined },
      { label: t.HiresFix(), value: style.hiresFix ? t.Enabled() : undefined },
      { label: t.Upscaler(), value: style.upscaler },
      { label: t.HiresSteps(), value: style.hiresSteps?.toString() },
      { label: t.DenoisingStrength(), value: style.denoisingStrength?.toString() },
      { label: t.UpscaleBy(), value: style.upscaleBy?.toString() },
      { label: t.ClipSkip(), value: style.clipSkip?.toString() },
      { label: t.EtaNoiseSeedDelta(), value: style.etaNoiseSeedDelta?.toString() },
    ]);
  }

  function omitNulls(fields: Field[]): Field[] {
    return fields.filter((field) => field.value != null);
  }
</script>

<button
  class="show-details widget"
  on:click|stopPropagation={() => (showModal = true)}
  title={t.ShowStyleDetails()}
>
  <Icon />
</button>

<ModalDialog bind:show={showModal}>
  <div class="style-details">
    <div class="field-container">
      {#each createFields(style) as field}
        <div class="field" data-size={field.className}>
          <span class="label">{field.label}</span>
          <p class="value">{field.value}</p>
        </div>
      {/each}
    </div>
  </div>
</ModalDialog>

<style lang="postcss">
  .show-details {
    @apply p-1 text-[length:--text-xl] text-[--body-text-color];
  }

  .style-details {
    @apply flex max-h-[calc(100vh_-_8rem)] max-w-[896px] flex-col overflow-auto p-[--block-padding];
  }

  .field-container {
    @apply flex flex-wrap gap-[--spacing-lg];
  }

  .field {
    @apply flex min-w-[min(224px,100%)] flex-grow basis-0 flex-col gap-[--spacing-xs];
  }

  .field[data-size="half-size"] {
    @apply min-w-[min(416px,100%)];
  }

  .field[data-size="full-size"] {
    @apply min-w-[min(672px,100%)];
  }

  .field > .value {
    @apply m-0 rounded border border-[--input-border-color] p-[--block-padding] [font-family:--font-mono];
  }
</style>
