<script lang="ts">
  import { getContext } from "svelte";
  import { importStylesCsv } from "#/api";
  import { styleGroups } from "#/store";
  import * as t from "~/messages";
  import { showToast } from "%/Toast.svelte";
  import { type BetterStylesContext, betterStylesContextKey } from "@/_logic/context";
  import ConfirmDialog from "%/ConfirmDialog.svelte";
  import Icon from "~icons/mdi/import";

  const { selectedStyles } = getContext<BetterStylesContext>(betterStylesContextKey);

  let showDialog = false;

  function onConfirm(): void {
    void importStylesCsv().then((groups) => {
      if (groups.length > 0) {
        selectedStyles.set([]);
        styleGroups.set(groups);
        showToast({ type: "success", text: t.StylesCsvImported() });
      }
    });
  }
</script>

<button class="button lg secondary" on:click={() => (showDialog = true)}>
  <Icon />
  {t.ImportStylesCsv()}
</button>

<ConfirmDialog
  bind:show={showDialog}
  on:confirm={onConfirm}
  messages={{
    main: t.ImportStylesCsvDialog(),
    confirm: t.ImportStylesCsvConfirm(),
    cancel: t.ImportStylesCsvCancel(),
  }}
/>
