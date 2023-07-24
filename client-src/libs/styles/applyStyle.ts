import {
  type Style,
  createPromptAccessor,
  createNegativePromptAccessor,
  createSamplingMethodAccessor,
  createSamplingStepsAccessor,
  createCfgScaleAccessor,
  createSeedAccessor,
  createRestoreFacesAccessor,
  createTilingAccessor,
  createHiresFixAccessor,
  createUpscalerAccessor,
  createHiresStepsAccessor,
  createDenoisingStrengthAccessor,
  createUpscaleByAccessor,
  createClipSkipAccessor,
  createEtaNoiseSeedDeltaAccessor,
} from ".";
import { concatPrompt } from "./internal/concatPrompt";

export function applyStyle(tabName: ExtensionAvailableTab, style: Style, overwrite = false): void {
  if (style.prompt != null) {
    const accessor = createPromptAccessor(tabName);
    if (overwrite) {
      accessor.set(style.prompt);
    } else {
      accessor.set(concatPrompt(accessor.getOrDefault(""), style.prompt));
    }
  }
  if (style.negativePrompt != null) {
    const accessor = createNegativePromptAccessor(tabName);
    if (overwrite) {
      accessor.set(style.negativePrompt);
    } else {
      accessor.set(concatPrompt(accessor.getOrDefault(""), style.negativePrompt));
    }
  }
  if (style.samplingMethod != null) {
    const accessor = createSamplingMethodAccessor(tabName);
    accessor.set(style.samplingMethod);
  }
  if (style.samplingSteps != null) {
    const accessor = createSamplingStepsAccessor(tabName);
    accessor.set(style.samplingSteps);
  }
  if (style.cfgScale != null) {
    const accessor = createCfgScaleAccessor(tabName);
    accessor.set(style.cfgScale);
  }
  if (style.seed != null) {
    const accessor = createSeedAccessor(tabName);
    accessor.set(style.seed);
  }
  if (style.restoreFaces != null) {
    const accessor = createRestoreFacesAccessor(tabName);
    accessor.set(style.restoreFaces);
  }
  if (style.tiling != null) {
    const accessor = createTilingAccessor(tabName);
    accessor.set(style.tiling);
  }
  if (style.hiresFix != null) {
    const accessor = createHiresFixAccessor(tabName);
    accessor.set(style.hiresFix);
  }
  if (style.upscaler != null) {
    const accessor = createUpscalerAccessor(tabName);
    accessor.set(style.upscaler);
  }
  if (style.hiresSteps != null) {
    const accessor = createHiresStepsAccessor(tabName);
    accessor.set(style.hiresSteps);
  }
  if (style.denoisingStrength != null) {
    const accessor = createDenoisingStrengthAccessor(tabName);
    accessor.set(style.denoisingStrength);
  }
  if (style.upscaleBy != null) {
    const accessor = createUpscaleByAccessor(tabName);
    accessor.set(style.upscaleBy);
  }
  if (style.clipSkip != null) {
    const accessor = createClipSkipAccessor();
    accessor.set(style.clipSkip);
  }
  if (style.etaNoiseSeedDelta != null) {
    const accessor = createEtaNoiseSeedDeltaAccessor();
    accessor.set(style.etaNoiseSeedDelta);
  }
}
