<script lang="ts">
  import { getContext } from "svelte";
  import { type Style, applyStyle } from "#/styles";
  import { ApplyThisStyle } from "~/messages";
  import { type BetterStylesContext, betterStylesContextKey } from "@/_logic/context";
  import Icon from "~icons/mdi/check";

  export let style: Style;

  const { tabName } = getContext<BetterStylesContext>(betterStylesContextKey);

  function onClick(): void {
    applyStyle(tabName, style);
  }
</script>

<button class="widget" title={ApplyThisStyle()} on:click|stopPropagation={onClick}>
  <Icon />
</button>
