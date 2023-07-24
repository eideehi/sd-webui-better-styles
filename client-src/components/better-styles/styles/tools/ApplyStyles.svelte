<script lang="ts">
  import { getContext } from "svelte";
  import { applyStyle } from "#/styles";
  import { ApplyStyles, StylesNotSelected } from "~/messages";
  import { type BetterStylesContext, betterStylesContextKey } from "@/_logic/context";
  import { showToast } from "%/Toast.svelte";
  import Icon from "~icons/mdi/check";

  const { tabName, selectedStyles } = getContext<BetterStylesContext>(betterStylesContextKey);

  let active: boolean;
  $: active = $selectedStyles.length > 0;

  function onClick(): void {
    if (!active) {
      showToast({ type: "warning", text: StylesNotSelected() });
      return;
    }
    $selectedStyles.forEach(({ style }) => applyStyle(tabName, style));
    selectedStyles.set([]);
  }
</script>

<button class="button lg secondary" on:click={onClick} disabled={!active}>
  <Icon />
  {ApplyStyles()}
</button>
