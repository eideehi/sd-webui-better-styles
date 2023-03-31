import { _ } from "./utils";
import { closeModal, showModal } from "./modal";

export const showStyleDetailDialog = (style: Style) => {
  const frame = document.createElement("div");
  frame.classList.add(
    "gr-compact",
    "gr-block",
    "gr-box",
    "!m-auto",
    "flex",
    "flex-col",
    "py-6",
    "px-4",
    "gap-y-6"
  );
  frame.style.width = "clamp(20rem, 70vw, 42.5rem)";
  frame.style.boxShadow = "0px 0px 4px 0.25rem rgb(8 8 8 / 50%)";
  frame.classList.add("relative");

  const list = document.createElement("div");
  list.classList.add("grid", "grid-cols-[max-content_1fr]", "gap-2");
  frame.appendChild(list);

  const fields = [
    { label: _("Style name"), value: _(style.name) },
    { label: _("Exclusive"), value: !style.checkpoint ? _("No") : _("Yes") },
    { label: _("Prompt"), value: style.prompt },
    { label: _("Negative prompt"), value: style.negativePrompt },
    { label: _("Sampling method"), value: style.samplingMethod },
    { label: _("Sampling steps"), value: style.samplingSteps?.toString() },
    { label: _("CFG Scale"), value: style.cfgScale?.toString() },
    { label: _("Seed"), value: style.seed?.toString() },
    { label: _("Restore faces"), value: style.restoreFaces ? _("Enabled") : undefined },
    { label: _("Tiling"), value: style.tiling ? _("Enabled") : undefined },
    { label: _("Hires. fix"), value: style.hiresFix ? _("Enabled") : undefined },
    { label: _("Upscaler"), value: style.upscaler },
    { label: _("Hires steps"), value: style.hiresSteps?.toString() },
    { label: _("Denoising strength"), value: style.denoisingStrength?.toString() },
    { label: _("Upscale by"), value: style.upscaleBy?.toString() },
    { label: _("Clip skip"), value: style.clipSkip?.toString() },
    { label: _("Eta noise seed delta"), value: style.etaNoiseSeedDelta?.toString() },
  ];

  fields.forEach(({ label, value }) => {
    if (value != null) {
      list.appendChild(createField(label, value));
    }
  });

  const close = document.createElement("button");
  close.classList.add("gr-box", "gr-button", "gr-button-lg");
  close.textContent = _("Close style detail");
  close.addEventListener("click", () => {
    closeModal(frame);
  });
  frame.appendChild(close);

  showModal(frame);
};

const createField = (label: string, value: string) => {
  const container = document.createElement("div");
  container.classList.add("contents");

  const labelElement = document.createElement("span");
  labelElement.textContent = label;
  labelElement.classList.add("text-right", "pt-3");
  labelElement.style.overflowWrap = "anywhere";
  container.appendChild(labelElement);

  const valueElement = document.createElement("p");
  valueElement.textContent = value;
  valueElement.classList.add("gr-box", "gr-padded", "border-gray-200");
  valueElement.style.overflowWrap = "anywhere";
  container.appendChild(valueElement);
  return container;
};
