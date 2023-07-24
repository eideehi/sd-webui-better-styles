<script lang="ts">
  import Tools from "./tools/Tools.svelte";
  import GroupView from "./group-view/GroupView.svelte";
  import StyleView from "./style-view/StyleView.svelte";
</script>

<div class="styles">
  <Tools />
  <GroupView />
  <StyleView />
</div>

<style lang="postcss">
  .styles {
    @apply flex flex-col gap-[--block-padding];
  }
</style>
