import keyboard from "../../modules/keyboard.js";
import {
  queryAboutModal,
  queryCloseAboutModalBtn,
  queryShowAboutModalBtn,
} from "../queries.js";

const init = ({ onShow, onClose }) => {
  const modal = queryAboutModal();
  const showBtn = queryShowAboutModalBtn();
  const closeBtn = queryCloseAboutModalBtn();

  // handle Esc key
  modal.addEventListener("keydown", (event) => {
    if (keyboard.isEsc(event.key)) {
      event.stopPropagation();
      modal.close();
    }
  });

  // show button
  showBtn.addEventListener("click", () => {
    modal.showModal();
    onShow();
  });

  // close button
  closeBtn.addEventListener("click", () => {
    modal.close();
  });

  // handle close event
  modal.addEventListener("close", () => {
    onClose();
  });
};

export default { init };
