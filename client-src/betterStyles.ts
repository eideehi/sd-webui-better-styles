import {
  _,
  applyClasses,
  getElement,
  getElementAll,
  hidden,
  removeAllChild,
  toggleClasses,
} from "./utils";
import { applyStyle, getCurrentTabName, registerStyle } from "./webui";
import { showToast } from "./toast";
import { currentGroup, imagesDir, styleGroups, updateTimestamp } from "./variables";
import { checkpoint, selectedImage } from "./styleValues";
import { showStyleSaveDialog } from "./styleSaveDialog";
import { showStylesDeleteDialog } from "./stylesDeleteDialog";
import { showStyleDetailDialog } from "./styleDetailDialog";

let checkpointObserverRunning = false;

export function onReceiveStyleGroup() {
  const tabName = getCurrentTabName();
  if (tabName !== "other") {
    updateTimestamp.set(`?ts=${new Date().getTime()}`);
    updateBetterStyleComponents(tabName);
  }
}

export function createBetterStylesComponents(tabName: StylesAvailableTab) {
  if (getElement(`#better-styles-${tabName}-styles`)) {
    return;
  }

  const components = document.createElement("div");
  components.id = `better-styles-${tabName}-styles`;
  hidden(components, true);
  components.classList.add("better-styles", "form");
  getElement(`div#${tabName}_settings`)?.parentElement?.before(components);

  const container = document.createElement("div");
  container.classList.add("compact", "gradio-row");
  components.appendChild(container);

  const main = document.createElement("div");
  main.classList.add("tabs", "gradio-tabs", "extra-networks");
  container.appendChild(main);

  const tools = createToolsComponent(tabName);
  main.appendChild(tools);

  const view = document.createElement("div");
  view.classList.add("tab-item");
  main.appendChild(view);

  const groups = document.createElement("div");
  groups.id = `better-styles-${tabName}-group-container`;
  groups.classList.add("group-container");
  view.appendChild(groups);

  groups.appendChild(createGroupButton("default"));
  updateGroup(tabName);

  const styles = document.createElement("div");
  styles.id = `better-styles-${tabName}-style-container`;
  styles.classList.add("styles-cards");
  view.appendChild(styles);

  styles.appendChild(createStyleEmptyContent());

  if (!checkpointObserverRunning) {
    checkpointObserverRunning = true;

    let currentCheckpoint = checkpoint().get();
    const checkForUpdate = () => {
      const tabName = getCurrentTabName();
      if (tabName !== "other") {
        const newCheckpoint = checkpoint().get();
        if (newCheckpoint !== currentCheckpoint) {
          currentCheckpoint = newCheckpoint;
          updateBetterStyleComponents(tabName);
        }
      }
      setTimeout(checkForUpdate, 500);
    };
    setTimeout(checkForUpdate, 500);
  }

  appendToolButton(tabName, components);
}

function appendToolButton(tabName: StylesAvailableTab, components: HTMLElement): void {
  const base = getElement(`#${tabName}_style_apply`);
  if (base) {
    const toggleButton = document.createElement("button");
    toggleButton.id = `better-styles-${tabName}-toggle`;
    toggleButton.textContent = "🔖";
    toggleButton.classList.add(...Array.from(base.classList));
    hidden(toggleButton, false);
    toggleButton.title = _("Show Better Styles");
    toggleButton.addEventListener("click", () => {
      hidden(components);
    });
    base.parentElement?.appendChild(toggleButton);
  }
}

function createToolsComponent(tabName: StylesAvailableTab) {
  const tools = document.createElement("div");
  tools.classList.add("tab-nav", "scroll-hide");

  const label = document.createElement("p");
  label.classList.add("label");
  label.textContent = _("Better Styles");
  tools.appendChild(label);

  const searchBar = document.createElement("textarea");
  searchBar.classList.add("text-input", "scroll-hide", "search");
  searchBar.placeholder = _("Search styles...");
  searchBar.rows = 1;
  searchBar.addEventListener("input", () => {
    getElementAll(`#better-styles-${tabName}-style-container [data-style]`).forEach((element) => {
      const style = element.dataset.style || "";
      hidden(element, !style.includes(searchBar.value));
    });
  });
  label.after(searchBar);

  const applyButton = document.createElement("button");
  applyButton.id = `better-styles-${tabName}-apply`;
  applyButton.classList.add("button", "lg", "secondary");
  applyButton.textContent = _("Apply style");
  applyButton.addEventListener("click", () => {
    const selectedStyles = [
      ...getElementAll(`#better-styles-${tabName}-style-container .selected`),
    ];
    if (selectedStyles.length <= 0) {
      showToast(_("Style is not selected"), "warning");
      return;
    }
    selectedStyles
      .filter((card) => {
        const styleName = card.dataset.style;
        return styleGroups
          .getOrDefault([])
          .filter((data) => data.name === currentGroup.get())
          .some((data) => {
            return data.styles
              .filter((stlye) => stlye.name === styleName)
              .some((style) => {
                applyStyle(tabName, style);
                return true;
              });
          });
      })
      .forEach((card) => card.click());
  });
  searchBar.after(applyButton);

  const saveButton = document.createElement("button");
  saveButton.id = `better-styles-${tabName}-save`;
  saveButton.classList.add("button", "lg", "secondary");
  saveButton.textContent = _("Save style");
  saveButton.addEventListener("click", () => {
    showStyleSaveDialog();
  });
  applyButton.after(saveButton);

  const deleteButton = document.createElement("button");
  deleteButton.id = `better-styles-${tabName}-delete`;
  deleteButton.classList.add("button", "lg", "secondary");
  deleteButton.textContent = _("Delete style");
  deleteButton.addEventListener("click", () => {
    const selectedStyles = [
      ...getElementAll(`#better-styles-${tabName}-style-container .selected`),
    ];
    if (selectedStyles.length <= 0) {
      showToast(_("Style is not selected"), "warning");
      return;
    }
    showStylesDeleteDialog(tabName);
  });
  saveButton.after(deleteButton);

  const closeButton = document.createElement("button");
  closeButton.id = `better-styles-${tabName}-close`;
  closeButton.classList.add("button", "lg", "secondary");
  closeButton.textContent = _("Close Better Styles");
  closeButton.addEventListener("click", () => {
    hidden(getElement(`#better-styles-${tabName}-styles`), true);
  });
  deleteButton.after(closeButton);

  return tools;
}

