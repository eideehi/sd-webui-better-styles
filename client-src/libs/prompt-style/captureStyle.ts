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
} from "@/libs/prompt-style/values";

export type CapturedStyle = Partial<Omit<Style, "name">>;

export function captureStyle(tabName: StylesAvailableTab): CapturedStyle {
  const style: CapturedStyle = {};

  selectedImage(tabName).with((value) => (style["image"] = value));
  checkpoint().with((value) => (style["checkpoint"] = value));
  prompt(tabName).with((value) => (style["prompt"] = value));
  negativePrompt(tabName).with((value) => (style["negativePrompt"] = value));
  samplingMethod(tabName).with((value) => (style["samplingMethod"] = value));
  samplingSteps(tabName).with((value) => (style["samplingSteps"] = value));
  cfgScale(tabName).with((value) => (style["cfgScale"] = value));
  seed(tabName).with((value) => (style["seed"] = value));
  restoreFaces(tabName).with((value) => (style["restoreFaces"] = value));
  tiling(tabName).with((value) => (style["tiling"] = value));
  hiresFix(tabName).with((value) => (style["hiresFix"] = value));
  upscaler(tabName).with((value) => (style["upscaler"] = value));
  hiresSteps(tabName).with((value) => (style["hiresSteps"] = value));
  denoisingStrength(tabName).with((value) => (style["denoisingStrength"] = value));
  upscaleBy(tabName).with((value) => (style["upscaleBy"] = value));
  clipSkip().with((value) => (style["clipSkip"] = value));
  etaNoiseSeedDelta().with((value) => (style["etaNoiseSeedDelta"] = value));

  return style;
}
