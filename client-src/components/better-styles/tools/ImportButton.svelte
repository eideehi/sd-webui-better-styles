<script lang="ts">
  import { getContext } from "svelte";
  import { importStylesCsv } from "@/libs/api";
  import { _ } from "@/libs/util";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/_logic/context";
  import Button from "#/widgets/Button.svelte";
  import ModalDialog from "#/widgets/ModalDialog.svelte";
  import { styleGroups } from "@/libs/store";
  import { showToast } from "@/libs/util/toast";

  const { selectedStyles } = getContext<BetterStylesContext>(betterStylesContextKey);

  let showModal = false;

  function importStyles(): void {
    void importStylesCsv().then((groups) => {
      showModal = false;
      if (groups.length > 0) {
        selectedStyles.set([]);
        styleGroups.set(groups);
        showToast({ type: "success", text: _("styles.csv imported") });
      }
    });
  }
</script>

<Button on:click={() => (showModal = true)}>{_("Import styles.csv")}</Button>

<ModalDialog bind:show={showModal} options={{ hideCloseButton: true }}>
  <div class="import-styles">
    <p class="text">
      {_(
        'Would you like to import the contents of styles.csv into the "styles.csv" group? If the group doesn\'t exist, it will be created.'
      )}
    </p>
    <div class="buttons">
      <Button on:click={importStyles} primary={true}>{_("Yes, import styles.csv")}</Button>
      <Button on:click={() => (showModal = false)}>{_("No, cancel the import")}</Button>
    </div>
  </div>
</ModalDialog>

<style lang="postcss">
  .import-styles {
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
