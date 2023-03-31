import { _, getElementAll } from "./utils";
import { currentGroup, styleGroups } from "./variables";
import { closeModal, showModal } from "./modal";
import { showToast } from "./toast";
import { onReceiveStyleGroup } from "./betterStyles";
import { deleteStyles } from "./webui";

export function showStylesDeleteDialog(tabName: StylesAvailableTab) {
  const frame = document.createElement("div");
  frame.classList.add(
    "gr-compact",
    "gr-block",
    "gr-box",
    "!m-auto",
    "flex",
    "flex-col",
    "py-6",
    "px-4",
    "gap-y-6"
  );
  frame.style.width = "clamp(20rem, 70vw, 42.5rem)";
  frame.style.boxShadow = "0px 0px 4px 0.25rem rgb(8 8 8 / 50%)";

  const message = document.createElement("p");
  message.classList.add("text-xl");
  message.textContent = _(
    "Delete all selected styles. This action cannot be undone. Are you sure?"
  );
  frame.appendChild(message);

  const buttons = document.createElement("div");
  buttons.classList.add("flex", "justify-end", "gap-x-2");
  frame.appendChild(buttons);

  const submit = document.createElement("button");
  submit.classList.add("gr-button", "gr-button-lg", "gr-button-primary");
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
        closeModal(frame);
        styleGroups.set(json);
        onReceiveStyleGroup();
        showToast(_("Styles deleted"), "success");
      }
    );
  });
  buttons.appendChild(submit);

  const cancel = document.createElement("button");
  cancel.classList.add("gr-button", "gr-button-lg");
  cancel.textContent = _("Close without deleting");
  cancel.addEventListener("click", () => {
    closeModal(frame);
  });
  buttons.appendChild(cancel);

  showModal(frame);
}