function createGroupButton(group: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.classList.add("button", "lg", "secondary", "custom-button");
  button.textContent = _(group);
  button.dataset.group = group;
  if (group === currentGroup.get()) {
    button.disabled = true;
  }
  button.addEventListener("click", () => {
    currentGroup.set(group);

    const activeTab = getCurrentTabName();
    if (activeTab !== "other") {
      updateBetterStyleComponents(activeTab);
    }
  });
  return button;
}

function updateGroup(tabName: StylesAvailableTab): void {
  getElementAll(`#better-styles-${tabName}-group-container > button`).forEach((button) => {
    const groupMatches = button.dataset.group === currentGroup.get();
    applyClasses(button, groupMatches, "gr-button-primary");
    applyClasses(button, !groupMatches, "gr-button-secondary");
    if (button instanceof HTMLInputElement) {
      button.disabled = groupMatches;
    }
  });
}

function createStyleEmptyContent(): HTMLDivElement {
  const emptyContent = document.createElement("div");
  emptyContent.classList.add("no-cards");

  const emptyMessage = document.createElement("p");
  emptyMessage.textContent = _(
    'Style not yet registered. "Save style" button for register a new style.'
  );
  emptyContent.appendChild(emptyMessage);

  return emptyContent;
}

export function updateBetterStyleComponents(tabName: StylesAvailableTab): void {
  const groups = getElement(`#better-styles-${tabName}-group-container`);
  const styles = getElement(`#better-styles-${tabName}-style-container`);

  if (!groups || !styles) {
    return;
  }

  removeAllChild(groups);
  removeAllChild(styles);

  const checkpoint = getElement("#sd_checkpoint_hash")?.title || "";
  const visibleStyles = getVisibleStyles(checkpoint);

  if (visibleStyles.some(({ styles }) => styles.length > 0)) {
    visibleStyles
      .sort((group1, group2) => group1.name.localeCompare(group2.name))
      .forEach((group) => {
        if (currentGroup.get() === "") {
          currentGroup.set(group.name);
        }
        groups.appendChild(createGroupButton(group.name));
        if (group.name !== currentGroup.get()) {
          return;
        }
        group.styles
          .sort((style1, style2) => style1.name.localeCompare(style2.name))
          .forEach((style) => {
            styles.appendChild(createCardComponent(style));
          });
      });
  } else {
    currentGroup.set("default");
    groups.appendChild(createGroupButton("default"));
    styles.appendChild(createStyleEmptyContent());
  }

  updateGroup(tabName);
}

function getVisibleStyles(checkpoint: string) {
  const visibleStyles: StyleGroup[] = [];
  let resetGroup = false;
  styleGroups.getOrDefault([]).forEach((group) => {
    const filteredStyles = group.styles.filter(
      (style) => !style.checkpoint || checkpoint === style.checkpoint
    );
    if (filteredStyles.length > 0) {
      visibleStyles.push({
        name: group.name,
        styles: filteredStyles,
      });
    } else if (group.name === currentGroup.get()) {
      resetGroup = true;
    }
  });
  if (resetGroup) {
    currentGroup.set("");
  }
  return visibleStyles;
}

function createCardComponent(style: Style) {
  const card = document.createElement("div");
  card.dataset.style = style.name;
  card.classList.add("card");

  const showDetailButton = document.createElement("button");
  showDetailButton.classList.add("show-detail-button");
  showDetailButton.title = _("Show styles detail");
  showDetailButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    showStyleDetailDialog(style);
  });
  card.appendChild(showDetailButton);

  const image = document.createElement("img");
  image.classList.add("image");
  image.setAttribute("draggable", "false");
  if (style.image) {
    image.src = `file=${imagesDir.get()}/${style.image}${updateTimestamp.get()}`;
  } else {
    image.src = "file=html/card-no-preview.png";
  }
  card.appendChild(image);

  const labelContainer = document.createElement("div");
  labelContainer.classList.add("actions");
  card.appendChild(labelContainer);

  const replacePreview = document.createElement("a");
  replacePreview.classList.add("replace-preview");
  replacePreview.href = "#";
  replacePreview.text = _("replace thumbnail");
  replacePreview.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const tabName = getCurrentTabName();
    if (tabName === "other") {
      throw new Error("Calls from non-valid tabs");
    }

    const image = selectedImage(tabName);
    if (image.get() == null) {
      showToast(_("Image is not selected"), "warning");
      return;
    }

    registerStyle(
      {
        group: currentGroup.getOrDefault("default"),
        style: {
          ...style,
          image: image.getOrDefault(""),
        },
      },
      (data) => {
        styleGroups.set(data);
        onReceiveStyleGroup();
      }
    );
  });
  labelContainer.appendChild(replacePreview);

  const label = document.createElement("span");
  label.classList.add("label");
  label.textContent = style.name;
  label.title = style.name;
  labelContainer.appendChild(label);

  card.addEventListener("click", () => {
    toggleClasses(card, "selected");
  });

  return card;
}
