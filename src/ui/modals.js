import {
  queryAboutDialog,
  queryAboutDialogShowBtn,
  queryAboutDialogCloseBtn,
} from "./queries.js";

export const initAboutModal = ({ onShow, onClose }) => {
  const aboutDialog = queryAboutDialog();
  const showAboutDialogButton = queryAboutDialogShowBtn();
  const closeAboutDialogButton = queryAboutDialogCloseBtn();

  showAboutDialogButton.addEventListener("click", () => {
    aboutDialog.showModal();
    onShow();
  });

  closeAboutDialogButton.addEventListener("click", () => {
    aboutDialog.close();
  });

  aboutDialog.addEventListener("close", () => {
    onClose();
  });
};
