<script lang="ts">
  import { CheckpointExclusive, CheckpointExclusiveTooltip } from "~/messages";
  import DropdownField from "./DropdownField.svelte";

  export let checkpoint: Nullable<string>;

  let value: Nullable<string> = null;
  let options: string[] = [];
  let init = false;

  $: {
    if (!init) {
      if (options.length > 0) {
        init = true;
        value = options.find((option) => {
          const result = option.match(/\[([0-9a-f]+)\]$/);
          if (result == null) return false;
          return checkpoint?.startsWith(result[1]);
        });
      }
    } else if (value != null) {
      const result = value.match(/\[([0-9a-f]+)\]$/);
      if (result != null) {
        checkpoint = result[1];
      }
    } else {
      checkpoint = null;
    }
  }
</script>

<DropdownField
  label={CheckpointExclusive()}
  title={CheckpointExclusiveTooltip()}
  bind:value
  bind:options
  srcElementId="setting_sd_model_checkpoint"
/>
