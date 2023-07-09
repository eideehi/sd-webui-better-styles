<script lang="ts">
  import { getContext } from "svelte";
  import { getDefaultStyle } from "@/libs/api";
  import { applyStyle } from "@/libs/styles";
  import { _ } from "@/libs/util";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/_logic/context";
  import Button from "#/widgets/Button.svelte";
  import ModalDialog from "#/widgets/ModalDialog.svelte";

  const { tabName } = getContext<BetterStylesContext>(betterStylesContextKey);

  let showModal = false;

  function resetStyle(): void {
    void getDefaultStyle(tabName).then((style) => {
      applyStyle(tabName, { name: "", ...style }, true);
      showModal = false;
    });
  }
</script>

<Button on:click={() => (showModal = true)}>{_("Reset style")}</Button>

<ModalDialog bind:show={showModal} options={{ hideCloseButton: true }}>
  <div class="reset-style">
    <p class="text">
      {_("Are you sure you want to return the style to its default value?")}
    </p>
    <div class="buttons">
      <Button on:click={resetStyle} primary={true}>{_("Yes, reset the current style")}</Button>
      <Button on:click={() => (showModal = false)}>{_("No, cancel the reset")}</Button>
    </div>
  </div>
</ModalDialog>

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
