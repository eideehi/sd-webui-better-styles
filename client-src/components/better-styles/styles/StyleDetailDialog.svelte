<script lang="ts">
  import type { Style } from "@/libs/styles";
  import { _ } from "@/libs/util";
  import DialogModal from "#/modal/DialogModal.svelte";

  export let id: string;
  export let style: Style;

  type Field = { label: string; value: Nullable<string> };

  function createFields(style: Style): Field[] {
    return omitNulls([
      { label: _("Style name"), value: _(style.name) },
      { label: _("Exclusive"), value: !style.checkpoint ? _("No") : _("Yes") },
      { label: _("Prompt"), value: style.prompt },
      { label: _("Negative prompt"), value: style.negativePrompt },
      { label: _("Sampling method"), value: style.samplingMethod },
      { label: _("Sampling steps"), value: style.samplingSteps?.toString() },
      { label: _("CFG Scale"), value: style.cfgScale?.toString() },
      { label: _("Seed"), value: style.seed?.toString() },
      { label: _("Restore faces"), value: style.restoreFaces ? _("Enabled") : undefined },
      { label: _("Tiling"), value: style.tiling ? _("Enabled") : undefined },
      { label: _("Hires. fix"), value: style.hiresFix ? _("Enabled") : undefined },
      { label: _("Upscaler"), value: style.upscaler },
      { label: _("Hires steps"), value: style.hiresSteps?.toString() },
      { label: _("Denoising strength"), value: style.denoisingStrength?.toString() },
      { label: _("Upscale by"), value: style.upscaleBy?.toString() },
      { label: _("Clip skip"), value: style.clipSkip?.toString() },
      { label: _("Eta noise seed delta"), value: style.etaNoiseSeedDelta?.toString() },
    ]);
  }

  function omitNulls(fields: Field[]): Field[] {
    return fields.filter((field) => field.value != null);
  }
</script>

<DialogModal {id}>
  <div class="styles-detail">
    <div class="field-container">
      {#each createFields(style) as field}
        <div class="field">
          <span class="label">{field.label}</span>
          <p class="value">{field.value}</p>
        </div>
      {/each}
    </div>
  </div>
</DialogModal>

<style lang="postcss">
  .styles-detail {
    @apply flex max-h-[60vh] flex-col gap-y-6 overflow-auto p-4;
  }

  .field-container {
    @apply grid grid-cols-[max-content_1fr] items-baseline gap-4;
  }

  .field {
    @apply contents;
  }

  .field > .label {
    @apply text-right;
    overflow-wrap: anywhere;
  }

  .field > .value {
    @apply m-0 rounded border border-solid border-[var(--input-border-color)] px-3 py-1;
    overflow-wrap: anywhere;
  }
</style>
