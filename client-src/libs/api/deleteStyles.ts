import type { StyleGroup } from "#/styles";
import { parseStyleGroups } from "./internal/parseStyleGroups";

export function deleteStyles(groupedStyleNames: Record<string, string[]>): Promise<StyleGroup[]> {
  return fetch("/better-styles-api/v1/delete-styles", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groupedStyleNames),
  })
    .then((response) => response.json())
    .then(parseStyleGroups);
}
