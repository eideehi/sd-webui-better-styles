import type { StyleGroup } from "#/styles";
import { parseStyleGroups } from "./internal/parseStyleGroups";

export function importStylesCsv(): Promise<StyleGroup[]> {
  return fetch(`/better-styles-api/v1/import-styles-csv?ts=${new Date().getTime()}`)
    .then((response) => response.json())
    .then(parseStyleGroups);
}
