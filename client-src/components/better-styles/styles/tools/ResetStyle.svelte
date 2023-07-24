<script lang="ts">
  import { getContext } from "svelte";
  import { getDefaultStyle } from "#/api";
  import { applyStyle } from "#/styles";
  import * as t from "~/messages";
  import { type BetterStylesContext, betterStylesContextKey } from "@/_logic/context";
  import ConfirmDialog from "%/ConfirmDialog.svelte";
  import Icon from "~icons/mdi/restore";

  const { tabName } = getContext<BetterStylesContext>(betterStylesContextKey);

  let showDialog = false;

  function onConfirm(): void {
    void getDefaultStyle(tabName).then((style) => {
      applyStyle(tabName, { name: "", ...style }, true);
    });
  }
</script>

<button class="button lg secondary" on:click={() => (showDialog = true)}>
  <Icon />
  {t.ResetStyle()}
</button>

<ConfirmDialog
  bind:show={showDialog}
  on:confirm={onConfirm}
  messages={{
    main: t.ResetStyleDialog(),
    confirm: t.ResetStyleConfirm(),
    cancel: t.ResetStyleCancel(),
  }}
/>
