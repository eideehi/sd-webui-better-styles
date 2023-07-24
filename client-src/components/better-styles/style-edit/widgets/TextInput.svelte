<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, slide } from "svelte/transition";
  import { getElement, scrollIntoViewIfNeeded } from "#/util/dom";
  import { includesIgnoreCase } from "#/util/string";

  export let label: string;
  export let title: Nullable<string> = null;
  export let value: string;
  export let suggests: string[] = [];

  const dispatch = createEventDispatcher<{ acceptsuggest: string }>();

  let filteredSuggests: string[] = [];

  let root: Nullable<HTMLElement>;
  let showSuggests = false;
  let virtualFocusIndex = -1;

  let inputWidth = 0;

  const updateSuggestsVisivility = ({ target }: Event) => {
    showSuggests = false;
    if (target === root || !(target instanceof HTMLElement)) return;

    let element: Nullable<HTMLElement> = target;
    do {
      if (element == null) break;
      element = element.parentElement;
    } while (!(showSuggests = element === root));
  };

  const onInputFocused = (event: Event) => {
    virtualFocusIndex = suggests.findIndex((suggest) => suggest.includes(value)) + 1;
    updateSuggestsVisivility(event);
  };

  const selectSuggest = (suggest: Nullable<string>) => {
    showSuggests = false;
    if (suggest == null || !suggest.includes(suggest)) return;
    value = suggest;
    dispatch("acceptsuggest", suggest);
  };

  const getVirtualFocusedElement = () => {
    if (root == null) return null;
    if (virtualFocusIndex < 0 && virtualFocusIndex >= filteredSuggests.length) return null;
    return getElement(root, `.suggests > .suggest:nth-child(${virtualFocusIndex + 1})`);
  };

  const scrollOnVirtualFocusedElement = () => {
    const element = getVirtualFocusedElement();
    if (element != null && element.parentElement != null) {
      scrollIntoViewIfNeeded(element, element.parentElement);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!showSuggests) return;

    switch (event.key) {
      case "Escape":
        showSuggests = false;
        break;
      case "Enter":
        selectSuggest(getVirtualFocusedElement()?.dataset.value);
        break;
      case "ArrowDown":
        if (++virtualFocusIndex >= filteredSuggests.length) {
          virtualFocusIndex = 0;
        }
        scrollOnVirtualFocusedElement();
        event.preventDefault();
        break;
      case "ArrowUp":
        if (--virtualFocusIndex <= -1) {
          virtualFocusIndex = filteredSuggests.length - 1;
        }
        scrollOnVirtualFocusedElement();
        event.preventDefault();
        break;
    }
  };

  $: filteredSuggests = showSuggests
    ? suggests.filter((suggest) => includesIgnoreCase(suggest, value))
    : [];

  $: if (filteredSuggests.length > 0) {
    if (filteredSuggests.length <= virtualFocusIndex) {
      virtualFocusIndex = filteredSuggests.length - 1;
    }
    window.setTimeout(scrollOnVirtualFocusedElement, 1);
  }
</script>

<svelte:window on:blur={() => (showSuggests = false)} />
<svelte:body on:mousedown={updateSuggestsVisivility} />

<div class="text-input" bind:this={root}>
  <label bind:offsetWidth={inputWidth}>
    <span {title}>{label}</span>
    <input
      class="input"
      type="text"
      bind:value
      on:input
      on:blur
      on:focus={onInputFocused}
      on:keydown={onKeyDown}
    />
  </label>

  {#if showSuggests && filteredSuggests.length > 0}
    <ul class="suggests" style:--width="{inputWidth}px" transition:fade={{ duration: 150 }}>
      {#each filteredSuggests as suggest, i (suggest)}
        <li
          class="suggest"
          class:selected={suggest === value}
          class:focused={i === virtualFocusIndex}
          data-value={suggest}
          transition:slide|global={{ duration: 150 }}
        >
          <button on:mousedown|stopPropagation={() => selectSuggest(suggest)}>
            {suggest}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style lang="postcss">
  .text-input {
    @apply relative;
  }

  .input {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .suggests {
    @apply absolute z-[--layer-5] mt-1 max-h-[min(512px,60vh)] w-[--width] list-none overflow-y-auto rounded-[--radius-lg] border border-[--input-border-color] [background:--background-fill-primary];
  }

  .suggest {
    @apply flex;
  }

  .suggest:is(.selected, .focused, :hover) {
    @apply [background:--neutral-100];
  }

  :global(.dark) .suggest:is(.selected, .focused, :hover) {
    @apply [background:--neutral-900];
  }

  .suggest > button {
    @apply flex-grow p-[--block-label-padding] ps-[--spacing-xl] text-start;
  }

  .suggest > button:empty::before {
    @apply invisible [content:"dummy"];
  }
</style>
