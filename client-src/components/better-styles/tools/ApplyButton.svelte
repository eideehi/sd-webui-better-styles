<script lang="ts">
  import { getContext } from "svelte";
  import { _ } from "@/libs/util";
  import { applyStyle } from "@/libs/styles";
  import { showToast } from "@/libs/util/toast";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/_logic/context";
  import Button from "#/widgets/Button.svelte";

  const { tabName, selectedStyles } = getContext<BetterStylesContext>(betterStylesContextKey);

  function applyStyles(): void {
    if ($selectedStyles.length === 0) {
      showToast({ type: "warning", text: _("Style is not selected") });
      return;
    }
    $selectedStyles.forEach((style) => applyStyle(tabName, style));
    selectedStyles.set([]);
  }
</script>

<Button on:click={applyStyles}>{_("Apply style")}</Button>
