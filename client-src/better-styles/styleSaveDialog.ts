import { _, hidden } from "../libs/utils";
import { getCurrentTabName, registerStyle } from "../libs/webui";
import { currentGroup, styleGroups } from "./variables";
import { closeModal, showModal } from "../libs/modal";
import { showToast } from "../libs/toast";
import { onReceiveStyleGroup } from "./betterStyles";
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

  const content = document.createElement("div");
  content.classList.add("save-style", "modal-content");

  const inputFields = document.createElement("div");
  inputFields.classList.add("input-fields");
  content.appendChild(inputFields);

  const styleName = createTextInput(_("Style name"), "");
  inputFields.appendChild(styleName.element);

  const group = createTextInput(_("Group"), _(currentGroup.getOrDefault("default")));
  inputFields.appendChild(group.element);

  const prompt = createTextarea(_("Prompt"), values.prompt || "");
  inputFields.appendChild(prompt.element);

  const negativePrompt = createTextarea(_("Negative prompt"), values.negativePrompt || "");
  inputFields.appendChild(negativePrompt.element);

  const parameters = document.createElement("div");
  parameters.classList.add("parameters");
  content.appendChild(parameters);

  const parametersLabel = document.createElement("span");
  parametersLabel.classList.add("label");
  parametersLabel.textContent = _("Save these parameters as style");
  parameters.appendChild(parametersLabel);

  const parametersFields = document.createElement("ul");
  parametersFields.classList.add("parameter-fields");
  parameters.appendChild(parametersFields);

  const samplingMethod = createCheckbox(_("Sampling method"));
  parametersFields.appendChild(samplingMethod.element);

  const samplingSteps = createCheckbox(_("Sampling steps"));
  parametersFields.appendChild(samplingSteps.element);

  const cfgScale = createCheckbox(_("CFG Scale"));
  parametersFields.appendChild(cfgScale.element);

  const seed = createCheckbox(_("Seed"));
  parametersFields.appendChild(seed.element);

  const restoreFaces = createCheckbox(_("Restore faces"));
  parametersFields.appendChild(restoreFaces.element);

  const tiling = createCheckbox(_("Tiling"));
  parametersFields.appendChild(tiling.element);

  const hiresFix = createCheckbox(_("Hires. fix"));
  parametersFields.appendChild(hiresFix.element);

  const upscaler = createCheckbox(_("Upscaler"));
  parametersFields.appendChild(upscaler.element);

  const hiresSteps = createCheckbox(_("Hires steps"));
  parametersFields.appendChild(hiresSteps.element);

  const denoisingStrength = createCheckbox(_("Denoising strength"));
  parametersFields.appendChild(denoisingStrength.element);

  const upscaleBy = createCheckbox(_("Upscale by"));
  parametersFields.appendChild(upscaleBy.element);

  if (!values.hiresFix) {
    hidden(upscaler.element, true);
    hidden(hiresSteps.element, true);
    hidden(denoisingStrength.element, true);
    hidden(upscaleBy.element, true);
  }

  const clipSkip = createCheckbox(_("Clip skip"));
  parametersFields.appendChild(clipSkip.element);

  const etaNoiseSeedDelta = createCheckbox(_("Eta noise seed delta"));
  parametersFields.appendChild(etaNoiseSeedDelta.element);

  if (values.clipSkip == null) {
    hidden(clipSkip.element, true);
  }

  if (values.etaNoiseSeedDelta == null) {
    hidden(etaNoiseSeedDelta.element, true);
  }

  const otherOptions = document.createElement("div");
  otherOptions.classList.add("other-options");
  content.appendChild(otherOptions);

  const exclusive = createCheckbox(_("Make this style exclusive to the current checkpoint"));
  otherOptions.appendChild(exclusive.element);

  const image = createCheckbox(_("Use the current image as a thumbnail"));
  if (!values.image) {
    image.element.classList.add("disabled");
    image.input.disabled = true;
  }
  otherOptions.appendChild(image.element);

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");
  content.appendChild(buttons);

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
  submit.classList.add("save-button", "button", "lg", "primary");
  submit.textContent = _("Save with this content");
  submit.addEventListener("click", () => {
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
        closeModal(content);
        styleGroups.set(data);
        onReceiveStyleGroup();
        showToast(_("Style registered"), "success");
      }
    );
  });
  buttons.appendChild(submit);

  const cancel = document.createElement("button");
  cancel.classList.add("button", "lg", "secondary");
  cancel.textContent = _("Close without saving");
  cancel.addEventListener("click", () => {
    closeModal(content);
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

  styleName.input.addEventListener("input", () => {
    onUpdateRequireField();
  });
  group.input.addEventListener("input", () => {
    onUpdateRequireField();
  });

  showModal(content);
}

const createTextInput = (labelText: string, defaultValue: string) => {
  const container = document.createElement("label");
  container.classList.add("input-field");

  const label = document.createElement("span");
  label.classList.add("label");
  label.textContent = labelText;

  const input = document.createElement("textarea");
  input.classList.add("text-input", "scroll-hide");
  input.rows = 1;
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
  container.classList.add("input-field");

  const label = document.createElement("span");
  label.classList.add("label");
  label.textContent = labelText;

  const textarea = document.createElement("textarea");
  textarea.classList.add("text-input", "scroll-hide");
  textarea.rows = 3;
  textarea.value = defaultValue;

  container.appendChild(label);
  container.appendChild(textarea);
  return {
    element: container,
    textarea,
  };
};

const createCheckbox = (labelText: string) => {
  const container = document.createElement("label");
  container.classList.add("checkbox-wrapper");

  const input = document.createElement("input");
  input.type = "checkbox";
  input.addEventListener("change", () => {
    container.dataset.checked = String(input.checked);
  });

  const label = document.createElement("span");
  label.classList.add("label");
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

  selectedImage(tabName).with((value) => (style["image"] = value));
  checkpoint().with((value) => (style["checkpoint"] = value));
  prompt(tabName).with((value) => (style["prompt"] = value));
  negativePrompt(tabName).with((value) => (style["negativePrompt"] = value));
  samplingMethod(tabName).value.with((value) => (style["samplingMethod"] = value));
  samplingSteps(tabName).with((value) => (style["samplingSteps"] = value));
  cfgScale(tabName).with((value) => (style["cfgScale"] = value));
  seed(tabName).with((value) => (style["seed"] = value));
  restoreFaces(tabName).with((value) => (style["restoreFaces"] = value));
  tiling(tabName).with((value) => (style["tiling"] = value));
  hiresFix(tabName).with((value) => (style["hiresFix"] = value));
  upscaler(tabName).value.with((value) => (style["upscaler"] = value));
  hiresSteps(tabName).with((value) => (style["hiresSteps"] = value));
  denoisingStrength(tabName).with((value) => (style["denoisingStrength"] = value));
  upscaleBy(tabName).with((value) => (style["upscaleBy"] = value));
  clipSkip().with((value) => (style["clipSkip"] = value));
  etaNoiseSeedDelta().with((value) => (style["etaNoiseSeedDelta"] = value));

  return style;
}
