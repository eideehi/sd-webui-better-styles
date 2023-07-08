<script lang="ts">
  import { getContext } from "svelte";
  import { getDefaultStyle } from "@/libs/api/getDefaultStyle";
  import { applyStyle } from "@/libs/styles";
  import { _ } from "@/libs/util";
  import { generateId } from "@/libs/util/modal";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/_logic/context";
  import { getModal } from "#/modal/Modal.svelte";
  import DialogModal from "#/modal/DialogModal.svelte";
  import Button from "#/widgets/Button.svelte";

  const id = generateId();
  const { tabName } = getContext<BetterStylesContext>(betterStylesContextKey);

  function resetStyle(): void {
    void getDefaultStyle(tabName).then((style) => {
      applyStyle(tabName, { name: "", ...style }, true);
      getModal(id)?.close();
    });
  }
</script>

<Button on:click={() => getModal(id)?.open()}>{_("Reset style")}</Button>

<DialogModal {id} options={{ hiddenCloseButton: true, closeOnClickOutside: false }}>
  <div class="reset-style">
    <p class="text">
      {_("Are you sure you want to return the style to its default value?")}
    </p>
    <div class="buttons">
      <Button on:click={resetStyle} primary={true}>{_("Yes, reset the current style")}</Button>
      <Button on:click={() => getModal(id)?.close()}>{_("No, cancel the reset")}</Button>
    </div>
  </div>
</DialogModal>

<style lang="postcss">
  .reset-style {
    @apply flex flex-col gap-4 p-4;
  }

  .text {
    @apply m-0 text-xl;
  }

  .buttons {
    @apply flex gap-2;
  }

  .buttons > :global(.button) {
    @apply flex-grow;
  }
</style>
