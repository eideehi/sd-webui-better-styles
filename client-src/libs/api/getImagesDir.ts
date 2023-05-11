export function getImagesDir(): Promise<string> {
  return fetch(`/better-style-api/v1/images-dir?ts=${new Date().getTime()}`)
    .then((response) => response.json())
    .then(parseImagesDir);
}

function parseImagesDir(json: unknown): string {
  if (typeof json !== "object") return "";
  return typeof json["imagesDir"] !== "string" ? "" : json["imagesDir"];
}
