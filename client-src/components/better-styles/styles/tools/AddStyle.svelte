<script lang="ts">
  import { getContext } from "svelte";
  import { getCurrentStyle } from "#/styles";
  import { AddStyle, DefaultGroup } from "~/messages";
  import { type BetterStylesContext, betterStylesContextKey } from "@/_logic/context";
  import Icon from "~icons/mdi/plus";

  const { tabName, activeGroup, editData } =
    getContext<BetterStylesContext>(betterStylesContextKey);

  function onClick(): void {
    let group = $activeGroup;
    if (group === "all" || group === "default") {
      group = DefaultGroup();
    }
    editData.set({ group, style: getCurrentStyle(tabName) });
  }
</script>

<button class="button lg secondary" on:click={onClick}>
  <Icon />
  {AddStyle()}
</button>
