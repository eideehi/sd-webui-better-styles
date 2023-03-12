import { _ } from "./utils";
import { getCurrentTabName, registerStyle } from "./webui";
import { currentGroup, styleGroups } from "./variables";
import { closeModal, showModal } from "./modal";
import { showToast } from "./toast";
import { onRecieveStyleGroup } from "./betterStyles";
import {
  cfgScale,
  checkpoint,
  clipSkip,
  denoisingStrength,
  etaNoiseSeedDelta,
  hiresFix,
  hiresSteps,
  negativePrompt,
  prompt,
  restoreFaces,
  samplingMethod,
  samplingSteps,
  seed,
  selectedImage,
  tiling,
  upscaleBy,
  upscaler,
} from "./styleValues";

export function showStyleSaveDialog() {
  const tabName = getCurrentTabName();
  if (tabName === "other") {
    return;
  }

  const values = captureStyleValues(tabName);

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
    "gap-y-6",
    "select-none"
  );
  frame.style.width = "clamp(20rem, 70vw, 42.5rem)";
  frame.style.boxShadow = "0px 0px 4px 0.25rem rgb(8 8 8 / 50%)";

  const styleName = createTextInput(_("Style name"), "");
  frame.appendChild(styleName.element);

  const group = createTextInput(_("Group"), _(currentGroup.getOrDefault("default")));
  frame.appendChild(group.element);

  const prompt = createTextarea(_("Prompt"), values.prompt || "");
  frame.appendChild(prompt.element);

  const negativePrompt = createTextarea(_("Negative prompt"), values.negativePrompt || "");
  frame.appendChild(negativePrompt.element);

  const paramaters = document.createElement("div");
  paramaters.classList.add("flex", "flex-wrap", "gap-2", "pt-4", "relative");
  frame.appendChild(paramaters);

  const paramatersLabel = document.createElement("span");
  paramatersLabel.classList.add(
    "text-gray-500",
    "text-[0.855rem]",
    "mb-2",
    "block",
    "dark:text-gray-200",
    "!border-0"
  );
  paramatersLabel.textContent = _("Save these parameters as style");
  paramaters.appendChild(paramatersLabel);

  const samplingMethod = createParameterCheckbox(_("Sampling method"));
  paramaters.appendChild(samplingMethod.element);

  const samplingSteps = createParameterCheckbox(_("Sampling steps"));
  paramaters.appendChild(samplingSteps.element);

  const cfgScale = createParameterCheckbox(_("CFG Scale"));
  paramaters.appendChild(cfgScale.element);

  const seed = createParameterCheckbox(_("Seed"));
  paramaters.appendChild(seed.element);

  const restoreFaces = createParameterCheckbox(_("Restore faces"));
  paramaters.appendChild(restoreFaces.element);

  const tiling = createParameterCheckbox(_("Tiling"));
  paramaters.appendChild(tiling.element);

  const hiresFix = createParameterCheckbox(_("Hires. fix"));
  paramaters.appendChild(hiresFix.element);

  const upscaler = createParameterCheckbox(_("Upscaler"));
  paramaters.appendChild(upscaler.element);

  const hiresSteps = createParameterCheckbox(_("Hires steps"));
  paramaters.appendChild(hiresSteps.element);

  const denoisingStrength = createParameterCheckbox(_("Denoising strength"));
  paramaters.appendChild(denoisingStrength.element);

  const upscaleBy = createParameterCheckbox(_("Upscale by"));
  paramaters.appendChild(upscaleBy.element);

  if (!values.hiresFix) {
    upscaler.element.classList.add("!hidden");
    hiresSteps.element.classList.add("!hidden");
    denoisingStrength.element.classList.add("!hidden");
    upscaleBy.element.classList.add("!hidden");
  }

  const clipSkip = createParameterCheckbox(_("Clip skip"));
  paramaters.appendChild(clipSkip.element);

  const etaNoiseSeedDelta = createParameterCheckbox(_("Eta noise seed delta"));
  paramaters.appendChild(etaNoiseSeedDelta.element);

  if (values.clipSkip == null) {
    clipSkip.element.classList.add("!hidden");
  }

  if (values.etaNoiseSeedDelta == null) {
    etaNoiseSeedDelta.element.classList.add("!hidden");
  }

  const exclusive = createCheckbox(_("Make this style exclusive to the current checkpoint"));
  frame.appendChild(exclusive.element);

  const image = createCheckbox(_("Use the current image as a thumbnail"));
  if (!values.image) {
    image.element.classList.remove("text-gray-700", "cursor-pointer");
    image.element.classList.add("text-gray-400");
    image.input.disabled = true;
  }
  frame.appendChild(image.element);

  const buttons = document.createElement("div");
  buttons.classList.add("flex", "gap-x-2");
  frame.appendChild(buttons);

  const createStyle = () => {
    const style: Omit<Style, "name"> = {};
    if (exclusive.input.checked) {
      style["checkpoint"] = values.checkpoint;
    }
    if (image.input.checked) {
      style["image"] = values.image;
    }
    if (prompt.textarea.value) {
      style["prompt"] = prompt.textarea.value;
    }
    if (negativePrompt.textarea.value) {
      style["negativePrompt"] = negativePrompt.textarea.value;
    }
    if (samplingMethod.input.checked) {
      style["samplingMethod"] = values.samplingMethod;
    }
    if (samplingSteps.input.checked) {
      style["samplingSteps"] = values.samplingSteps;
    }
    if (cfgScale.input.checked) {
      style["cfgScale"] = values.cfgScale;
    }
    if (seed.input.checked) {
      style["seed"] = values.seed;
    }
    if (restoreFaces.input.checked) {
      style["restoreFaces"] = values.restoreFaces;
    }
    if (tiling.input.checked) {
      style["tiling"] = values.tiling;
    }
    if (hiresFix.input.checked) {
      style["hiresFix"] = values.hiresFix;
    }
    if (upscaler.input.checked) {
      style["upscaler"] = values.upscaler;
    }
    if (hiresSteps.input.checked) {
      style["hiresSteps"] = values.hiresSteps;
    }
    if (denoisingStrength.input.checked) {
      style["denoisingStrength"] = values.denoisingStrength;
    }
    if (upscaleBy.input.checked) {
      style["upscaleBy"] = values.upscaleBy;
    }
    if (clipSkip.input.checked) {
      style["clipSkip"] = values.clipSkip;
    }
    if (etaNoiseSeedDelta.input.checked) {
      style["etaNoiseSeedDelta"] = values.etaNoiseSeedDelta;
    }
    return style;
  };

  const submit = document.createElement("button");
  submit.classList.add("gr-button", "gr-button-lg", "grow");
  submit.textContent = _("Save with this content");
  submit.addEventListener("click", (event) => {
    // If the user is using a language other than English, the word "default" may have been translated, so let's revert it here.
    const getGroupValue = (value: string) => (value === _("default") ? "default" : value);

    registerStyle(
      {
        group: getGroupValue(group.input.value),
        style: {
          name: styleName.input.value,
          ...createStyle(),
        },
      },
      (data) => {
        closeModal(frame);
        styleGroups.set(data);
        onRecieveStyleGroup();
        showToast(_("Style registered"), "success");
      }
    );
  });
  buttons.appendChild(submit);

  const cancel = document.createElement("button");
  cancel.classList.add("gr-button", "gr-button-lg");
  cancel.textContent = _("Close without saving");
  cancel.addEventListener("click", (event) => {
    closeModal(frame);
  });
  buttons.appendChild(cancel);

  const onUpdateRequireField = () => {
    const disabled = !styleName.input.value || !group.input.value;
    submit.disabled = disabled;
    if (disabled) {
      submit.classList.remove("gr-button", "gr-button-primary");
      submit.classList.add("gr-box", "gr-check-radio");
    } else {
      submit.classList.remove("gr-box", "gr-check-radio");
      submit.classList.add("gr-button", "gr-button-primary");
    }
  };

  onUpdateRequireField();

  styleName.input.addEventListener("input", (event) => {
    onUpdateRequireField();
  });
  group.input.addEventListener("input", (event) => {
    onUpdateRequireField();
  });

  showModal(frame);
}

