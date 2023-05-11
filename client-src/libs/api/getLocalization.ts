export function getLocalization(): Promise<Record<string, string>> {
  return fetch(`/better-style-api/v1/get-localization?ts=${new Date().getTime()}`)
    .then((response) => response.json())
    .then(parseLocalization);
}

function parseLocalization(json: unknown): Record<string, string> {
  if (typeof json !== "object") return {};
  return isLocalization(json) ? json : {};
}

function isLocalization(obj: object): obj is Record<string, string> {
  return Object.values(obj).every((value) => typeof value === "string");
}
