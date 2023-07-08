<script lang="ts">
  import type { Style } from "@/libs/styles";
  import { getContext, tick } from "svelte";
  import { _ } from "@/libs/util";
  import { showToast } from "@/libs/util/toast";
  import { generateId } from "@/libs/util/modal";
  import { getModal } from "#/modal/Modal.svelte";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/_logic/context";
  import Button from "#/widgets/Button.svelte";
  import DeleteStylesDialog from "#/better-styles/tools/DeleteStylesDialog.svelte";

  const id = generateId();

  const { activeGroup, selectedStyles } = getContext<BetterStylesContext>(betterStylesContextKey);

  let group: string;
  let styles: Style[];

  async function showDialog(): Promise<void> {
    group = $activeGroup;
    styles = $selectedStyles;
    if (styles.length === 0) {
      showToast({ type: "warning", text: _("Style is not selected") });
      return;
    }
    await tick();
    getModal(id)?.open(() => selectedStyles.set([]));
  }
</script>

{#if group && styles}
  <DeleteStylesDialog {group} {styles} {id} />
{/if}

<Button on:click={showDialog}>{_("Delete style")}</Button>
