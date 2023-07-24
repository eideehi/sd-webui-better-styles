<script lang="ts">
  import { getContext } from "svelte";
  import { CardLayout, CompactLayout } from "~/messages";
  import { type StyleViewContext, styleViewContextKey } from "../_logic/context";
  import CardIcon from "~icons/mdi/card-outline";
  import CompactIcon from "~icons/mdi/format-list-bulleted-square";

  const { layoutMode } = getContext<StyleViewContext>(styleViewContextKey);
</script>

<div class="tools">
  <button
    class="button sm secondary"
    on:click={() => layoutMode.set("card")}
    disabled={$layoutMode === "card"}
  >
    <CardIcon />
    {CardLayout()}
  </button>
  <button
    class="button sm secondary"
    on:click={() => layoutMode.set("compact")}
    disabled={$layoutMode === "compact"}
  >
    <CompactIcon />
    {CompactLayout()}
  </button>
</div>

<style lang="postcss">
  .tools {
    @apply flex gap-[--spacing-lg] py-[--spacing-xl];
  }

  .tools > .button {
    @apply flex gap-[--spacing-md];
  }

  .tools > .button:disabled {
    @apply cursor-default opacity-100 ![background:none];
  }
</style>
