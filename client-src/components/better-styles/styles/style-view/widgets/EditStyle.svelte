<script lang="ts">
  import { getContext } from "svelte";
  import { EditThisStyle } from "~/messages";
  import {
    type BetterStylesContext,
    type GroupedStyle,
    betterStylesContextKey,
  } from "@/_logic/context";
  import Icon from "~icons/mdi/pencil";

  export let style: GroupedStyle;

  const { editData } = getContext<BetterStylesContext>(betterStylesContextKey);

  function onClick(): void {
    editData.set(style);
  }
</script>

<button class="widget" title={EditThisStyle()} on:click|stopPropagation={onClick}>
  <Icon />
</button>
