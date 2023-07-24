export function uploadThumbnail(
  group: string,
  styleName: string,
  blob: Blob
): Promise<Nullable<string>> {
  const body = new FormData();
  body.append("group", group);
  body.append("style_name", styleName);
  body.append("file", blob);

  return fetch("/better-styles-api/v1/upload-thumbnail", {
    method: "POST",
    body,
  })
    .then((response) => response.json())
    .then(parseResponse);
}

function parseResponse(json: unknown): Nullable<string> {
  if (json == null || typeof json !== "object") return null;
  return typeof json["path"] === "string" ? json["path"] : null;
}
