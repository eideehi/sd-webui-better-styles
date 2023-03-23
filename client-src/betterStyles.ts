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

  const component = document.createElement("div");
  component.id = `better-styles-${tabName}-styles`;
  component.classList.add(
    "better-styles",
    "flex",
    "flex-col",
    "w-full",
    "gap-4",
    "gr-compact",
    "!hidden"
  );
  getElement(`div#${tabName}_extra_networks`)?.after(component);

  const tools = createToolsComponent(tabName);
  component.appendChild(tools);

  const view = document.createElement("div");
  component.appendChild(view);

  const groups = document.createElement("div");
  groups.id = `better-styles-${tabName}-group-container`;
  groups.classList.add("!border-x-2", "border-gray-200", "flex", "px-2", "pb-0", "pt-4");
  view.appendChild(groups);

  groups.appendChild(createGroupButton("default"));
  updateGroup(tabName);

  const styles = document.createElement("div");
  styles.id = `better-styles-${tabName}-style-container`;
  styles.classList.add(
    "tabitem",
    "p-2",
    "!border-x-2",
    "!border-b-2",
    "border-gray-200",
    "relative",
    "flex",
    "flex-wrap",
    "gap-x-2",
    "block"
  );
  groups.after(styles);

  styles.appendChild(createStyleEmptyContent());
  getElement("#setting_sd_model_checkpoint select")?.addEventListener("change", () => {
    const currentCheckpoint = checkpoint().get();
    const interval = setInterval(() => {
      if (checkpoint().get() !== currentCheckpoint) {
        updateBetterStyleComponents(tabName);
        clearInterval(interval);
      }
    }, 250);
  });

  const toggleButton = document.createElement("button");
  toggleButton.id = `better-styles-${tabName}-toggle`;
  toggleButton.textContent = "🏷";
  toggleButton.classList.add("gr-button", "gr-button-lg", "gr-button-tool");
  toggleButton.title = _("Show Better Styles");
  toggleButton.addEventListener("click", () => {
    hidden(component);
  });
  getElement(`#${tabName}_tools`)?.appendChild(toggleButton);
}

function createToolsComponent(tabName: StylesAvailableTab) {
  const tools = document.createElement("div");
  tools.classList.add("flex", "!border-b-2", "flex-wrap", "dark:border-gray-700");

  const label = document.createElement("p");
  label.classList.add(
    "bg-white",
    "px-4",
    "pb-2",
    "pt-1.5",
    "rounded-t-lg",
    "border-gray-200",
    "-mb-[2px]",
    "border-2",
    "border-b-0",
    "flex",
    "items-center"
  );
  label.textContent = _("Better Styles");
  tools.appendChild(label);

  const searchBar = document.createElement("textarea");
  searchBar.classList.add(
    "scroll-hide",
    "inline-block",
    "gr-box",
    "gr-input",
    "w-full",
    "gr-text-input",
    "search",
    "overflow-y-scroll",
    "max-w-[16rem]",
    "m-[0.3rem]",
    "self-center",
    "resize-none"
  );
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
  applyButton.classList.add("gr-button", "gr-button-lg", "gr-button-secondary", "m-[0.3rem]");
  applyButton.textContent = _("Apply style");
  applyButton.addEventListener("click", (event) => {
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
  saveButton.classList.add("gr-button", "gr-button-lg", "gr-button-secondary", "m-[0.3rem]");
  saveButton.textContent = _("Save style");
  saveButton.addEventListener("click", (event) => {
    showStyleSaveDialog();
  });
  applyButton.after(saveButton);

  const deleteButton = document.createElement("button");
  deleteButton.id = `better-styles-${tabName}-delete`;
  deleteButton.classList.add("gr-button", "gr-button-lg", "gr-button-secondary", "m-[0.3rem]");
  deleteButton.textContent = _("Delete style");
  deleteButton.addEventListener("click", (event) => {
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
  closeButton.classList.add("gr-button", "gr-button-lg", "gr-button-secondary", "m-[0.3rem]");
  closeButton.textContent = _("Close Better Styles");
  closeButton.addEventListener("click", () => {
    hidden(getElement(`#better-styles-${tabName}-styles`), true);
  });
  deleteButton.after(closeButton);

  return tools;
}

function createGroupButton(group: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.textContent = _(group);
  button.classList.add("gr-box-sm", "gr-button-lg", "m-[0.3rem]");
  button.dataset.group = group;
  if (group === currentGroup.get()) {
    button.disabled = true;
  }
  button.addEventListener("click", (event) => {
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
  emptyContent.classList.add("m-2", "mt-5");

  const emptyMessage = document.createElement("p");
  emptyMessage.classList.add("text-2xl", "dark:text-white");
  emptyMessage.textContent = _(
    `Style not yet registered. \"Save style\" button for register a new style.`
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
  card.classList.add(
    "inline-block",
    "m-2",
    "w-64",
    "h-64",
    "rounded",
    "!overflow-hidden",
    "cursor-pointer",
    "relative",
    "select-none"
  );
  card.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    showStyleDetailDialog(style);
  });

  const showBoxShadow = (show: boolean) => {
    if (show) {
      card.style.boxShadow = "0 0 2px 0.3em rgb(0 128 255 / 35%)";
    } else {
      card.style.boxShadow = "";
    }
  };

  card.addEventListener("mouseenter", (event) => {
    showBoxShadow(!card.classList.contains("selected"));
  });
  card.addEventListener("mouseleave", (event) => {
    showBoxShadow(false);
  });

  const image = document.createElement("img");
  if (style.image) {
    image.src = `file=${imagesDir.get()}/${style.image}${updateTimestamp.get()}`;
  } else {
    image.src = "file=html/card-no-preview.png";
  }
  image.classList.add(
    "absolute",
    "object-cover",
    "w-full",
    "h-full",
    "transition-transform",
    "ease-out",
    "duration-500",
    "hover:scale-105"
  );
  image.setAttribute("draggable", "false");
  card.appendChild(image);

  const labelContainer = document.createElement("div");
  labelContainer.classList.add(
    "absolute",
    "bottom-0",
    "inset-x-0",
    "p-2",
    "flex",
    "flex-col",
    "text-white",
    "bg-black/50"
  );
  labelContainer.style.boxShadow = "0 0 0.25em 0.25em rgb(0 0 0 / 50%)";
  labelContainer.style.textShadow = "0 0 0.2em black";
  card.appendChild(labelContainer);

  const replacePreview = document.createElement("a");
  replacePreview.classList.add("mt-1", "mb-3", "ml-1", "!hidden", "hover:text-red", "text-sm");
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
  label.classList.add("text-xl", "truncate");
  label.textContent = style.name;
  label.title = style.name;
  labelContainer.appendChild(label);

  label.addEventListener("mouseenter", (event) => {
    replacePreview.classList.remove("!hidden");
  });
  labelContainer.addEventListener("mouseleave", (event) => {
    replacePreview.classList.add("!hidden");
  });
  card.addEventListener("click", (event) => {
    toggleClasses(
      card,
      "selected",
      "outline",
      "outline-2",
      "outline-offset-2",
      "outline-[#ff7c00]"
    );
    showBoxShadow(!card.classList.contains("selected"));
  });

  return card;
}
