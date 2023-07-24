<script lang="ts">
  import { onMount } from "svelte";
  import { getElement } from "#/util/dom";
  import RangeInput from "./widgets/RangeInput.svelte";

  export let label: string;
  export let value: Nullable<number>;
  export let srcElementId: string;

  let min = 0;
  let max = value || 0;
  let step = 0.1;
  onMount(() => {
    const input = getElement(`#${srcElementId} input[type="number"]`);
    if (input == null || !(input instanceof HTMLInputElement)) return;
    const { min: _min, max: _max, step: _step } = input;
    min = Number(_min);
    max = Number(_max);
    step = Number(_step);
  });
</script>

<RangeInput {label} bind:value {min} {max} {step} />
