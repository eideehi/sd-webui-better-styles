import type { Style } from "#/styles";
import { propertyTypeEquals } from "#/util/object";

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
  if (!propertyTypeEquals(obj, "prompt", "string")) return false;
  if (!propertyTypeEquals(obj, "negativePrompt", "string")) return false;
  if (!propertyTypeEquals(obj, "samplingMethod", "string")) return false;
  if (!propertyTypeEquals(obj, "samplingSteps", "number")) return false;
  if (!propertyTypeEquals(obj, "cfgScale", "number")) return false;
  if (!propertyTypeEquals(obj, "seed", "number")) return false;
  if (!propertyTypeEquals(obj, "hiresFix", "boolean")) return false;
  if (!propertyTypeEquals(obj, "upscaler", "string")) return false;
  if (!propertyTypeEquals(obj, "hiresSteps", "number")) return false;
  if (!propertyTypeEquals(obj, "denoisingStrength", "number")) return false;
  if (!propertyTypeEquals(obj, "upscaleBy", "number")) return false;
  if (!propertyTypeEquals(obj, "clipSkip", "number")) return false;
  if (!propertyTypeEquals(obj, "etaNoiseSeedDelta", "number")) return false;
  return true;
}
