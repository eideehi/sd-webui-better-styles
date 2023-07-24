import type { Style } from "#/styles";

export type DefaultStyle = Omit<Style, "name" | "image" | "checkpoint">;

export function getDefaultStyle(tabName: ExtensionAvailableTab): Promise<DefaultStyle> {
  return fetch(`/better-styles-api/v1/get-default-style/${tabName}?ts=${new Date().getTime()}`)
    .then((response) => response.json())
    .then(parseResponse);
}

function parseResponse(json: unknown): DefaultStyle {
  if (json == null || typeof json !== "object" || !isDefaultStyle(json))
    throw new Error(`Illegal api response: ${JSON.stringify(json)}`);

  return json;
}

function isDefaultStyle(obj: object): obj is DefaultStyle {
  if (typeof obj["prompt"] !== "string") return false;
  if (typeof obj["negativePrompt"] !== "string") return false;
  if (typeof obj["samplingMethod"] !== "string") return false;
  if (typeof obj["samplingSteps"] !== "number") return false;
  if (typeof obj["cfgScale"] !== "number") return false;
  if (typeof obj["seed"] !== "number") return false;
  if (typeof obj["restoreFaces"] !== "boolean") return false;
  if (typeof obj["tiling"] !== "boolean") return false;
  if (typeof obj["hiresFix"] !== "boolean") return false;
  if (typeof obj["upscaler"] !== "string") return false;
  if (typeof obj["hiresSteps"] !== "number") return false;
  if (typeof obj["denoisingStrength"] !== "number") return false;
  if (typeof obj["upscaleBy"] !== "number") return false;
  if (typeof obj["clipSkip"] !== "number") return false;
  if (typeof obj["etaNoiseSeedDelta"] !== "number") return false;
  return true;
}
