/**
 * Gets the name of the current active tab in the web UI.
 * @returns The name of the current tab as a WebUiTab value.
 */
export function getCurrentTabName(): WebUiTab {
  const content = get_uiCurrentTabContent();
  if (content == null) return "other";

  const { id } = content;
  if (id.startsWith("tab_")) {
    const tabName = id.slice(4);
    switch (tabName) {
      case "txt2img":
      case "img2img":
        return tabName;
      default:
        return "other";
    }
  }
  return "other";
}
