import type { StyleGroup, Style } from ".";

export function getVisibleStyles(group: StyleGroup, checkpoint: string): Style[] {
  return group.styles.filter(
    (style) => style.checkpoint == null || style.checkpoint === checkpoint
  );
}
