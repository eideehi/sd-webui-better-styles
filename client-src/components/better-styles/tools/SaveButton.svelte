<script lang="ts">
  import type { CapturedStyle } from "@/libs/prompt-style/captureStyle";
  import type { StyleSaveData } from "#/better-styles/tools/styleSave";
  import { getContext, tick } from "svelte";
  import { _ } from "@/libs/util";
  import { generateId } from "@/libs/util/modal";
  import { captureStyle } from "@/libs/prompt-style";
  import { getModal } from "#/modal/Modal.svelte";
  import { createDefaultSaveData } from "#/better-styles/tools/styleSave";
  import Button from "#/widgets/Button.svelte";
  import SaveStyleDialog from "./SaveStyleDialog.svelte";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/context";

  const id = generateId();

  const { tabName, activeGroup } = getContext<BetterStylesContext>(betterStylesContextKey);

  let capturedStyle: CapturedStyle;
  let saveData: StyleSaveData;

  async function showDialog(): Promise<void> {
    capturedStyle = captureStyle(tabName);
    saveData = createDefaultSaveData({
      group: $activeGroup,
      style: {
        prompt: capturedStyle.prompt || "",
        negativePrompt: capturedStyle.negativePrompt || "",
      },
    });
    await tick();
    getModal(id)?.open();
  }
</script>

{#if capturedStyle && saveData}
  <SaveStyleDialog {capturedStyle} {saveData} {id} />
{/if}

<Button on:click={showDialog}>{_("Save style")}</Button>
