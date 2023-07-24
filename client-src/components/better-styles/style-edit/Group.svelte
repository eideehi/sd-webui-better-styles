<script lang="ts">
  import { styleGroups } from "#/store";
  import { Group } from "~/messages";
  import TextField from "./TextField.svelte";

  export let group: string;

  let suggests: string[];
  $: suggests = $styleGroups
    .filter((value) => value.styles.length > 0)
    .map((value) => value.name)
    .filter((value) => value.toLowerCase().includes(group.toLowerCase()));
</script>

<div class="group">
  <TextField label={Group()} bind:value={group} {suggests} required={true} />
</div>
