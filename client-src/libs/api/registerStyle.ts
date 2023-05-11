import { parseStyleGroups } from "./internal/parseStyleGroups";

export type RegisterStyleRequest = {
  group: string;
  style: Partial<Style>;
};

export function registerStyle(request: RegisterStyleRequest): Promise<StyleGroup[]> {
  return fetch("/better-styles-api/v1/register-style", {
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
