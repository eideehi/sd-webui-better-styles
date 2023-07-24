<script lang="ts" context="module">
  const CANVAS_SIZE = 768;
  const RENDER_BASE = 512;
  const OUTPUT_SIZE = 512;
</script>

<script lang="ts">
  import { throttle } from "#/util/lang";

  import { afterUpdate, createEventDispatcher } from "svelte";

  export let imageUrl: string;
  export let scale = 1;
  export let offsetX = 0;
  export let offsetY = 0;

  const dispatch = createEventDispatcher<{ output: HTMLCanvasElement }>();

  let canvas: Nullable<HTMLCanvasElement>;
  let context: Nullable<CanvasRenderingContext2D>;
  let image: Nullable<HTMLImageElement>;

  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  const captureOutput = (offset: number, size: number) => {
    if (canvas == null) return;

    const outputCanvas = document.createElement("canvas");
    const outputContext = outputCanvas.getContext("2d");
    if (outputContext == null) return;

    outputCanvas.width = OUTPUT_SIZE;
    outputCanvas.height = OUTPUT_SIZE;

    outputContext.drawImage(canvas, offset, offset, size, size, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    dispatch("output", outputCanvas);
  };

  const drawCanvas = () => {
    if (canvas == null || context == null || image == null) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const renderScale = (RENDER_BASE / Math.max(image.width, image.height)) * scale;

    const imageLeft = (CANVAS_SIZE - image.width * renderScale) / 2 + offsetX;
    const imageTop = (CANVAS_SIZE - image.height * renderScale) / 2 + offsetY;

    context.drawImage(
      image,
      imageLeft,
      imageTop,
      image.width * renderScale,
      image.height * renderScale
    );

    const borderOffset = (CANVAS_SIZE - RENDER_BASE) / 2;
    const borderSize = RENDER_BASE;

    captureOutput(borderOffset, borderSize);

    context.strokeStyle = "red";
    context.lineWidth = 2;
    context.strokeRect(borderOffset, borderOffset, borderSize, borderSize);
  };

  const onMouseDown = ({ clientX, clientY }: MouseEvent) => {
    dragging = true;
    lastX = clientX;
    lastY = clientY;
  };

  const onMouseMove = ({ clientX, clientY }: MouseEvent) => {
    if (!dragging) return;

    offsetX += clientX - lastX;
    offsetY += clientY - lastY;
    lastX = clientX;
    lastY = clientY;
  };

  const onMouseUp = () => (dragging = false);

  $: context = canvas?.getContext("2d");

  $: if (imageUrl.length > 0) {
    const _image = new Image();
    _image.onload = () => {
      image = _image;
      window.setTimeout(drawCanvas, 10);
    };
    _image.src = imageUrl;
  }

  afterUpdate(throttle(drawCanvas, 2));
</script>

<svelte:body on:mousemove={onMouseMove} on:mouseup={onMouseUp} on:mouseleave={onMouseUp} />

<canvas class="image-crop" bind:this={canvas} on:mousedown={onMouseDown} />

<style lang="postcss">
  .image-crop {
    @apply rounded-[--input-radius] border-[length:--input-border-width] border-[--input-border-color] [background:--input-background-fill];
  }
</style>
