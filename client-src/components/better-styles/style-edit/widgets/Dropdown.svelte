<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { getElement, scrollIntoViewIfNeeded } from "#/util/dom";
  import { includesIgnoreCase } from "#/util/string";
  import TriangleIcon from "~icons/mdi/triangle-small-down";

  export let label: string;
  export let title: Nullable<string> = null;
  export let value: Nullable<string>;
  export let options: string[];

  let inputValue = value || "";
  let inputWidth = 0;
  let filteredOptions: string[] = [];

  let root: Nullable<HTMLElement>;
  let showOptions = false;
  let virtualFocusIndex = -1;

  const updateOptionsVisivility = ({ target }: Event) => {
    showOptions = false;
    if (target === root || !(target instanceof HTMLElement)) return;

    let element: Nullable<HTMLElement> = target;
    do {
      if (element == null) break;
      element = element.parentElement;
    } while (!(showOptions = element === root));
  };

  const onInputFocused = (event: Event) => {
    inputValue = "";
    virtualFocusIndex = options.findIndex((option) => option === value) + 1;
    updateOptionsVisivility(event);
  };

  const selectOption = (option: Nullable<string>) => {
    showOptions = false;
    if (option == null || !option.includes(option)) return;
    value = option.length === 0 ? null : option;
  };

  const getVirtualFocusedElement = () => {
    if (root == null) return null;
    if (virtualFocusIndex < 0 && virtualFocusIndex >= filteredOptions.length) return null;
    return getElement(root, `.options > .option:nth-child(${virtualFocusIndex + 1})`);
  };

  const scrollOnVirtualFocusedElement = () => {
    const element = getVirtualFocusedElement();
    if (element != null && element.parentElement != null) {
      scrollIntoViewIfNeeded(element, element.parentElement);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!showOptions) return;

    switch (event.key) {
      case "Escape":
        showOptions = false;
        break;
      case "Enter":
        selectOption(getVirtualFocusedElement()?.dataset.value);
        break;
      case "ArrowDown":
        if (++virtualFocusIndex >= filteredOptions.length) {
          virtualFocusIndex = 0;
        }
        scrollOnVirtualFocusedElement();
        event.preventDefault();
        break;
      case "ArrowUp":
        if (--virtualFocusIndex <= -1) {
          virtualFocusIndex = filteredOptions.length - 1;
        }
        scrollOnVirtualFocusedElement();
        event.preventDefault();
        break;
    }
  };

  $: {
    if (showOptions) {
      filteredOptions = ["", ...options].filter((value) => includesIgnoreCase(value, inputValue));
      if (filteredOptions.length <= virtualFocusIndex) {
        virtualFocusIndex = 0;
      }
      window.setTimeout(scrollOnVirtualFocusedElement, 160);
    } else {
      inputValue = value || "";
      filteredOptions = [];
      virtualFocusIndex = -1;
    }
  }
</script>

<svelte:window on:blur={() => (showOptions = false)} />
<svelte:body on:mousedown={updateOptionsVisivility} />

<div class="dropdown" bind:this={root}>
  <label>
    <span {title}>{label}</span>
    <div class="input" bind:offsetWidth={inputWidth}>
      <input
        class="dropdown-input"
        type="text"
        bind:value={inputValue}
        on:focus={onInputFocused}
        on:keydown={onKeyDown}
      />
      <TriangleIcon />
    </div>
  </label>

  {#if showOptions && filteredOptions.length > 0}
    <ul class="options" style:--width="{inputWidth}px" transition:fade={{ duration: 150 }}>
      {#each filteredOptions as option, i (option)}
        <li
          class="option"
          class:selected={option === value}
          class:focused={i === virtualFocusIndex}
          data-value={option}
          transition:slide|global={{ duration: 150 }}
        >
          <button on:mousedown|stopPropagation={() => selectOption(option)}>
            {option}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style lang="postcss">
  .dropdown {
    @apply relative;
  }

  .input {
    @apply inline-flex items-center px-[--spacing-xl] py-[--size-1];
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .input > :global(.icon) {
    @apply text-[length:--text-xxl];
  }

  .dropdown-input {
    @apply flex-grow p-0;
  }

  .options {
    @apply absolute z-[--layer-5] mt-1 max-h-[min(512px,60vh)] w-[--width] list-none overflow-y-auto rounded-[--radius-lg] border border-[--input-border-color] [background:--background-fill-primary];
  }

  .option {
    @apply flex;
  }

  .option:is(.selected, .focused, :hover) {
    @apply [background:--neutral-100];
  }

  :global(.dark) .option:is(.selected, .focused, :hover) {
    @apply [background:--neutral-900];
  }

  .option > button {
    @apply flex-grow p-[--block-label-padding] ps-[--spacing-xl] text-start;
  }

  .option > button:empty::before {
    @apply invisible [content:"dummy"];
  }
</style>