const createTextInput = (labelText: string, defaultValue: string) => {
  const container = document.createElement("label");
  container.classList.add("inline-flex", "flex-col", "relative");

  const label = document.createElement("span");
  label.classList.add("text-gray-500", "text-[0.855rem]", "mb-2", "block", "dark:text-gray-200");
  label.textContent = labelText;

  const input = document.createElement("input");
  input.classList.add("gr-box", "gr-input", "gr-text-input");
  input.value = defaultValue;

  container.appendChild(label);
  container.appendChild(input);
  return {
    element: container,
    input,
  };
};

const createTextarea = (labelText: string, defaultValue: string) => {
  const container = document.createElement("label");
  container.classList.add("inline-flex", "flex-col", "relative");

  const label = document.createElement("span");
  label.classList.add("text-gray-500", "text-[0.855rem]", "mb-2", "block", "dark:text-gray-200");
  label.textContent = labelText;

  const textarea = document.createElement("textarea");
  textarea.classList.add(
    "gr-box",
    "gr-input",
    "gr-text-input",
    "scroll-hide",
    "!overflow-y-scroll",
    "resize-none"
  );
  textarea.rows = 3;
  textarea.value = defaultValue;

  container.appendChild(label);
  container.appendChild(textarea);
  return {
    element: container,
    textarea,
  };
};

