import type { Style, StyleGroup } from "../styles";
import { parseStyleGroups } from "./internal/parseStyleGroups";

export function registerStyle(group: string, style: Partial<Style>): Promise<StyleGroup[]> {
  return fetch(`/better-styles-api/v1/register-style/${group}`, {
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
