<script lang="ts">
  import { RequiredError } from "~/messages";
  import TextInput from "./widgets/TextInput.svelte";

  export let label: string;
  export let title: Nullable<string> = null;
  export let value: string;
  export let suggests: string[] = [];
  export let required = false;
  export let validators: Array<{ validate: (value: string) => boolean; error: string }> = [];

  let error = "";
  const validation = () => {
    error = "";

    if (required) {
      if (value.length === 0) {
        error = RequiredError();
        return;
      }
    }

    for (let validator of validators) {
      if (!validator.validate(value)) {
        error = validator.error;
        return;
      }
    }
  };
</script>

<div class="text-field">
  <TextInput
    {label}
    {title}
    bind:value
    {suggests}
    on:input={validation}
    on:blur={validation}
    on:acceptsuggest={validation}
  />
  {#if error.length > 0}
    <div class="error">{error}</div>
  {/if}
</div>

<style lang="postcss">
  .error {
    @apply text-[red];
  }
</style>
