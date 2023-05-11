export function parseStyleGroups(json: unknown): StyleGroup[] {
  if (!Array.isArray(json)) return [];
  return json.filter(isStyleGroup);
}

function isStyleGroup(obj: unknown): obj is StyleGroup {
  if (typeof obj !== "object") return false;
  if (typeof obj["name"] !== "string") return false;
  return Array.isArray(obj["styles"]);
}