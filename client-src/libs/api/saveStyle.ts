import type { Style, StyleGroup } from "#/styles";
import { parseStyleGroups } from "./internal/parseStyleGroups";

export async function saveStyle(group: string, style: Partial<Style>): Promise<StyleGroup[]> {
  return fetch(`/better-styles-api/v1/save-style/${group}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(style),
  })
    .then((response) => response.json())
    .then(parseStyleGroups);
}
