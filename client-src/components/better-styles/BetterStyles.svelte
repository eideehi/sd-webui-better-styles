<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { checkpoint, styleGroups } from "@/libs/store";
  import { getElement } from "@/libs/util";
  import { hasVisibleStyles } from "@/libs/prompt-style";
  import { type BetterStylesContext, betterStylesContextKey } from "#/better-styles/context";
  import Tools from "#/better-styles/tools/Tools.svelte";
  import GroupList from "#/better-styles/groups/GroupList.svelte";
  import StyleList from "#/better-styles/styles/StyleList.svelte";
  import BetterStylesSwitcher from "#/better-styles/BetterStylesSwitcher.svelte";

  export let tabName: StylesAvailableTab;

  const active = writable(true);
  const activeGroup = writable("default");

  setContext<BetterStylesContext>(betterStylesContextKey, {
    tabName,
    activeBetterStyles: active,
    activeGroup,
    styleSearchKeyword: writable(""),
    selectedStyles: writable([] as Style[]),
  });

  const changeToAvailableCategory = (groups: StyleGroup[], checkpoint: string) => {
    const group = groups.find((group) => group.name === $activeGroup);
    if (group == null || hasVisibleStyles(group, checkpoint)) return;
    const newGroup = groups
      .sort((a, b) => a.name.localeCompare(b.name))
      .find((group) => hasVisibleStyles(group, checkpoint));
    activeGroup.set(newGroup != null ? newGroup.name : "default");
  };

  checkpoint.subscribe((checkpoint) => changeToAvailableCategory($styleGroups, checkpoint));
  styleGroups.subscribe((groups) => changeToAvailableCategory(groups, $checkpoint));

  const buttonBase = getElement(`#${tabName}_style_apply`);
  new BetterStylesSwitcher({
    target: buttonBase.parentElement,
    props: { baseElement: buttonBase },
  });
</script>

<div class="better-styles form" class:hidden={!$active} id="better-styles-{tabName}-styles">
  <div class="compact gradio-row">
    <div class="tabs gradio-tabs extra-networks">
      <Tools />
      <div class="tab-item">
        <GroupList />
        <StyleList />
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .better-styles {
    @apply min-w-full;
  }

  .tab-item {
    @apply relative flex flex-col gap-3 rounded-b-[var(--container-radius)] border border-t-0 border-[var(--border-color-primary)] p-[var(--block-padding)];
  }
</style>
