<script lang="ts">
  import { onMount, tick } from "svelte";
  import { getElement, getElementAll } from "#/util/dom";
  import Dropdown from "./widgets/Dropdown.svelte";

  export let label: string;
  export let title: Nullable<string> = null;
  export let value: Nullable<string>;
  export let srcElementId: string;
  export let options: string[] = [];

  onMount(async () => {
    const input = getElement(`#${srcElementId} input`);
    if (input == null) return;

    input.dispatchEvent(new Event("focus"));
    await tick();

    options = getElementAll(`#${srcElementId} ul > li[data-value]`)
      .map((element) => element.dataset.value || "")
      .filter((value) => value.length > 0);

    input.dispatchEvent(new Event("blur"));
  });
</script>

<Dropdown {label} {title} bind:value {options} />
