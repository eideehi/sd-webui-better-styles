<script lang="ts">
  import { getContext } from "svelte";
  import { deleteStyles } from "#/api";
  import { styleGroups } from "#/store";
  import * as t from "~/messages";
  import { showToast } from "%/Toast.svelte";
  import { type BetterStylesContext, betterStylesContextKey } from "@/_logic/context";
  import ConfirmDialog from "%/ConfirmDialog.svelte";
  import Icon from "~icons/mdi/delete";

  export let group: string;
  export let styleName: string;

  const { selectedStyles } = getContext<BetterStylesContext>(betterStylesContextKey);

  let showDialog = false;

  const onClick = () => (showDialog = true);

  const onConfirm = () => {
    void deleteStyles({ [group]: [styleName] }).then((groups) => {
      showDialog = false;
      selectedStyles.set([]);
      styleGroups.set(groups);
      showToast({ type: "success", text: t.StylesDeleted() });
    });
  };
</script>

<button class="widget" title={t.DeleteThisStyle()} on:click|stopPropagation={onClick}>
  <Icon />
</button>

<ConfirmDialog
  bind:show={showDialog}
  on:confirm={onConfirm}
  messages={{
    main: t.DeleteThisStyleDialog(styleName, group),
    confirm: t.DeleteStylesConfirm(),
    cancel: t.DeleteStylesCancel(),
  }}
/>
