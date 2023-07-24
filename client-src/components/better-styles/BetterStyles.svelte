<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { getElement } from "#/util/dom";
  import { getBooleanOption } from "#/util/webui";
  import { BetterStyles } from "~/messages";
  import {
    type BetterStylesContext,
    type GroupedStyle,
    betterStylesContextKey,
  } from "./_logic/context";
  import BetterStylesToggleButton from "./BetterStylesToggleButton.svelte";
  import Styles from "./styles/Styles.svelte";
  import StyleEdit from "./style-edit/StyleEdit.svelte";

  export let tabName: ExtensionAvailableTab;

  const active = writable(getBooleanOption("better_styles_show_by_default", false));
  const activeGroup = writable("default");
  const editData = writable<Nullable<GroupedStyle>>(null);

  function cloneGroupedStyle(groupedStyle: GroupedStyle): GroupedStyle {
    return { group: groupedStyle.group, style: { ...groupedStyle.style } };
  }

  setContext<BetterStylesContext>(betterStylesContextKey, {
    tabName,
    active,
    styleSearchKeyword: writable(""),
    activeGroup,
    selectedStyles: writable([]),
    editData,
  });

  const toolButton = getElement(`#${tabName}_style_apply`);
  if (toolButton != null && toolButton.parentElement != null) {
    new BetterStylesToggleButton({
      target: toolButton.parentElement,
      props: { baseElement: toolButton },
    });
  }
</script>

<div class="better-styles form" class:active={$active} id="{tabName}_better_styles">
  <div class="compact gradio-row">
    <div class="tabs gradio-tabs">
      <div class="tab-nav scroll-hide">
        <p class="label">{BetterStyles()}</p>
      </div>
      {#if $editData == null}
        <div class="tab-item">
          <Styles />
        </div>
      {:else}
        <div class="tab-item">
          <StyleEdit style={cloneGroupedStyle($editData)} />
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  .better-styles {
    @apply hidden w-[--size-full];
  }

  .better-styles.active {
    @apply block;
  }

  .tab-nav {
    @apply flex flex-wrap whitespace-nowrap border-b border-[var(--border-color-primary)];
  }

  .label {
    @apply -mb-[1px] flex items-center rounded-t-[var(--container-radius)] border border-b-0 border-[var(--border-color-primary)] px-[var(--size-4)] py-[var(--size-1)] font-[var(--section-header-text-weight)] text-[var(--body-text-color)];
    background: var(--background-fill-primary);
    font-size: var(--section-header-text-size);
  }

  .tab-item {
    @apply flex flex-col gap-3 rounded-b-[var(--container-radius)] border border-t-0 border-[var(--border-color-primary)] p-[var(--block-padding)];
  }
</style>
