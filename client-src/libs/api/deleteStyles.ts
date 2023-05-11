import { parseStyleGroups } from "./internal/parseStyleGroups";

export type StylesDeletionRequest = {
  group: string;
  styles: string[];
};

export function deleteStyles(request: StylesDeletionRequest): Promise<StyleGroup[]> {
  return fetch("/better-style-api/v1/delete-styles", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((response) => response.json())
    .then(parseStyleGroups);
}
