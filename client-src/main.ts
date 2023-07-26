import "./styles/main.css";
import { getAllStyles, getImagesDir, getLocalization } from "#/api";
import { imagesDir, styleGroups, stylesUpdate } from "#/store";
import { getElement, hasElement, hidden } from "#/util/dom";
import { getBooleanOption, getCurrentTabName } from "#/util/webui";
import BetterStyles from "@/BetterStyles.svelte";
import Toast from "%/Toast.svelte";

let fetchLocalization: Nullable<Promise<void>> = null;

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

  if (!hasElement("#eidee-net-toast-container")) {
    new Toast({ target: gradioApp() });
  }
});

onUiTabChange(() => {
  const activeTab = getCurrentTabName();
  if (activeTab !== "other") {
    initializeBetterStyles(activeTab);
  }
});

function initializeBetterStyles(tabName: ExtensionAvailableTab): void {
  window.setTimeout(function init() {
    if (Object.keys(opts).length === 0) {
      window.setTimeout(init, 125);
      return;
    }

    hiddenOriginalStylesComponents(tabName);

    void Promise.all([fetchLocalization]).then(() => {
      createBetterStylesComponents(tabName);
    });
  }, 10);
}

function hiddenOriginalStylesComponents(tabName: ExtensionAvailableTab) {
  getBooleanOption("better_styles_hide_original_styles", (value) => {
    hidden(getElement(`#${tabName}_style_apply`), value);
    hidden(getElement(`#${tabName}_style_create`), value);
    hidden(getElement(`#${tabName}_styles_row`), value);
  });
}

function createBetterStylesComponents(tabName: ExtensionAvailableTab) {
  if (getElement(`#${tabName}_better_styles`)) {
    return;
  }

  const anchor = getElement(`#${tabName}_toprow ~ div:last-child`);
  if (anchor == null || anchor.parentElement == null) return;
  new BetterStyles({ target: anchor.parentElement, anchor, props: { tabName } });
}

export default {};
