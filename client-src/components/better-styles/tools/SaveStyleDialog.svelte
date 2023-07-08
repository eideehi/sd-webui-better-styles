<script lang="ts">
  import type { StyleSaveData } from "./styleSave";
  import type { Style } from "@/libs/styles";
  import { _ } from "@/libs/util";
  import { registerStyle } from "@/libs/api";
  import { styleGroups } from "@/libs/store";
  import { showToast } from "@/libs/util/toast";
  import { getModal } from "#/modal/Modal.svelte";
  import { cleanSaveData } from "./styleSave";
  import TextField from "#/widgets/TextField.svelte";
  import DialogModal from "#/modal/DialogModal.svelte";
  import Button from "#/widgets/Button.svelte";
  import Checkbox from "#/widgets/Checkbox.svelte";
  import { createStyleGetter, type StyleGetter } from "@/libs/styles/accesor/createStyleGetter";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/context";
  import { getContext } from "svelte";
  import { createDefaultSaveData } from "#/better-styles/tools/styleSave";

  export let id: string;

  const { tabName, activeGroup } = getContext<BetterStylesContext>(betterStylesContextKey);

  let styleGetter: StyleGetter = createStyleGetter(tabName);
  let saveData: StyleSaveData = createDefaultSaveData({
    group: $activeGroup,
    style: {
      prompt: styleGetter.prompt.getOrDefault(""),
      negativePrompt: styleGetter.negativePrompt.getOrDefault(""),
    },
  });

  let valid: boolean;
  $: {
    valid = saveData.group.length > 0;
    valid = valid && (saveData.style.name || "").length > 0;
  }

  const setParameter = (key: keyof Style & keyof StyleGetter) => (event: InputEvent) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    saveData.style = {
      ...saveData.style,
      [key]: event.target.checked ? styleGetter[key].get() : null,
    };
  };

  async function doSave(): Promise<void> {
    const data = cleanSaveData(saveData);
    await registerStyle(data.group, data.style).then((groups) => {
      getModal(id)?.close();
      styleGroups.set(groups);
      showToast({ type: "success", text: _("Style registered") });
    });
  }
</script>

<DialogModal {id} options={{ hiddenCloseButton: true, closeOnClickOutside: false }}>
  <div class="save-style">
    <div class="input-fields">
      <TextField bind:value={saveData.style.name} label={_("Style name")} />
      <TextField bind:value={saveData.group} label={_("Group")} />
      <TextField bind:value={saveData.style.prompt} label={_("Prompt")} options={{ rows: 3 }} />
      <TextField
        bind:value={saveData.style.negativePrompt}
        label={_("Negative prompt")}
        options={{ rows: 3 }}
      />
    </div>
    <div class="parameters">
      <span class="label">{_("Save these parameters as style")}</span>
      <ul class="parameter-fields">
        <Checkbox label={_("Sampling method")} on:change={setParameter("samplingMethod")} />
        <Checkbox label={_("Sampling steps")} on:change={setParameter("samplingSteps")} />
        <Checkbox label={_("CFG Scale")} on:change={setParameter("cfgScale")} />
        <Checkbox label={_("Seed")} on:change={setParameter("seed")} />
        <Checkbox label={_("Restore faces")} on:change={setParameter("restoreFaces")} />
        <Checkbox label={_("Tiling")} on:change={setParameter("tiling")} />
        <Checkbox label={_("Hires. fix")} on:change={setParameter("hiresFix")} />
        {#if styleGetter.hiresFix.getOrDefault(false)}
          <Checkbox label={_("Upscaler")} on:change={setParameter("upscaler")} />
          <Checkbox label={_("Hires steps")} on:change={setParameter("hiresSteps")} />
          <Checkbox label={_("Denoising strength")} on:change={setParameter("denoisingStrength")} />
          <Checkbox label={_("Upscale by")} on:change={setParameter("upscaleBy")} />
        {/if}
        <Checkbox label={_("Clip skip")} on:change={setParameter("clipSkip")} />
        <Checkbox label={_("Eta noise seed delta")} on:change={setParameter("etaNoiseSeedDelta")} />
      </ul>
    </div>
    <div class="other-options">
      <Checkbox
        label={_("Make this style exclusive to the current checkpoint")}
        on:change={setParameter("checkpoint")}
      />
      <Checkbox
        label={_("Use the current image as a thumbnail")}
        on:change={setParameter("image")}
        options={{ disabled: styleGetter.image.get() == null }}
      />
    </div>
    <div class="buttons">
      <Button on:click={doSave} options={{ disabled: !valid }} primary={true}>
        {_("Save with this content")}
      </Button>
      <Button on:click={() => getModal(id)?.close()}>{_("Close without saving")}</Button>
    </div>
  </div>
</DialogModal>

<style lang="postcss">
  .save-style {
    @apply flex flex-col gap-y-6 p-4;
  }

  .input-fields {
    @apply grid grid-cols-[max-content_1fr] items-baseline gap-2;
  }

  .input-fields > :global(.text-field) {
    @apply contents;
  }

  .buttons {
    @apply flex gap-2;
  }

  .buttons > :global(:first-child) {
    @apply flex-grow;
  }

  .parameter-fields {
    @apply m-0 flex select-none flex-wrap gap-x-3 gap-y-1 p-0 pt-1;
  }

  .other-options {
    @apply flex select-none flex-col gap-2;
  }
</style>
