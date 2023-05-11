<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { closeToast, type ToastMessage, toastMessages } from "@/libs/util/toast";
  import { isDarkMode } from "@/libs/util";

  function setCloseTimer(message: ToastMessage): void {
    window.setTimeout(() => closeToast(message), message.duration || 3000);
  }
</script>

<div class="toast-container">
  {#each $toastMessages as message}
    <button
      class="message {message.type}"
      class:dark={isDarkMode()}
      in:fly={{ y: 128, duration: 250 }}
      out:fade
      on:introend={() => setCloseTimer(message)}
      on:click={() => closeToast(message)}
    >
      {message.text}
    </button>
  {/each}
</div>

<style lang="postcss">
  .toast-container {
    @apply fixed inset-x-0 bottom-4 z-[1000] m-auto flex w-fit flex-col gap-y-2;
  }

  .message {
    @apply cursor-pointer rounded-sm border-none px-4 py-2 text-xl font-bold text-white;
  }

  .message.info {
    @apply bg-[#323bfa];
  }

  .message.success {
    @apply bg-[#1ced41];
  }

  .message.warning {
    @apply bg-[#f97316];
  }

  .message.error {
    @apply bg-[#e44939];
  }
</style>
