import {
  type Style,
  createCfgScaleAccessor,
  createClipSkipAccessor,
  createDenoisingStrengthAccessor,
  createEtaNoiseSeedDeltaAccessor,
  createHiresFixAccessor,
  createHiresStepsAccessor,
  createImageGetter,
  createNegativePromptAccessor,
  createPromptAccessor,
  createRestoreFacesAccessor,
  createSamplingMethodAccessor,
  createSamplingStepsAccessor,
  createSeedAccessor,
  createTilingAccessor,
  createUpscaleByAccessor,
  createUpscalerAccessor,
} from ".";

export function getCurrentStyle(tabName: ExtensionAvailableTab): Style {
  const style: Style = { name: "" };
  createImageGetter(tabName).with((value) => (style.image = value));
  createPromptAccessor(tabName).with((value) => (style.prompt = value));
  createNegativePromptAccessor(tabName).with((value) => (style.negativePrompt = value));
  createSamplingMethodAccessor(tabName).with((value) => (style.samplingMethod = value));
  createSamplingStepsAccessor(tabName).with((value) => (style.samplingSteps = value));
  createCfgScaleAccessor(tabName).with((value) => (style.cfgScale = value));
  createSeedAccessor(tabName).with((value) => (style.seed = value));
  createRestoreFacesAccessor(tabName).with((value) => (style.restoreFaces = value));
  createTilingAccessor(tabName).with((value) => (style.tiling = value));
  createHiresFixAccessor(tabName).with((value) => (style.hiresFix = value));
  createUpscalerAccessor(tabName).with((value) => (style.upscaler = value));
  createHiresStepsAccessor(tabName).with((value) => (style.hiresSteps = value));
  createDenoisingStrengthAccessor(tabName).with((value) => (style.denoisingStrength = value));
  createUpscaleByAccessor(tabName).with((value) => (style.upscaleBy = value));
  createClipSkipAccessor().with((value) => (style.clipSkip = value));
  createEtaNoiseSeedDeltaAccessor().with((value) => (style.etaNoiseSeedDelta = value));
  return style;
}
