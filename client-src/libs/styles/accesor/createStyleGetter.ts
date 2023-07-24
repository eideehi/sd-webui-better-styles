import type { Style } from "..";
import {
  type ValueGetter,
  createCheckpointGetter,
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
import { createImageGetter } from "./createImageGetter";

type StyleKey = keyof Omit<Style, "name">;

export type StyleGetter = { [key in StyleKey]: ValueGetter<Style[key]> };

export function createStyleGetter(tabName: ExtensionAvailableTab): StyleGetter {
  return {
    image: createImageGetter(tabName),
    checkpoint: createCheckpointGetter(),
    prompt: createPromptAccessor(tabName),
    negativePrompt: createNegativePromptAccessor(tabName),
    samplingMethod: createSamplingMethodAccessor(tabName),
    samplingSteps: createSamplingStepsAccessor(tabName),
    cfgScale: createCfgScaleAccessor(tabName),
    seed: createSeedAccessor(tabName),
    restoreFaces: createRestoreFacesAccessor(tabName),
    tiling: createTilingAccessor(tabName),
    hiresFix: createHiresFixAccessor(tabName),
    upscaler: createUpscalerAccessor(tabName),
    hiresSteps: createHiresStepsAccessor(tabName),
    denoisingStrength: createDenoisingStrengthAccessor(tabName),
    upscaleBy: createUpscaleByAccessor(tabName),
    clipSkip: createClipSkipAccessor(),
    etaNoiseSeedDelta: createEtaNoiseSeedDeltaAccessor(),
  };
}
