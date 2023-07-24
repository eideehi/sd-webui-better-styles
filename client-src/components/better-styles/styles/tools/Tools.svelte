<script lang="ts">
  import SearchInput from "./SearchInput.svelte";
  import ApplyStyles from "./ApplyStyles.svelte";
  import ResetStyle from "./ResetStyle.svelte";
  import AddStyle from "./AddStyle.svelte";
  import DeleteStyles from "./DeleteStyles.svelte";
  import ImportStylesCsv from "./ImportStylesCsv.svelte";
</script>

<div class="tools">
  <SearchInput />
  <ApplyStyles />
  <ResetStyle />
  <AddStyle />
  <DeleteStyles />
  <ImportStylesCsv />
</div>

<style lang="postcss">
  .tools {
    @apply flex flex-wrap gap-[--spacing-lg];
  }

  .tools > :global(.button) {
    @apply flex min-w-[min(224px,100%)] flex-grow basis-0 items-center gap-x-[--spacing-lg];
  }

  .tools > :global(.button > .icon) {
    @apply text-[length:--text-xl];
  }
</style>
