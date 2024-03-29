import { hasProperty } from "#/util/object";

export function getImagesDir(): Promise<string> {
  return fetch(`/better-styles-api/v1/images-dir?ts=${new Date().getTime()}`)
    .then((response) => response.json())
    .then(parseImagesDir);
}

function parseImagesDir(json: unknown): string {
  if (json == null || typeof json !== "object") return "";
  if (!hasProperty(json, "imagesDir")) return "";
  return typeof json["imagesDir"] === "string" ? json["imagesDir"] : "";
}
