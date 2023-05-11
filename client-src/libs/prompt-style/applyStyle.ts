import {
  cfgScale,
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
  tiling,
  upscaleBy,
  upscaler,
} from "./values";
import { concatPrompt } from "./concatPrompt";

export function applyStyle(tabName: StylesAvailableTab, style: Style): void {
  if (style.prompt) {
    const accessor = prompt(tabName);
    accessor.set(concatPrompt(accessor.getOrDefault(""), style.prompt));
  }
  if (style.negativePrompt) {
    const accessor = negativePrompt(tabName);
    accessor.set(concatPrompt(accessor.getOrDefault(""), style.negativePrompt));
  }
  if (style.samplingMethod) {
    const accessor = samplingMethod(tabName);
    accessor.set(style.samplingMethod);
  }
  if (style.samplingSteps) {
    const accessor = samplingSteps(tabName);
    accessor.set(style.samplingSteps);
  }
  if (style.cfgScale) {
    const accessor = cfgScale(tabName);
    accessor.set(style.cfgScale);
  }
  if (style.seed) {
    const accessor = seed(tabName);
    accessor.set(style.seed);
  }
  if (style.restoreFaces) {
    const accessor = restoreFaces(tabName);
    accessor.set(style.restoreFaces);
  }
  if (style.tiling) {
    const accessor = tiling(tabName);
    accessor.set(style.tiling);
  }
  if (style.hiresFix) {
    const accessor = hiresFix(tabName);
    accessor.set(style.hiresFix);
  }
  if (style.upscaler) {
    const accessor = upscaler(tabName);
    accessor.set(style.upscaler);
  }
  if (style.hiresSteps) {
    const accessor = hiresSteps(tabName);
    accessor.set(style.hiresSteps);
  }
  if (style.denoisingStrength) {
    const accessor = denoisingStrength(tabName);
    accessor.set(style.denoisingStrength);
  }
  if (style.upscaleBy) {
    const accessor = upscaleBy(tabName);
    accessor.set(style.upscaleBy);
  }
  if (style.clipSkip) {
    const accessor = clipSkip();
    accessor.set(style.clipSkip);
  }
  if (style.etaNoiseSeedDelta) {
    const accessor = etaNoiseSeedDelta();
    accessor.set(style.etaNoiseSeedDelta);
  }
}
