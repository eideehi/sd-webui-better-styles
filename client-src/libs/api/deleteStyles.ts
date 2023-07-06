import { parseStyleGroups } from "./internal/parseStyleGroups";

export function deleteStyles(group: string, styleNames: string[]): Promise<StyleGroup[]> {
  return fetch(`/better-styles-api/v1/delete-styles/${group}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(styleNames),
  })
    .then((response) => response.json())
    .then(parseStyleGroups);
}
