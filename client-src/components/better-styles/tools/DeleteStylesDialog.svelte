<script lang="ts">
  import { _ } from "@/libs/util";
  import { showToast } from "@/libs/util/toast";
  import { getModal } from "#/modal/Modal.svelte";
  import { deleteStyles } from "@/libs/api";
  import { styleGroups } from "@/libs/store";
  import Button from "#/widgets/Button.svelte";
  import DialogModal from "#/modal/DialogModal.svelte";

  export let id: string;
  export let group: string;
  export let styles: Style[];

  async function doDelete(): Promise<void> {
    await deleteStyles({ group, styles: styles.map((style) => style.name) }).then((groups) => {
      getModal(id)?.close();
      styleGroups.set(groups);
      showToast({ type: "success", text: _("Styles deleted") });
    });
  }
</script>

<DialogModal {id} options={{ hiddenCloseButton: true, closeOnClickOutside: false }}>
  <div class="delete-styles">
    <p class="text">
      {_("Delete all selected styles. This action cannot be undone. Are you sure?")}
    </p>
    <div class="buttons">
      <Button on:click={doDelete} primary={true}>{_("Execute the deletion")}</Button>
      <Button on:click={() => getModal(id)?.close()}>{_("Close without deleting")}</Button>
    </div>
  </div>
</DialogModal>

<style lang="postcss">
  .delete-styles {
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
