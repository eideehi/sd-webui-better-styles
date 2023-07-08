<script lang="ts">
  import { _ } from "@/libs/util";
  import { generateId } from "@/libs/util/modal";
  import { getModal } from "#/modal/Modal.svelte";
  import Button from "#/widgets/Button.svelte";
  import SaveStyleDialog from "./SaveStyleDialog.svelte";

  const id = generateId();
</script>

<SaveStyleDialog {id} />

<Button on:click={() => getModal(id)?.open()}>{_("Save style")}</Button>
