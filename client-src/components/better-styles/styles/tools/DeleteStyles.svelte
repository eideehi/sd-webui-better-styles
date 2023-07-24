<script lang="ts">
  import { getContext } from "svelte";
  import { deleteStyles } from "#/api";
  import { styleGroups } from "#/store";
  import { groupBy } from "#/util/array";
  import * as t from "~/messages";
  import {
    type BetterStylesContext,
    type GroupedStyle,
    betterStylesContextKey,
  } from "@/_logic/context";
  import { showToast } from "%/Toast.svelte";
  import ConfirmDialog from "%/ConfirmDialog.svelte";
  import Icon from "~icons/mdi/delete";

  function sortStyles(styles: GroupedStyle[]): GroupedStyle[] {
    return styles.sort(
      (a, b) => a.group.localeCompare(b.group) || a.style.name.localeCompare(b.style.name)
    );
  }

  const { selectedStyles } = getContext<BetterStylesContext>(betterStylesContextKey);

  let active: boolean;
  $: active = $selectedStyles.length > 0;

  let showDialog = false;

  function onClick(): void {
    if (!active) {
      showToast({ type: "warning", text: t.StylesNotSelected() });
      return;
    }
    showDialog = true;
  }

  function onConfirm(): void {
    void deleteStyles(
      groupBy(
        $selectedStyles,
        ({ group }) => group,
        ({ style }) => style.name
      )
    ).then((groups) => {
      showDialog = false;
      selectedStyles.set([]);
      styleGroups.set(groups);
      showToast({ type: "success", text: t.StylesDeleted() });
    });
  }
</script>

<button class="button lg secondary" on:click={onClick} disabled={!active}>
  <Icon />
  {t.DeleteStyles()}
</button>

<ConfirmDialog
  bind:show={showDialog}
  on:confirm={onConfirm}
  messages={{
    confirm: t.DeleteStylesConfirm(),
    cancel: t.DeleteStylesCancel(),
  }}
>
  <div class="dialog-body">
    <p class="text">{t.DeleteStylesDialog()}</p>
    <ul class="selected-styles">
      {#each sortStyles($selectedStyles) as style (`${style.group}:${style.style.name}`)}
        <li class="style-item">
          <span>[{style.group}]</span>
          <span>{style.style.name}</span>
        </li>
      {/each}
    </ul>
  </div>
</ConfirmDialog>

<style lang="postcss">
  .dialog-body {
    @apply flex flex-col gap-[--spacing-xl];
  }

  .text {
    @apply m-0 text-[length:--text-xl];
  }

  .selected-styles {
    @apply start-[--spacing-xxl] m-0 grid max-h-[256px] grid-cols-[max-content_1fr] gap-x-[--spacing-xl] gap-y-[--spacing-sm] overflow-y-auto rounded-[--block-radius] p-[--spacing-xl] ps-[calc(var(--spacing-xxl)_*_1.2)] [background:--background-fill-secondary];
  }

  .style-item {
    @apply contents;
  }

  .style-item > :first-child {
    @apply text-end;
  }
</style>
