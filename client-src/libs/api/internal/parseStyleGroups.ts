import type { StyleGroup } from "#/styles";
import { hasProperty } from "#/util/object";

export function parseStyleGroups(json: unknown): StyleGroup[] {
  if (!Array.isArray(json)) return [];
  return json.filter(isStyleGroup);
}

function isStyleGroup(obj: unknown): obj is StyleGroup {
  if (obj == null || typeof obj !== "object") return false;
  if (!hasProperty(obj, "name")) return false;
  if (!hasProperty(obj, "styles")) return false;
  return typeof obj["name"] === "string" && Array.isArray(obj["styles"]);
}
