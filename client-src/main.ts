import "@/assets/styles/global.css";
import { checkForUpdates, getAllStyles, getImagesDir, getLocalization } from "@/libs/api";
import { imagesDir, styleGroups, stylesUpdate } from "@/libs/store";
import { _, getCurrentTabName, getElement, hidden, withBooleanOption } from "@/libs/util";
import { showToast } from "@/libs/util/toast";
import BetterStyles from "#/better-styles/BetterStyles.svelte";
import Toast from "#/toast/Toast.svelte";

let fetchLocalization: Nullable<Promise<void>> = null;
let checkedUpdate = false;

onUiLoaded(() => {
  styleGroups.subscribe(() => {
    stylesUpdate.set(new Date().getTime());
  });

  fetchLocalization = getLocalization().then((response) => {
    Object.assign(localization, response);
  });

  void getImagesDir().then((response) => {
    imagesDir.set(response);
  });

  void getAllStyles().then((response) => {
    styleGroups.set(response);
  });

  new Toast({ target: gradioApp() });
});

onUiTabChange(async () => {
  const activeTab = getCurrentTabName();
  if (activeTab !== "other") {
    await initializeBetterStyles(activeTab);
  }
});

/**
 * Initialize Better Styles, including adding components and event listeners.
 * @param tabName Name of the tab on which Better Styles will be initialized.
 */
async function initializeBetterStyles(tabName: StylesAvailableTab): Promise<void> {
  hiddenOriginalStylesComponents(tabName);

  await Promise.all([fetchLocalization]).then(() => {
    createBetterStylesComponents(tabName);
    checkExtensionUpdates();
  });
}

/**
 * Hides original style components in the specified tab.
 * @param tabName - The name of the tab to hide original style components from.
 */
function hiddenOriginalStylesComponents(tabName: StylesAvailableTab) {
  withBooleanOption("better_styles_hide_original_styles", (value) => {
    if (value) {
      hidden(getElement(`#${tabName}_style_apply`), true);
      hidden(getElement(`#${tabName}_style_create`), true);
      hidden(getElement(`#${tabName}_styles_row`), true);
    }
  });
}

function createBetterStylesComponents(tabName: StylesAvailableTab) {
  if (getElement(`#better-styles-${tabName}-styles`)) {
    return;
  }

  const anchor = getElement(`div#${tabName}_settings`);
  if (anchor == null || anchor.parentElement == null) return;
  new BetterStyles({ target: anchor.parentElement, anchor, props: { tabName } });
}

function checkExtensionUpdates(): void {
  if (checkedUpdate) return;
  checkedUpdate = true;

  withBooleanOption("better_styles_update_notify_enabled", async (value) => {
    if (!value) return;
    await checkForUpdates().then((result) => {
      if (!result.update) return;
      showToast({
        type: "info",
        text: _("Better Styles version {0} is available", result.version),
        duration: 10000,
      });
    });
  });
}

export default {};
