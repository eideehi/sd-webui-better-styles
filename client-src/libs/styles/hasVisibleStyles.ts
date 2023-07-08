import { type StyleGroup, getVisibleStyles } from ".";

export function hasVisibleStyles(group: StyleGroup, checkpoint: string): boolean {
  return getVisibleStyles(group, checkpoint).length > 0;
}
