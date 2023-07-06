import { _ } from "@/libs/util";

export type StyleSaveData = {
  group: string;
  style: Required<Style>;
};

export function createDefaultSaveData(
  defaultValues: Partial<{ group: string; style: Partial<Style> }> = {}
): StyleSaveData {
  return Object.assign(
    {
      group: null,
      style: {
        name: null,
        image: null,
        checkpoint: null,
        prompt: null,
        negativePrompt: null,
        samplingMethod: null,
        samplingSteps: null,
        cfgScale: null,
        seed: null,
        restoreFaces: null,
        tiling: null,
        hiresFix: null,
        upscaler: null,
        hiresSteps: null,
        denoisingStrength: null,
        upscaleBy: null,
        clipSkip: null,
        etaNoiseSeedDelta: null,
      },
    },
    defaultValues
  );
}

export function cleanSaveData(saveData: StyleSaveData): { group: string; style: Partial<Style> } {
  // If the user is using a language other than English, the word "default" may have been translated, so let's revert it here.
  const decodeGroup = (value: string) => (value === _("default") ? "default" : value);

  const style: Partial<Style> = { ...saveData.style };
  for (const key in style) {
    if (style[key] == null) {
      delete style[key];
    } else if (typeof style[key] === "string" && !style[key]) {
      delete style[key];
    }
  }

  return { group: decodeGroup(saveData.group), style };
}
