<script lang="ts">
  import { getContext } from "svelte";
  import { _ } from "@/libs/util";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/_logic/context";
  import TextInput from "#/widgets/TextInput.svelte";

  const { styleSearchKeyword } = getContext<BetterStylesContext>(betterStylesContextKey);

  function onSearchKeywordChanged(event: InputEvent): void {
    if (!(event.target instanceof HTMLTextAreaElement)) return;
    styleSearchKeyword.set(event.target.value.toLowerCase());
  }
</script>

<div class="search">
  <TextInput on:input={onSearchKeywordChanged} options={{ placeholder: _("Search...") }} />
</div>

<style lang="postcss">
  .search {
    @apply m-[0.3rem] inline-block w-[16rem] max-w-[16rem] self-center;
  }
</style>
