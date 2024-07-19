import {
  queryAboutModal,
  queryShowAboutModalBtn,
  queryCloseAboutModalBtn,
} from "./queries.js";

export const initAboutModal = ({ onShow, onClose }) => {
  const aboutModal = queryAboutModal();
  const showAboutModalBtn = queryShowAboutModalBtn();
  const closeAboutModalBtn = queryCloseAboutModalBtn();

  showAboutModalBtn.addEventListener("click", () => {
    aboutModal.showModal();
    onShow();
  });

  closeAboutModalBtn.addEventListener("click", () => {
    aboutModal.close();
  });

  aboutModal.addEventListener("close", () => {
    onClose();
  });
};
