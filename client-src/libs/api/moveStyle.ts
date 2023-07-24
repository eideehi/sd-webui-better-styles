import type { Style, StyleGroup } from "#/styles";
import { parseStyleGroups } from "./internal/parseStyleGroups";

export type MoveStyleRequest = {
  fromGroup: string;
  toGroup: string;
  originalStyleName: string;
  style: Style;
};

export async function moveStyle(request: MoveStyleRequest): Promise<StyleGroup[]> {
  return fetch("/better-styles-api/v1/move-style", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from_group: request.fromGroup,
      to_group: request.toGroup,
      original_style_name: request.originalStyleName,
      style: request.style,
    }),
  })
    .then((response) => response.json())
    .then(parseStyleGroups);
}
