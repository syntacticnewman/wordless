import GA from "../../services/analytics.js";
import AboutModal from "./about-modal.js";

export const initModals = () => {
  AboutModal.init({
    onShow: () => GA.trackAboutModal(true),
    onClose: () => GA.trackAboutModal(false),
  });
};
