<script lang="ts">
  import { generateRandomId } from "#/util/string";

  export let label: string;
  export let value: Nullable<number>;
  export let min: number;
  export let max: number;
  export let step: number;

  const id = `range-input-${generateRandomId(8)}`;

  let slider: Nullable<HTMLInputElement>;
  const onWheel = (event: WheelEvent) => {
    if (slider == null || document.activeElement !== slider) return;

    event.preventDefault();

    if (value == null) {
      value = Number(min);
      return;
    }

    const direction = event.deltaY < 0 ? 1 : -1;
    if (direction > 0 && value >= max) return;
    if (direction < 0 && value <= min) return;

    value = (value * 1000 + step * 1000 * direction) / 1000;
  };
</script>

<div class="range-input" on:wheel={onWheel}>
  <label for={id}>{label}</label>
  <input class="number-input input" type="number" bind:value {min} {max} {step} />
  <input {id} class="slider" type="range" bind:value {min} {max} {step} bind:this={slider} />
</div>

<style lang="postcss">
  .range-input {
    @apply grid flex-grow grid-cols-[1fr_max-content] grid-rows-[min-content_1fr] items-baseline gap-1;
  }

  .number-input {
    @apply h-[--size-6] w-[--size-24] p-[--size-2] text-center leading-[--line-sm];
  }

  .slider {
    @apply col-span-2;
  }
</style>
