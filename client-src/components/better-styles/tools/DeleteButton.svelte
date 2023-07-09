<script lang="ts">
  import type { Style } from "@/libs/styles";
  import { getContext, tick } from "svelte";
  import { deleteStyles } from "@/libs/api";
  import { styleGroups } from "@/libs/store";
  import { _ } from "@/libs/util";
  import { showToast } from "@/libs/util/toast";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/_logic/context";
  import Button from "#/widgets/Button.svelte";
  import ModalDialog from "#/widgets/ModalDialog.svelte";

  const { activeGroup, selectedStyles } = getContext<BetterStylesContext>(betterStylesContextKey);

  let showModal = false;

  let group = "";
  let styles: Style[] = [];

  async function showDialog(): Promise<void> {
    group = $activeGroup;
    styles = $selectedStyles;
    if (styles.length === 0) {
      showToast({ type: "warning", text: _("Style is not selected") });
      return;
    }
    await tick();
    showModal = true;
  }

  function onConfirm(): void {
    void deleteStyles(
      group,
      styles.map((style) => style.name)
    ).then((groups) => {
      showModal = false;
      selectedStyles.set([]);
      styleGroups.set(groups);
      showToast({ type: "success", text: _("Styles deleted") });
    });
  }
</script>

<Button on:click={showDialog}>{_("Delete style")}</Button>

<ModalDialog bind:show={showModal} options={{ hideCloseButton: true }}>
  <div class="delete-styles">
    <p class="text">
      {_("Delete all selected styles. This action cannot be undone. Are you sure?")}
    </p>
    <div class="buttons">
      <Button on:click={onConfirm} primary={true}>{_("Execute the deletion")}</Button>
      <Button on:click={() => (showModal = false)}>{_("Close without deleting")}</Button>
    </div>
  </div>
</ModalDialog>

<style lang="postcss">
  .delete-styles {
    @apply flex max-w-[640px] flex-col gap-4 p-4;
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
