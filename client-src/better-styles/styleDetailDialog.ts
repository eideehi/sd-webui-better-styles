import { _ } from "../libs/utils";
import { closeModal, showModal } from "../libs/modal";

export const showStyleDetailDialog = (style: Style) => {
  const frame = document.createElement("div");
  frame.classList.add("styles-detail", "modal-content");

  const list = document.createElement("div");
  list.classList.add("field-container");
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
  close.classList.add("button", "lg", "secondary");
  close.textContent = _("Close style detail");
  close.addEventListener("click", () => {
    closeModal(frame);
  });
  frame.appendChild(close);

  showModal(frame);
};

const createField = (label: string, value: string) => {
  const container = document.createElement("div");
  container.classList.add("field");

  const labelElement = document.createElement("span");
  labelElement.textContent = label;
  labelElement.classList.add("label");
  container.appendChild(labelElement);

  const valueElement = document.createElement("p");
  valueElement.textContent = value;
  valueElement.classList.add("value");
  container.appendChild(valueElement);
  return container;
};