const createParameterCheckbox = (labelText: string) => {
  const container = document.createElement("label");
  container.classList.add(
    "gr-input-label",
    "flex",
    "items-center",
    "text-gray-700",
    "text-sm",
    "space-x-2",
    "border",
    "py-1.5",
    "px-3",
    "rounded-lg",
    "cursor-pointer",
    "bg-white",
    "shadow-sm",
    "checked:shadow-inner"
  );

  const input = document.createElement("input");
  input.type = "checkbox";
  input.classList.add("gr-check-radio", "gr-checkbox");
  input.addEventListener("change", (event) => {
    container.dataset.checked = String(input.checked);
  });

  const label = document.createElement("span");
  label.classList.add("ml-2");
  label.textContent = labelText;

  container.appendChild(input);
  input.after(label);
  return {
    element: container,
    input,
  };
};

const createCheckbox = (labelText: string) => {
  const container = document.createElement("label");
  container.classList.add(
    "flex",
    "items-center",
    "text-gray-700",
    "text-sm",
    "space-x-2",
    "rounded-lg",
    "cursor-pointer",
    "dark:bg-transparent"
  );

  const input = document.createElement("input");
  input.type = "checkbox";
  input.classList.add("gr-check-radio", "gr-checkbox");
  input.addEventListener("change", (event) => {
    container.dataset.checked = String(input.checked);
  });

  const label = document.createElement("span");
  label.classList.add("ml-2");
  label.textContent = labelText;

  container.appendChild(input);
  input.after(label);
  return {
    element: container,
    input,
  };
};

function captureStyleValues(tabName: StylesAvailableTab) {
  const style: Omit<Style, "name"> = {};

  selectedImage(tabName).with((value) => style["image"] = value);
  checkpoint().with((value) => style["checkpoint"] = value);
  prompt(tabName).with((value) => style["prompt"] = value);
  negativePrompt(tabName).with((value) => style["negativePrompt"] = value);
  samplingMethod(tabName).value.with((value) => style["samplingMethod"] = value);
  samplingSteps(tabName).with((value) => style["samplingSteps"] = value);
  cfgScale(tabName).with((value) => style["cfgScale"] = value);
  seed(tabName).with((value) => style["seed"] = value);
  restoreFaces(tabName).with((value) => style["restoreFaces"] = value);
  tiling(tabName).with((value) => style["tiling"] = value);
  hiresFix(tabName).with((value) => style["hiresFix"] = value);
  upscaler(tabName).value.with((value) => style["upscaler"] = value);
  hiresSteps(tabName).with((value) => style["hiresSteps"] = value);
  denoisingStrength(tabName).with((value) => style["denoisingStrength"] = value);
  upscaleBy(tabName).with((value) => style["upscaleBy"] = value);
  clipSkip().with((value) => style["clipSkip"] = value);
  etaNoiseSeedDelta().with((value) => style["etaNoiseSeedDelta"] = value);

  return style;
}
