import { hasProperty } from ".";

export function propertyTypeEquals(obj: object, key: string, type: string): boolean {
  return hasProperty(obj, key) && typeof obj[key] === type;
}
