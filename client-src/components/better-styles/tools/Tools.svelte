<script lang="ts">
  import { _ } from "@/libs/util";
  import SearchInput from "#/better-styles/tools/SearchInput.svelte";
  import ApplyButton from "#/better-styles/tools/ApplyButton.svelte";
  import SaveButton from "#/better-styles/tools/SaveButton.svelte";
  import DeleteButton from "#/better-styles/tools/DeleteButton.svelte";
  import CloseButton from "#/better-styles/tools/CloseButton.svelte";
  import ResetButton from "#/better-styles/tools/ResetButton.svelte";
</script>

<div class="tab-nav scroll-hide">
  <p class="label">{_("Better Styles")}</p>
  <SearchInput />
  <ApplyButton />
  <SaveButton />
  <DeleteButton />
  <ResetButton />
  <CloseButton />
</div>

<style lang="postcss">
  .tab-nav {
    @apply relative flex flex-wrap whitespace-nowrap border-b border-solid border-[var(--border-color-primary)];
  }

  .label {
    @apply -mb-[1px] flex items-center rounded-t-[var(--container-radius)] border border-b-0 border-solid border-[var(--border-color-primary)] px-[var(--size-4)] py-[var(--size-1)] font-[var(--section-header-text-weight)] text-[var(--body-text-color)];
    background: var(--background-fill-primary);
    font-size: var(--section-header-text-size);
  }

  .tab-nav :global(:nth-child(n + 3)) {
    @apply m-[0.3rem];
  }
</style>
