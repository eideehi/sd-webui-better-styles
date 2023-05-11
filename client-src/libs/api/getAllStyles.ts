import { parseStyleGroups } from "./internal/parseStyleGroups";

export function getAllStyles(): Promise<StyleGroup[]> {
  return fetch(`/better-style-api/v1/all-style?ts=${new Date().getTime()}`)
    .then((response) => response.json())
    .then(parseStyleGroups);
}
