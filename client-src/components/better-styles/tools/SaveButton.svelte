<script lang="ts">
  import type { Style } from "@/libs/styles";
  import type { StyleSaveData } from "./_logic/styleSave";
  import { getContext } from "svelte";
  import { registerStyle } from "@/libs/api";
  import { styleGroups } from "@/libs/store";
  import { _ } from "@/libs/util";
  import { showToast } from "@/libs/util/toast";
  import { createStyleGetter, type StyleGetter } from "@/libs/styles/accesor/createStyleGetter";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/_logic/context";
  import { createDefaultSaveData } from "#/better-styles/tools/_logic/styleSave";
  import { cleanSaveData } from "./_logic/styleSave";
  import Button from "#/widgets/Button.svelte";
  import Checkbox from "#/widgets/Checkbox.svelte";
  import ModalDialog from "#/widgets/ModalDialog.svelte";
  import TextField from "#/widgets/TextField.svelte";

  const { tabName, activeGroup } = getContext<BetterStylesContext>(betterStylesContextKey);

  let showModal = false;

  let styleGetter: StyleGetter = createStyleGetter(tabName);
  let saveData: StyleSaveData = createDefaultSaveData({ group: "", style: {} });

  function showDialog(): void {
    saveData = createDefaultSaveData({
      group: $activeGroup,
      style: {
        prompt: styleGetter.prompt.getOrDefault(""),
        negativePrompt: styleGetter.negativePrompt.getOrDefault(""),
      },
    });
    showModal = true;
  }

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
      showModal = false;
      styleGroups.set(groups);
      showToast({ type: "success", text: _("Style registered") });
    });
  }
</script>

<Button on:click={showDialog}>{_("Save style")}</Button>

<ModalDialog bind:show={showModal}>
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
      <Button on:click={() => (showModal = false)}>{_("Close without saving")}</Button>
    </div>
  </div>
</ModalDialog>

<style lang="postcss">
  .save-style {
    @apply flex max-h-[60vh] max-w-[768px] flex-col gap-y-6 overflow-auto p-4;
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

  .buttons > :global(button) {
    @apply flex-grow basis-0;
  }

  .parameter-fields {
    @apply m-0 flex select-none flex-wrap gap-x-3 gap-y-1 p-0 pt-1;
  }

  .other-options {
    @apply flex select-none flex-col gap-2;
  }
</style>
