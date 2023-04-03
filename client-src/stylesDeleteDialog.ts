import { _, getElementAll } from "./utils";
import { currentGroup, styleGroups } from "./variables";
import { closeModal, showModal } from "./modal";
import { showToast } from "./toast";
import { onReceiveStyleGroup } from "./betterStyles";
import { deleteStyles } from "./webui";

export function showStylesDeleteDialog(tabName: StylesAvailableTab) {
  const content = document.createElement("div");
  content.classList.add("save-style", "modal-content"  );
  content.style.width = "clamp(20rem, 70vw, 42.5rem)";
  content.style.boxShadow = "0px 0px 4px 0.25rem rgb(8 8 8 / 50%)";

  const message = document.createElement("p");
  message.classList.add("text");
  message.textContent = _(
    "Delete all selected styles. This action cannot be undone. Are you sure?"
  );
  content.appendChild(message);

  const buttons = document.createElement("div");
  buttons.classList.add("button-container");
  content.appendChild(buttons);

  const submit = document.createElement("button");
  submit.classList.add("button", "lg", "primary");
  submit.textContent = _("Execute the deletion");
  submit.addEventListener("click", () => {
    const selectedStyleCards = getElementAll(`#better-styles-${tabName}-style-container .selected`);
    deleteStyles(
      {
        group: currentGroup.getOrDefault(""),
        styles: [
          ...selectedStyleCards
            .map((card) => card.dataset.style || "")
            .filter((style) => style.length > 0),
        ],
      },
      (json) => {
        closeModal(content);
        styleGroups.set(json);
        onReceiveStyleGroup();
        showToast(_("Styles deleted"), "success");
      }
    );
  });
  buttons.appendChild(submit);

  const cancel = document.createElement("button");
  cancel.classList.add("button", "lg", "secondary");
  cancel.textContent = _("Close without deleting");
  cancel.addEventListener("click", () => {
    closeModal(content);
  });
  buttons.appendChild(cancel);

  showModal(content);
}
